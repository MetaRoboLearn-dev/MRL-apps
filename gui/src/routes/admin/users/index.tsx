import { createFileRoute } from '@tanstack/react-router'
import {queryOptions, useSuspenseQuery} from "@tanstack/react-query";
import {getUsers} from "../../../api/usersApi.ts";

export type User = {
  id: number
  username: string
  first_name: string
  last_name: string
  role_id: number
  active: boolean
  created_at: Date
  updated_at: Date
  created_by: number | null
  updated_by: number | null
  last_login: Date | null
}

const usersQueryOptions = () =>
  queryOptions({
    queryKey: ['users'],
    queryFn: getUsers,
  })

export const Route = createFileRoute('/admin/users/')({
  loader: ({context}) => {
    return context.queryClient.ensureQueryData(usersQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { status, data, error } = useSuspenseQuery(usersQueryOptions());


  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  return <div>{JSON.stringify(data)}</div>
}
