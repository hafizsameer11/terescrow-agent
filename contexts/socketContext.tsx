import { API_BASE_URL } from '@/utils/apiConfig';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './authContext';
import { showTopToast } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextType {
  socket: Socket | null;
  onlineAgents: Agent[];
  isAdminOnline: NonAgentUser | false;
  disconnectFromSocket: () => void;
  onlineCustomers: NonAgentUser[];
}

export enum UserRoles {
  admin,
  agent,
  customer,
}

export interface Agent {
  userId: string;
  socketId: string;
  assignedDepartments: {
    id: string;
  };
}

export interface NonAgentUser {
  userId: string;
  socketId: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineAgents, setOnlineAgents] = useState<Agent[]>([]);
  const [isAdminOnline, setIsAdminOnline] = useState<NonAgentUser | false>(
    false
  );
  const [onlineCustomers, setOnlineCustomers] = useState<NonAgentUser[]>([]);

  const { token, userData } = useAuth();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (token) {
      connectToSocket();
    }

    return () => {
      disconnectFromSocket();
    };
  }, [token]);

  const connectToSocket = async () => {
    if (socket) {
      socket.disconnect(); // Clean up existing socket connection
    }
    if (token) {
      const newSocket = io(API_BASE_URL, {
        query: {
          token: token,
        },
      }); // Replace with your server URL
      newSocket.on('connect', () => {
        setSocket(newSocket);
        console.log('Connected to Socket.io server');
      });

      newSocket.on('newAgentJoined', (agent: Agent) => {
        setOnlineAgents((prevOnlineAgents) => [...prevOnlineAgents, agent]);
      });

      newSocket.on(
        'onlineUsers',
        ({
          customers,
          agents,
          admin,
        }: {
          customers: NonAgentUser[];
          agents: Agent[];
          admin: NonAgentUser | null;
        }) => {
          if (agents?.length > 0) {
            setOnlineAgents((previous) => [...previous, ...agents]);
          }
          if (userData?.role !== UserRoles.admin && admin) {
            setIsAdminOnline(admin);
          }
          if (customers?.length > 0) {
            setOnlineCustomers((prev) => [...prev, ...customers]);
          }
        }
      );

      newSocket.on(
        'adminJoined',
        (admin: { userId: string; socketId: string }) => {
          if (userData?.role == UserRoles.admin) return;
          setIsAdminOnline(admin);
          showTopToast({
            type: 'info',
            text1: 'News!',
            text2: 'The Admin has joined',
          });
        }
      );

      newSocket.on('customerJoined', (customer: NonAgentUser) => {
        if (userData?.role == UserRoles.agent) return;
        setOnlineCustomers((prevOnlineCustomers) => [
          ...prevOnlineCustomers,
          customer,
        ]);
      });

      newSocket.on('customerAssigned', async () => {
        showTopToast({
          type: 'success',
          text1: 'Alert!',
          text2: 'A new customer has been assigned',
        });
        // queryClient.refetchQueries({
        //   queryKey: ['all-chats-with-customer'],
        // });
        await queryClient.invalidateQueries({
          queryKey: ['all-chats-with-customer'],
        });
      });

      newSocket.on('connect_error', (error) => {
        console.error('Error Connecting toSocket : ', error);
        showTopToast({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to connect to Socket server',
        });
      });

      newSocket.on(
        'user-disconnected',
        ({ id, role }: { id: number; role: UserRoles }) => {
          if (role == UserRoles.admin) {
            setIsAdminOnline(false);
          }
          if (role == UserRoles.agent) {
            setOnlineAgents((prevOnlineAgents) =>
              prevOnlineAgents.filter((agent) => +agent.userId !== id)
            );
          }
          if (role == UserRoles.customer) {
            setOnlineCustomers((prevOnlineCustomers) =>
              prevOnlineCustomers.filter((customer) => +customer.userId !== id)
            );
          }

          showTopToast({
            type: 'error',
            text1: 'Alert!',
            text2: `A ${role} has been disconnected`,
          });
        }
      );
      newSocket.on('disconnect', () => {
        disconnectFromSocket();
      });
    }
  };

  const transferChatToAgent = async (
    departmentId: string,
    categoryId: string
  ) => {
    if (socket) {
      socket.emit('transferChatToAgent', {
        departmentId,
        categoryId,
      });
    }
  };

  const disconnectFromSocket = () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineAgents,
        disconnectFromSocket,
        isAdminOnline,
        onlineCustomers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the SocketContext
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
