// Fix: Provide a valid component implementation for App.tsx to resolve module errors.
import React from 'react';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}

export default App;
