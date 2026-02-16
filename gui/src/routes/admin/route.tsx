import {createFileRoute, Outlet} from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  notFoundComponent: () => <div>this page doesnt exist</div>,
})

function RouteComponent() {
  return (
    <div className={'w-9/10 mx-auto'}>
      {/*<span>Hello "/admin/"!</span>*/}
      <Outlet/>
    </div>
  )}
