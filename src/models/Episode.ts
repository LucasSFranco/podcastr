import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import formatDuration from '../utils/formatDuration'

export interface EpisodeData {
  id: string
  title: string
  members: string
  published_at: string
  thumbnail: string
  description: string
  file: {
    url: string
    type: string
    duration: number
  }
}

class Episode {

  id: string
  title: string
  members: string
  thumbnail: string
  description: string
  url: string
  duration: number
  formattedDuration: string
  publishedAt: string

  constructor(episodeData: EpisodeData) {
    this.id = episodeData.id
    this.title = episodeData.title
    this.members = episodeData.members
    this.thumbnail = episodeData.thumbnail
    this.description = episodeData.description
    this.url = episodeData.file.url
    this.duration = episodeData.file.duration
    this.formattedDuration = formatDuration(episodeData.file.duration)
    this.publishedAt = format(
      parseISO(episodeData.published_at),
      'd MMM yy',
      { locale: ptBR }
    )
  }

  data(): Episode {
    return {
      ...this
    }
  }
}

export default Episode
