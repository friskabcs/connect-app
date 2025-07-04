"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"

export default function Dashboard() {
  const [userCount, setUserCount] = useState(null)
  const [newsCount, setNewsCount] = useState(null)
  const [eventCount, setEventCount] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [userGrowthData, setUserGrowthData] = useState([])
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    const fetchCounts = async () => {
      const { count: users } = await supabase.from("users").select("*", { count: "exact", head: true })
      const { count: news } = await supabase.from("berita").select("*", { count: "exact", head: true })
      const { count: events } = await supabase.from("events").select("*", { count: "exact", head: true })

      setUserCount(users || 0)
      setNewsCount(news || 0)
      setEventCount(events || 0)
    }

    const fetchUserGrowth = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("created_at")
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Fetch error:", error)
        return
      }

      const grouped = data.reduce((acc, curr) => {
        const month = new Date(curr.created_at).toLocaleString("default", { month: "short", year: "numeric" })
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {})

      const chartData = Object.entries(grouped).map(([month, count]) => ({
        month,
        count
      }))

      setUserGrowthData(chartData)
    }

    fetchCounts()
    fetchUserGrowth()
  }, [])

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"} w-full p-6 min-h-screen`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userCount}</p>
          <Link href="/admin/users" className="text-sm text-blue-500 hover:underline mt-2 inline-block">Lihat semua</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Total News</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{newsCount}</p>
          <Link href="/admin/berita" className="text-sm text-blue-500 hover:underline mt-2 inline-block">Lihat semua</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Total Events</h2>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{eventCount}</p>
          <Link href="/admin/events" className="text-sm text-blue-500 hover:underline mt-2 inline-block">Lihat semua</Link>
        </div>
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">User Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
