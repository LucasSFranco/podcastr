import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useContext } from 'react'

import PlayerContext from '../contexts/PlayerContext'
import Episode from '../models/Episode'
import { api } from '../services/api'

import homePage from '../styles/homePage.module.sass'

interface HomePageProps {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function HomePage({ latestEpisodes, allEpisodes }: HomePageProps) {
  const { playList } = useContext(PlayerContext)

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={homePage.container}>
      <section className={homePage.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <main>
          {
            latestEpisodes.map((episode, index) => {
              return (
                <div className={homePage.card} key={episode.id}>
                  <div className={homePage.thumbnail}>
                    <Image
                      width={192}
                      height={108}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </div>

                  <div className={homePage.details}>
                    <Link href={`episodes/${episode.id}`}>
                      <a href="" title={episode.title}>{episode.title}</a>
                    </Link>
                    <p title={episode.members}>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.formattedDuration}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => playList(episodeList, index)}
                  >
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </div>
              )
            })
          }
        </main>
      </section>
      <section className={homePage.allEpisodes}>
        <h2>Todos os episódios</h2>

        <div className={homePage.table}>
          <span className={homePage.thead} />
          <span className={homePage.thead}>Podcast</span>
          <span className={homePage.thead}>Integrantes</span>
          <span className={homePage.thead}>Data</span>
          <span className={homePage.thead}>Duração</span>
          <span className={homePage.thead} />
          {
            allEpisodes.map((episode, index) => {
              return (
                <Fragment key={episode.id}>
                  <span>
                    <div className={homePage.tthumbnail}>
                      <Image
                        width={120}
                        height={67.5}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </div>
                  </span>
                  <span>
                    <p title={episode.title}>
                      <Link href={`episodes/${episode.id}`}>
                        <a href="">{episode.title}</a>
                      </Link>
                    </p>
                  </span>
                  <span>
                    <p title={episode.members}>{episode.members}</p>
                  </span>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.formattedDuration}</span>
                  <span>
                    <button
                      type="button"
                      onClick={() => playList(episodeList, index + latestEpisodes.length)}
                    >
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </span>
                </Fragment>
              )
            })
          }
        </div>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episodeData => new Episode(episodeData).data())

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8 // 8 hours
  }
}

