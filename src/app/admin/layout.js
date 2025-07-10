"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  IconKey,
  IconLogout,
  IconUser,
  IconNews,
  IconSettings,
  IconDashboard,
  IconChecklist,
} from "@tabler/icons-react"
import { supabase } from "@/lib/supabase"

import HeaderBar from "@/components/dashboard/HeaderBar"
import "@/app/globals.css"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path) => pathname === path

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <IconDashboard size={20} /> },
    { href: "/admin/users", label: "Users", icon: <IconUser size={20} /> },
    { href: "/admin/roles", label: "Hak Akses", icon: <IconKey size={20} /> },
    { href: "/admin/berita", label: "Berita", icon: <IconNews size={20} /> },
    { href: "/admin/tasks", label: "Tasks", icon: <IconChecklist size={20} /> },
    { href: "/admin/account", label: "Settings", icon: <IconSettings size={20} /> },
  ]

  return (
    <div className="flex w-screen h-screen">
      <aside className="w-[220px] bg-white border-r border-gray-300 p-6 flex flex-col gap-4">
        <Link href="/admin/dashboard">
          <h1 className="text-2xl font-bold text-center">Connect</h1>
        </Link>

        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition ${
              isActive(item.href) ? "bg-black text-white font-bold" : "text-gray-700"
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-red-100 hover:text-red-700 transition"
        >
          <IconLogout size={20} /> Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBar />
        <main className="flex-1 overflow-y-auto bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
