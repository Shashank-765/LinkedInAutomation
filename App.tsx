
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PostCreator from './pages/PostCreator';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import UserManagement from './pages/admin/UserManagement';
import PostApprovals from './pages/admin/PostApprovals'; 
import PlanManagement from './pages/admin/PlanManagement';
import ScheduleManager from './pages/user/ScheduleManager';
import Analytics from './pages/shared/Analytics';
import Settings from './pages/shared/Settings';
import LinkedInCallback from './pages/auth/LinkedInCallback';

// Import 16 Separate Static Pages
import AutonomousOps from './pages/platform/AutonomousOps';
import AiSynthesis from './pages/platform/AiSynthesis';
import Telemetry from './pages/platform/Telemetry';
import AssetEngine from './pages/platform/AssetEngine';
import Infrastructure from './pages/company/Infrastructure';
import StrategicPartners from './pages/company/StrategicPartners';
import NetworkStatus from './pages/company/NetworkStatus';
import PressNode from './pages/company/PressNode';
import ApiInterface from './pages/resources/ApiInterface';
import Documentation from './pages/resources/Documentation';
import Playbooks from './pages/resources/Playbooks';
import Community from './pages/resources/Community';
import PrivacyProtocol from './pages/legal/PrivacyProtocol';
import ServiceAgreement from './pages/legal/ServiceAgreement';
import SecurityAudit from './pages/legal/SecurityAudit';
import GdprNode from './pages/legal/GdprNode';
import NotFoundPage from './pages/404';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const Router: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [route, setRoute] = React.useState(window.location.pathname || '/');

  // React.useEffect(() => {
  //   const handlePathChange = () => setRoute(window.location.pathname || '/');
  //   window.addEventListener('popstate', handlePathChange);
  //   if (!window.location.pathname) window.location.pathname = '/';
  //   return () => window.removeEventListener('popstate', handlePathChange);
  // }, []);
  // React.useMemo(() => first, [second])
  const renderRoute = () => {
    console.log('route', route)
  if (route === '/linkedin/callback') return <LinkedInCallback />;


    if (route.startsWith('/reset-password/')) return <ResetPassword />;
    // if (!isAuthenticated) return <LandingPage />;

    // Static Routes - Publicly Accessible
    switch (route) {
      case '/':
      case '/home': return <LandingPage />;
      case '/login': return <Login />;
            case '/forgot-password': return <ForgotPassword />;

      // case '/pricing': return <PlanManagement />;
      // Platform
      case '/platform/autonomous-ops': return <AutonomousOps />;
      case '/platform/ai-synthesis': return <AiSynthesis />;
      case '/platform/telemetry': return <Telemetry />;
      case '/platform/asset-engine': return <AssetEngine />;
      // Company
      case '/company/infrastructure': return <Infrastructure />;
      case '/company/strategic-partners': return <StrategicPartners />;
      case '/company/network-status': return <NetworkStatus />;
      case '/company/press-node': return <PressNode />;
      // Resources
      case '/resources/api-interface': return <ApiInterface />;
      case '/resources/documentation': return <Documentation />;
      case '/resources/playbooks': return <Playbooks />;
      case '/resources/community': return <Community />;
      // Legal
      case '/legal/privacy-protocol': return <PrivacyProtocol />;
      case '/legal/service-agreement': return <ServiceAgreement />;
      case '/legal/security-audit': return <SecurityAudit />;
      case '/legal/gdpr-node': return <GdprNode />;
      // Dashboard
      case '/dashboard': return <Dashboard />;
      case '/create': return <PostCreator />;
      case '/user/review': return <PostApprovals />; 
      case '/schedule': return <ScheduleManager />;
      case '/admin/users': return <UserManagement />;
      case '/admin/plans': return <PlanManagement />;
      case '/analytics': return <Analytics />;
      case '/settings': return <Settings />;
      default: return <NotFoundPage />;
    }

    

   
  };

  // const isPublicRoute = [
  //  '/','/home', '/login', '/pricing', '/platform', '/company', '/resources', '/legal'
  // ].some(p => route.startsWith(p));
  const isNotPublicRoute = [
    '/dashboard', '/create', '/user/review', '/schedule', '/admin', '/analytics', '/settings','/linkedin/callback'
  ].some(p => route.startsWith(p));

  // console.log('isPublicRoute ', isPublicRoute , 'isNotPublicRoute ', isNotPublicRoute, 'isAuthenticated ', isAuthenticated, 'route ', route);

  if (isNotPublicRoute && isAuthenticated) {
    return <Layout>{renderRoute()}</Layout>;
  } else if (!isNotPublicRoute && !isAuthenticated) {
    return renderRoute();
  }

  // Dashboard pages use Sidebar Layout
  // return <Layout>{renderRoute()}</Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;
