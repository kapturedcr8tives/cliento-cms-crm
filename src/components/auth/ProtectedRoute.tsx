import React from 'react';
import { Navigate } from 'react-router-dom';

// In a real app, you'd have a hook like this:
// import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: React.PropsWithChildren) {
  // For now, we'll simulate an authenticated user.
  // In a real app, this would check for a valid session token.
  const isAuthenticated = true; // const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them there after they login.
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
