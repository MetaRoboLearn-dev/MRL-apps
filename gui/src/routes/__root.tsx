import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient } from '@tanstack/react-query'
import Navbar from "../components/UI/Navbar.tsx";
import AppProviders from "../providers/wrappers/AppProviders.tsx";
// import Loader from "../components/UI/Loader.tsx";
import Modal from "../components/UI/Modal.tsx";

interface RouterContext {
  queryClient: QueryClient
}

const RootLayout = () => {
  return(
    <>
      <AppProviders>
        {/*<Loader />*/}
        <div className="w-full h-screen flex flex-col">
          <Navbar/>
          <Outlet/>
          <Modal/>
        </div>
      </AppProviders>

      {/*<TanStackRouterDevtools/>*/}
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout
})