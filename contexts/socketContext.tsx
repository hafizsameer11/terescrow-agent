import { API_BASE_URL } from '@/utils/apiConfig';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './authContext';
import { showTopToast } from '@/utils/helpers';

interface SocketContextType {
  socket: Socket | null;
  connectToSocket: (
    departmentId: string,
    categoryId: string,
    subCategoryId: string
  ) => void;
  disconnectFromSocket: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useAuth();

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
    const newSocket = io(API_BASE_URL, {
      query: {
        token: token,
      },
    }); // Replace with your server URL
    newSocket.on('connect', () => {
      setSocket(newSocket);
      console.log('Connected to Socket.io server');
    });
    newSocket.on('connect_error', (error) => {
      console.error('Error Connecting toSocket : ', error);
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to connect to Socket server',
      });
    });
  };

  const disconnectFromSocket = () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
    }
  };

  //   useEffect(() => {
  //     // Initialize the socket connection
  //     const newSocket = io(API_BASE_URL); // Replace with your server URL
  //     setSocket(newSocket);

  //     // socket?.on('connect', () => {

  //     // })

  //     // Cleanup on unmount
  //     return () => {
  //         if(newSocket){
  //             newSocket.disconnect();
  //         }
  //     };
  //   }, []);

  return (
    <SocketContext.Provider
      value={{ socket, connectToSocket, disconnectFromSocket }}
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
