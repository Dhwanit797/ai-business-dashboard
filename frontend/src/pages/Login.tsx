import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAuth } from '../context/AuthContext'
import { login as apiLogin } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('demo@business.ai')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiLogin(email, password)
      login(res.access_token, res.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-ds-bg-base">
      {/* Left 60%: Animated gradient background + product statement (always visible, never black) */}
      <div
        className="relative flex w-full flex-col justify-center px-10 py-16 md:w-[60%] md:px-16"
        style={{
          background: 'var(--ds-gradient-hero-left)',
          backgroundSize: '200% 200%',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(56,189,248,0.12)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(45,212,191,0.08)_0%,transparent_50%)]" />
        <motion.div
          className="relative z-10 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold leading-tight text-ds-text-primary md:text-4xl">
            Turn Business Data Into Intelligent Decisions.
          </h1>
          <p className="mt-4 text-lg text-ds-text-secondary">
            AI-powered platform for expenses, fraud detection, inventory, sustainability, and analytics — in one place.
          </p>
        </motion.div>
        {/* Subtle particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-ds-accent opacity-40"
              style={{
                left: `${15 + (i * 7) % 70}%`,
                top: `${20 + (i * 11) % 60}%`,
                animation: `float 4s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Right 40%: Elevated login panel */}
      <div className="flex w-full items-center justify-center bg-ds-bg-elevated px-6 py-12 md:w-[40%]">
        <motion.div
          className="w-full max-w-[380px] rounded-2xl bg-ds-bg-surface p-8"
          style={{ boxShadow: 'var(--ds-surface-shadow-lg)' }}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h2 className="text-xl font-semibold text-ds-text-primary">Sign in</h2>
          <p className="mt-1 text-sm text-ds-text-secondary">Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-ds-text-primary">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-ds-bg-elevated px-4 py-3 text-ds-text-primary placeholder:text-ds-text-muted outline-none ring-2 ring-transparent focus:ring-2 focus:ring-ds-accent"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-ds-text-primary">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-ds-bg-elevated px-4 py-3 text-ds-text-primary placeholder:text-ds-text-muted outline-none ring-2 ring-transparent focus:ring-2 focus:ring-ds-accent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg bg-ds-accent-danger/20 px-3 py-2 text-sm text-red-200">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-ds-accent py-3.5 font-semibold text-ds-text-inverse transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-ds-text-inverse/30 border-t-ds-text-inverse" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ds-text-muted">
            Demo: demo@business.ai / demo123
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(8px, -8px); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
