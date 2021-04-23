import { GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'

import PlayerContext from '../../contexts/PlayerContext'
import Episode from '../../models/Episode'
import { api } from '../../services/api'

import episodePage from '../../styles/episodePage.module.sass'

interface EpisodePageProps {
  episode: Episode
}

export default function EpisodePage({ episode }: EpisodePageProps) {
  const {
    play
  } = useContext(PlayerContext)

  return (
    <div className={episodePage.container}>
      <main>
        <div className={episodePage.banner}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            width={750}
            height={421.875}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="cover"
          />
          <button
            type="button"
            onClick={() => play(episode)}
          >
            <img src="/play.svg" alt="Voltar" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.formattedDuration}</span>
        </header>

        <div
          className={episodePage.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </main>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episodeData => ({
    params: {
      slug: episodeData.id
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const { data: episodeData } = await api.get(`/episodes/${slug}`)

  const episode = new Episode(episodeData).data()

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
