// src/routes/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
