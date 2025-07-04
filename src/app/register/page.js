'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 6) {
      setError('⚠️ Password minimal 6 karakter.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(`❌ ${error.message}`)
    } else {
      setMessage('✅ Registrasi berhasil! Mengarahkan ke login...')
      setTimeout(() => router.push('/login'), 2000)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-4xl font-bold mb-6">Connect With Us</h2>

        {error && (
          <div className="bg-red-100 text-red-700 font-semibold py-3 px-4 rounded mb-4 text-lg">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-700 font-semibold py-3 px-4 rounded mb-4 text-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border px-4 py-3 rounded w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border px-4 py-3 rounded w-full"
          />
          <button
            type="submit"
            className="bg-black text-white py-3 px-4 rounded w-full font-semibold hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
