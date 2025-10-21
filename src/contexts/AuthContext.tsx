import React, { createContext, ReactNode, useContext, useState } from 'react';

// User interface
export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  email: string;
  password: string;
  profilePicture: string;
  initials: string;
}

export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Maya Jordan',
    username: 'maya.jordan',
    role: 'Dispatcher',
    email: 'maya.jordan@itruckr.com',
    password: '12345678',
    profilePicture: './maya.jpg',
    initials: 'MM',
  },
  {
    id: '2',
    name: 'John Smith',
    username: 'john.smith',
    role: 'Fleet Manager',
    email: 'john.smith@itruckr.com',
    password: '12345678',
    profilePicture: '/pp.jpg',
    initials: 'JS',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    username: 'sarah.johnson',
    role: 'Operations Manager',
    email: 'sarah.johnson@itruckr.com',
    password: '12345678',
    profilePicture: '/pp.jpg',
    initials: 'SJ',
  },
  {
    id: '4',
    name: 'Mike Davis',
    username: 'mike.davis',
    role: 'Driver Coordinator',
    email: 'mike.davis@itruckr.com',
    password: '12345678',
    profilePicture: '/pp.jpg',
    initials: 'MD',
  },
  {
    id: '5',
    name: 'Dispatcher',
    username: 'dispatch',
    role: 'Dispatcher',
    email: 'dsp.moises@itruckr.com',
    password: '12345678',
    profilePicture: '/pp.jpg',
    initials: 'DP',
  },
];

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const user = dummyUsers.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
