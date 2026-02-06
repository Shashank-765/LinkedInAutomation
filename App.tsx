
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PostCreator from './pages/PostCreator';
import Login from './pages/Login';
import UserManagement from './pages/admin/UserManagement';
import AdManagement from './pages/admin/AdManagement'; // Added
import PostApprovals from './pages/admin/PostApprovals'; 
import PlanManagement from './pages/admin/PlanManagement';
import ScheduleManager from './pages/user/ScheduleManager';
import AutoPilotManager from './pages/user/AutoPilotManager';
import Analytics from './pages/shared/Analytics';
import Settings from './pages/shared/Settings';
import LinkedInCallback from './pages/auth/LinkedInCallback';
import { ToastContainer } from 'react-toastify';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/404';


const Router: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [route, setRoute] = React.useState(window.location.hash || '#/');

  React.useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) window.location.hash = '#/';
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#/home' || route === '#/') return <LandingPage />;
  if (!isAuthenticated && route === '#/login') return <Login />;

  const renderRoute = () => {
    const isLinkedInCallback = window.location.href.includes('/?code');
    if (isLinkedInCallback) return <LinkedInCallback />;

    switch (route) {
      case '#/dashboard': return <Dashboard />;
      case '#/create': return <PostCreator />;
      case '#/user/review': return <PostApprovals />; 
      case '#/schedule': return <ScheduleManager />;
      case '#/autopilot': return <AutoPilotManager />;
      case '#/admin/users': return <UserManagement />;
      case '#/admin/ads': return <AdManagement />; // Added
      case '#/admin/plans': return <PlanManagement />;
      case '#/analytics': return <Analytics />;
      case '#/settings': return <Settings />;
      default: return <NotFoundPage />;
    }
  };

  return <Layout>{renderRoute()}</Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastContainer aria-label="Notifications" />
      <Router />
    </AuthProvider>
  );
};

export default App;
