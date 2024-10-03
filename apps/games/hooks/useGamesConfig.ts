import { useMemo } from 'react'
import { GAMES_LIST, GameType } from '@kazama-defi/games'

export const useGamesConfig = (): GameType[] => useMemo(() => GAMES_LIST, [])
