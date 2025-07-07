import React, { useState, useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import SelectRolePage from './pages/SelectRolePage';

if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#/dashboard';
}

function App() {
  // if (!window.location.hash || window.location.hash === '#') {
  //   window.location.hash = '#/dashboard';
  // }

  const [route, setRoute] = useState(window.location.hash);
  console.log("Routing to: ", route);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); 

  // The router logic now depends on the 'route' state variable
  let component;
  switch (route) {
    case '#/profile':
      component = <ProtectedRoute><ProfilePage /></ProtectedRoute>;
      break;
    case '#/dashboard':
      component = <ProtectedRoute><DashboardPage /></ProtectedRoute>;
      break;
    case '#/select-role':
      component = <ProtectedRoute><SelectRolePage /></ProtectedRoute>;
      break;
    default:
      component = <HomePage />;
  }

  return (
    <div>
    <Header/>
      <main className="container mx-auto p-4">
        {component}
      </main>
    </div>
  );
}

export default App;