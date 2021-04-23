import { PlayerContextProvider } from '../contexts/PlayerContext'

import Header from '../components/Header'
import Player from '../components/Player'

import '../styles/_global.sass'
import app from '../styles/app.module.sass'

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={app.container}>
        <main>
          <Header />

          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
