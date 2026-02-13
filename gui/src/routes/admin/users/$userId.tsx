import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/$userId')({
  component: RouteComponent,
  loader: async ({params}) => {
    return {
      userId: params.userId
    }
  }
})

function RouteComponent() {
  const { userId } = Route.useLoaderData();
  return <div>Hello "/admin/users/{userId}"!</div>
}
