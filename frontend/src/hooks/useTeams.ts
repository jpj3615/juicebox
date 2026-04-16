import { useState, useEffect } from 'react'
import type { Team } from '../types'
import { getTeams } from '../lib/api'

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTeams()
      .then(setTeams)
      .catch(() => setTeams([]))
      .finally(() => setLoading(false))
  }, [])

  return { teams, loading }
}
