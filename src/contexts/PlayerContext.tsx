import { createContext, useState, ReactNode } from 'react'

import Episode from '../models/Episode'

interface PlayerContextData {
  episodeList: Episode[]
  currentEpisodeId: number
  isPlaying: boolean
  isLooping: boolean
  play: (episode: Episode) => void
  playNext: () => void
  playPrev: () => void
  shuffle: () => void
  playList: (list: Episode[], index: number) => void
  togglePlay: () => void
  toggleLoop: () => void
  setPlayingState: (state: boolean) => void
}

interface PlayerContextProviderProps {
  children: ReactNode
}

const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeId, setCurrentEpisodeId] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)

  function play(episode: Episode): void {
    setEpisodeList([episode])
    setCurrentEpisodeId(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number): void {
    setEpisodeList(list)
    setCurrentEpisodeId(index)
    setIsPlaying(true)
  }

  function playNext(): void {
    if(currentEpisodeId === episodeList.length - 1) return

    setCurrentEpisodeId(currentEpisodeId + 1)
  }

  function playPrev(): void {
    if(currentEpisodeId === 0) return

    setCurrentEpisodeId(currentEpisodeId - 1)
  }

  function shuffle(): void {
    const randomEpisodeId = Math.floor(
      Math.random() * (episodeList.length - 1)
    )

    if(randomEpisodeId === currentEpisodeId) return shuffle()

    setCurrentEpisodeId(randomEpisodeId)
  }

  function togglePlay(): void {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop(): void {
    setIsLooping(!isLooping)
  }

  function setPlayingState(state: boolean): void {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeId,
      isPlaying,
      isLooping,
      play,
      playNext,
      playPrev,
      shuffle,
      playList,
      togglePlay,
      toggleLoop,
      setPlayingState
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerContext
