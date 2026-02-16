export type User = {
  id: number
  username: string
  first_name: string
  last_name: string
  role_id: number
  role_name: string
  active: boolean
  created_at: Date
  updated_at: Date
  created_by: number | null
  updated_by: number | null
  last_login: Date | null
}

export type CreateUserRequest = {
  username: string
  password_hash: string
  first_name: string
  last_name: string
  role_id: number
}

export type UpdateUserRequest = {
  username: string
  password_hash?: string
  first_name: string
  last_name: string
  role_id: number
}