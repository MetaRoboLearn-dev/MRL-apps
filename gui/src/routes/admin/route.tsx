import {createFileRoute, Outlet} from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  notFoundComponent: () => <div>this page doesnt exist</div>,
})

function RouteComponent() {
  return (
    <div>
      {/*<span>Hello "/admin/"!</span>*/}
      <Outlet/>
    </div>
  )}
