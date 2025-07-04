'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-4xl font-bold mb-6">Connect With Us</h2>
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border px-4 py-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded w-full"
          >
            Sign In
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Don't Have an Account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign Up 
          </Link>
        </p>
      </div>
    </div>
  )
}
