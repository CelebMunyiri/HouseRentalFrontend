import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from './components/AuthContext';
import './App.css';

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();

// Lazy load components
const Houses = lazy(() => import('./components/Products/house'));
const Registration = lazy(() => import('./components/Register/registration'));
const Login = lazy(() => import('./components/Login/login'));
const LandLord = lazy(() => import('./components/LandlordHouses'));
const CreateHouse = lazy(() => import('./components/CreateHouse'));
const Chat = lazy(() => import('./components/Chat/Chat'));

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      {/* Wrap with QueryClientProvider for React Query */}
      <QueryClientProvider client={queryClient}>
        <Router>
          {/* Suspense for lazy loading fallback */}
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/houses" element={<Houses />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/landlord" element={<LandLord />} />
              <Route path="/house/create" element={<CreateHouse />} />
              <Route path="/chat/:houseId/:posterId" element={<Chat />} /> {/* Chat Route */}
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
