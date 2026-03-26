// routes/profile.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { getMyBadges } from '../api/userBadgeApi.ts'
import { formatLocalDateTime } from '../utils'
import {UserBadgeEntry} from "../types/userBadgeTypes.ts";

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuth()

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ['myBadges'],
    queryFn: getMyBadges,
    enabled: !!user,
  })

  if (!user) return null

  const totalPoints = badges.reduce((sum, b) => sum + b.value, 0)

  return (
    <div className="relative w-4/5 min-w-200 mx-auto font-display p-10">
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-dark-neutrals-500 tracking-wide">Moj profil</h1>
        <div className="mt-3 mx-auto w-24 h-1 bg-sunglow-400 rounded-full" />
      </div>

      <div className="space-y-6">
        {/* User Info Card */}
        <div className="bg-white p-8 border-3 border-white-smoke-500 rounded-md">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-turquoise-200 border-3 border-turquoise-400 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-turquoise-600">
                {user.first_name[0]}{user.last_name[0]}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-dark-neutrals-500">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-lg text-dark-neutrals-300 mt-1">@{user.username}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold uppercase tracking-wide text-dark-neutrals-300">Ukupno zvjezdica</div>
              <div className="text-4xl font-bold text-sunglow-500">{totalPoints}</div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white p-8 border-3 border-white-smoke-500 rounded-md">
          <h3 className="text-2xl font-bold text-dark-neutrals-500 mb-6">Moje značke</h3>

          {isLoading ? (
            <div className="text-dark-neutrals-300">Učitavanje...</div>
          ) : badges.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🏅</div>
              <h4 className="text-xl font-bold text-dark-neutrals-400">Još nemaš značke</h4>
              <p className="mt-2 text-dark-neutrals-300">Nastavi rješavati zadatke i uskoro ćeš dobiti svoju prvu značku!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {badges.map((ub: UserBadgeEntry) => (
                <div
                  key={ub.id}
                  className="bg-sunglow-100 border-2 border-sunglow-300 rounded-lg p-5 flex flex-col items-center text-center hover:border-sunglow-500 transition-colors"
                >
                  <img
                    src={ub.image_url}
                    alt={ub.title}
                    className="h-20 w-20 object-contain mb-4"
                  />
                  <p className="font-bold text-dark-neutrals-500">{ub.title}</p>
                  <p className="text-sm font-medium text-sunglow-600 mt-1">{'⭐'.repeat(ub.value)}</p>
                  {ub.description && (
                    <p className="text-xs text-dark-neutrals-300 mt-2">{ub.description}</p>
                  )}
                  {ub.comment && (
                    <p className="text-xs text-dark-neutrals-400 mt-2 italic bg-white rounded px-3 py-1.5">
                      "{ub.comment}"
                    </p>
                  )}
                  <p className="text-xs text-dark-neutrals-200 mt-3">
                    {formatLocalDateTime(ub.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}