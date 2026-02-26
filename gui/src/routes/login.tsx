import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useState, FormEvent } from 'react'
import {useAuth} from "../hooks/useAuth.ts";
import LogoWhite from '/logo_black_notext.svg'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()

  const mutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: () => {
      navigate({ to: '/' })
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(undefined)

    if (!username.trim()) {
      setError('Username is required')
      return
    }
    if (!password.trim()) {
      setError('Password is required')
      return
    }

    mutation.mutate()
  }

  return (
    <div className="flex-1 flex items-center justify-center ">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border-3 border-sunglow-500 shadow-lg p-8">
          <div className={'flex flex-col items-center justify-center'}>
            <img src={LogoWhite} alt={'logo-white'} className={'h-full w-20'}/>
            <h1 className={'font-display font-bold text-2xl mt-1'}>MetaRoboLearn</h1>
          </div>
          <p className="text-dark-neutrals-400 text-center mb-8 mt-4">Prijavi se za nastavak</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-neutrals-400 mb-1">
                Korisničko ime
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-sunglow-500 transition"
                placeholder="Unesi korisničko ime"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-neutrals-400 mb-1">
                Lozinka
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-sunglow-500 transition"
                placeholder="Unesi lozinku"
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 bg-emerald-500 text-white font-display font-bold text-lg rounded-md hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Prijava...' : 'Prijavi se'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}