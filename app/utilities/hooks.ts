import { useMatches } from '@remix-run/react'
import { useMemo } from 'react'
import type { UserType } from '~/types/types'

export function useMatchesData(
    id: string
  ): Record<string, unknown> | undefined {
    const matchingRoutes = useMatches()
    const route = useMemo(
      () => matchingRoutes.find((route) => route.id === id),
      [matchingRoutes, id]
    )
    return route?.data
  }


function isUser(user: any): user is UserType {
    return user && typeof user === 'object' && typeof user.email === 'string'
  }

  export function useOptionalUser(): UserType | undefined {
    const data = useMatchesData('root')
    if (!data || !isUser(data.user)) {
      return undefined
    }
    return data.user
  }

  export function useUser(): UserType {
    const maybeUser = useOptionalUser()
    if (!maybeUser) {
      throw new Error(
        'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.'
      )
    }
    return maybeUser
  }
