'use client'

import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push('/admin/users')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-5xl font-bold mb-10">Connect With Us</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md px-4 py-3"
            disabled
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md px-4 py-3"
            disabled
          />
          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}