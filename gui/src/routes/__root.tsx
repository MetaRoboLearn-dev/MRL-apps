import { createRootRouteWithContext, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Navbar from "../components/UI/Navbar.tsx";
import AppProviders from "../providers/wrappers/AppProviders.tsx";
import Modal from "../components/UI/Modal.tsx";

interface RouterContext {
  queryClient: QueryClient
}

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && location.pathname !== '/login') {
      navigate({ to: '/login' });
    }
  }, [user, loading, location.pathname, navigate]);

  const embedded =
    new URLSearchParams(window.location.search).get("embedded") === "true";

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user && location.pathname !== '/login') {
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {location.pathname !== '/login' && !embedded && <Navbar />}
      <Outlet />
      <Modal />
    </div>
  );
}

const RootLayout = () => {
  return (
    <AppProviders>
      <ProtectedLayout />
    </AppProviders>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout
})