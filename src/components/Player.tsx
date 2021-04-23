import classes from 'classnames'
import Image from 'next/image'
import Slider from 'rc-slider'
import { useContext, useEffect, useRef, useState } from 'react'

import player from './styles/player.module.sass'
import 'rc-slider/assets/index.css'

import PlayerContext from '../contexts/PlayerContext'
import formatDuration from '../utils/formatDuration'

function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const {
    episodeList,
    currentEpisodeId,
    isPlaying,
    isLooping,
    togglePlay,
    toggleLoop,
    playNext,
    playPrev,
    shuffle,
    setPlayingState
  } = useContext(PlayerContext)

  const episode = episodeList[currentEpisodeId]

  function setupProgressListener(): void {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number): void {
    audioRef.current.currentTime = amount

    setProgress(amount)
  }

  useEffect(() => {
    if(!audioRef.current)
      return

    if(isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  return (
    <div className={classes(player.container, { [player.empty]: !episode })}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      <div className={player.body}>
        {
          episode ? (
            <>
              <div>
                <Image
                  width={592}
                  height={333}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />
              </div>
              <strong>{episode.title}</strong>
              <span>{episode.members}</span>
            </>
          ) : (
            <strong>Selecione um podcast para ouvir</strong>
          )
        }
      </div>

      <footer>
        <div className={player.progress}>
          <span>{formatDuration(progress || 0)}</span>
          <div className={player.slider}>
            {
              episode ? (
                <Slider
                  max={episode.duration}
                  value={progress}
                  trackStyle={{ backgroundColor: '#04d361' }}
                  railStyle={{ backgroundColor: '#9f5ff' }}
                  handleStyle={{ border: '4px solid#04d361', cursor: 'pointer' }}
                  onChange={handleSeek}
                />
              ) : (
                <div />
              )
            }
          </div>
          <span>{formatDuration(episode?.duration || 0)}</span>
        </div>

        <div className={player.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length <= 1}
            onClick={shuffle}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || currentEpisodeId === 0}
            onClick={playPrev}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            className={player.play}
            type="button"
            disabled={!episode}
            onClick={togglePlay}
          >
            {
              isPlaying ? (
                <img src="/pause.svg" alt="Pausar" />
                ) : (
                <img src="/play.svg" alt="Tocar" />
              )
            }
          </button>
          <button
            type="button"
            disabled={!episode || currentEpisodeId === episodeList.length - 1}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={classes({ [player.toggled]: isLooping })}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>

      {
        episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )
      }
    </div>
  )
}

export default Player
