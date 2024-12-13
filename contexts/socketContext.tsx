import { API_BASE_URL } from '@/utils/apiConfig';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './authContext';
import { showTopToast } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextType {
  socket: Socket | null;
  onlineAgents: { userId: string; socketId: string }[];
  isAdminOnline: { userId: string; socketId: string } | null;
  disconnectFromSocket: () => void;
  onlineCustomers: { userId: string; socketId: string }[];
}

export enum UserRoles {
  admin,
  agent,
  customer,
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineAgents, setOnlineAgents] = useState<
    { userId: string; socketId: string }[]
  >([]);
  const [isAdminOnline, setIsAdminOnline] = useState<{
    userId: string;
    socketId: string;
  } | null>(null);
  const [onlineCustomers, setOnlineCustomers] = useState<
    { userId: string; socketId: string }[]
  >([]);

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

      newSocket.on(
        'newAgentJoined',
        (agent: { userId: string; socketId: string }) => {
          setOnlineAgents((prevOnlineAgents) => [...prevOnlineAgents, agent]);
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

      newSocket.on(
        'customerJoined',
        (customer: { userId: string; socketId: string }) => {
          if (userData?.role == UserRoles.agent) return;
          setOnlineCustomers((prevOnlineCustomers) => [
            ...prevOnlineCustomers,
            customer,
          ]);
        }
      );

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
