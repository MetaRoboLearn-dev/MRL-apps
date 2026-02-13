import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Navbar from "../components/UI/Navbar.tsx";
import ProviderWrapper from "../providers/ProviderWrapper.tsx";
import Loader from "../components/UI/Loader.tsx";
import Modal from "../components/UI/Modal.tsx";

const RootLayout = () => {
  return(
    <>
      <ProviderWrapper>
        <Loader />
        <div className="w-full h-screen flex flex-col">
          <Navbar/>
          <Outlet/>
          <Modal/>
        </div>
      </ProviderWrapper>

      <TanStackRouterDevtools/>
    </>
  )}

export const Route = createRootRoute({ component: RootLayout })