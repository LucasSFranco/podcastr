import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

import header from './styles/header.module.sass'

function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  })

  return (
    <header className={header.container}>
      <img src="/logo.svg" alt="Podcastr" />

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}

export default Header
