import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function LandingNav() {
  const location = useLocation()
  const { token, isValid } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isLoggedIn = !!token && isValid

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-ds-bg-surface/50 bg-ds-bg-base/95 px-6 py-4 backdrop-blur-md transition-colors duration-300 dark:border-white/5">
      <Link
        to="/"
        className="text-xl font-semibold text-ds-text-primary transition-colors hover:text-ds-accent"
      >
        Business AI
      </Link>
      <nav className="flex items-center gap-3 sm:gap-6">
        <Link
          to="/"
          className={`text-sm font-medium transition-colors ${
            location.pathname === '/' ? 'text-ds-text-primary' : 'text-ds-text-secondary hover:text-ds-text-primary'
          }`}
        >
          Home
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ds-text-secondary transition-colors hover:bg-ds-bg-surface hover:text-ds-text-primary"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" aria-hidden />
          ) : (
            <Moon className="h-5 w-5" aria-hidden />
          )}
        </button>
        <Link
          to={isLoggedIn ? '/dashboard' : '/login'}
          className="rounded-lg bg-ds-bg-surface px-4 py-2 text-sm font-medium text-ds-text-primary shadow-ds-card transition-colors hover:bg-ds-bg-surface-hover"
        >
          {isLoggedIn ? 'Dashboard' : 'Sign in'}
        </Link>
      </nav>
    </header>
  )
}
