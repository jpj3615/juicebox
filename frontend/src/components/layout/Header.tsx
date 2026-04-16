import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/compare', label: 'Compare' },
  { to: '/teams', label: 'Teams' },
  { to: '/matchup', label: 'Matchup' },
]

export default function Header() {
  return (
    <header className="border-b border-border px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-lime">
          JUICEBOX
        </Link>
        <nav className="flex gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-lime' : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
