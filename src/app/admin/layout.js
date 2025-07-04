"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconKey,
  IconLogout,
  IconUser,
  IconNews,
  IconSettings,
  IconDashboard,
  IconChecklist,
} from "@tabler/icons-react"

import HeaderBar from "@/components/dashboard/HeaderBar"
import "@/app/globals.css"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const isActive = (path) => pathname === path

  return (
    <div className="flex w-screen h-screen">
      {/* Sidebar */}
      <aside className="w-[220px] bg-white border-r border-gray-300 p-6 flex flex-col gap-4">
        <Link
          href="/admin/dashboard"
        >
          <h1 className="text-2xl font-bold text-center">Connect</h1>
        </Link>

        <Link
          href="/admin/dashboard"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/dashboard") ? "bg-black text-white font-bold" : ""
          }`}
        >
          <IconDashboard size={20} /> Dashboard
        </Link>

        <Link
          href="/admin/users"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/users") ? "bg-black text-white font-bold" : ""
          }`}
        >
          <IconUser size={20} /> Users
        </Link>

        <Link
          href="/admin/roles"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/roles") ? "bg-black text-white font-bold" : ""
          }`}
        >
          <IconKey size={20} /> Hak Akses
        </Link>

        <Link
          href="/admin/berita"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/berita") ? "bg-black text-white font-bold" : ""
          }`}
        >
          <IconNews size={20} /> Berita
        </Link>

        <Link
          href="/admin/tasks"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/tasks") ? "bg-black text-white font-bold" : ""
          }`}
        >
          <IconChecklist size={20} /> Tasks
        </Link>

        <Link
          href="/admin/account"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/account") ? "bg-black text-white font-bold" : ""
          }`}
        >
          <IconSettings size={20} /> Settings
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-2 rounded"
        >
          <IconLogout size={20} /> Logout
        </Link>
      </aside>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBar />
        <main className="flex-1 overflow-y-auto bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
