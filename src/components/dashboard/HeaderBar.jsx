"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function HeaderBar() {
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email)
      }
    }

    fetchUser()
  }, [])

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-center items-center">
      {userEmail && (
        <Link href="/admin/account" className="text-lg text-black font-medium hover:underline">
          Welcome, {userEmail}
        </Link>
      )}
    </header>
  )
}
