import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { UserRoles } from './socketContext';
import { AccountActivity } from '@/utils/queries/datainterfaces';
// Define the AuthContextType interface
interface AuthContextType {
  token: string;
  userData: {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    role: UserRoles | string;
    profilePicture: string | null;
    gender: string | null;
    createdAt?: string;
    phoneNumber?: string;
    country?: string;
    assignedDepartments: { department: { id: number; title: string } }[];
    accountActivity?:AccountActivity[]

  } | null;
  setToken: (token: string) => Promise<void>;
  setUserData: (userData: AuthContextType['userData']) => void;
  logout: () => Promise<void>;
}

// Define the initial state type
interface AuthState {
  token: string;
  userData: AuthContextType['userData'];
}

// Define action types
type AuthAction =
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'SET_USER_DATA'; payload: AuthContextType['userData'] }
  | { type: 'LOGOUT' };

// Define the initial state
const initialState: AuthState = {
  token: '',
  userData: null,
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    case 'LOGOUT':
      return { ...initialState }; // Clear token and userData
    default:
      throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setToken = async (token: string) => {
    await SecureStore.setItemAsync('authToken', token);
    dispatch({ type: 'SET_TOKEN', payload: token });
  };

  const setUserData = (userData: AuthContextType['userData']) => {
    dispatch({ type: 'SET_USER_DATA', payload: userData });
  };

  const logout = async () => {
    // Example: Remove token from localStorage or perform other cleanup
    await SecureStore.deleteItemAsync('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, setToken, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
