import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  Home,
  LayoutDashboard,
  Receipt,
  Shield,
  Package,
  Leaf,
  ChevronLeft,

  Settings,
} from 'lucide-react'

const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/modules/expense', label: 'Expense Sense', icon: Receipt },
  { to: '/modules/fraud', label: 'Fraud Lens', icon: Shield },
  { to: '/modules/inventory', label: 'Smart Inventory', icon: Package },
  { to: '/modules/green-grid', label: 'Green Grid', icon: Leaf },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardSidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { user, logout: _logout } = useAuth()

  return (
    <motion.aside
      className="sticky top-0 flex h-screen flex-col border-r border-ds-text-muted/15 bg-ds-bg-elevated"
      initial={false}
      animate={{ width: open ? 248 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex h-14 items-center justify-between border-b border-ds-text-muted/15 px-3">
        {open && (
          <NavLink
            to="/"
            className="truncate text-lg font-semibold text-ds-text-primary transition-colors hover:text-ds-accent"
          >
            Business AI
          </NavLink>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="rounded-xl p-2 text-ds-text-secondary transition-colors hover:bg-ds-bg-surface hover:text-ds-text-primary"
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
            <ChevronLeft className="h-5 w-5" />
          </motion.div>
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/' || to === '/dashboard' || to === '/dashboard/settings'}>
            {({ isActive }) => (
              <motion.span
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-ds-accent/15 text-ds-accent'
                    : 'text-ds-text-secondary hover:bg-ds-bg-surface hover:text-ds-text-primary'
                  }`}
                whileHover={{ x: open ? 2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {open && <span>{label}</span>}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-ds-text-muted/15 p-2">
        {open && user && (
          <p className="truncate px-3 py-2 text-xs text-ds-text-muted">
            {user.full_name || user.email}
          </p>
        )}
      </div>
    </motion.aside>
  )
}
