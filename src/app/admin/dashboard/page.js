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
  const [taskCount, setTaskCount] = useState(null)
  const [taskProgress, setTaskProgress] = useState(0)
  const [userGrowthData, setUserGrowthData] = useState([])

  useEffect(() => {
    const fetchCounts = async () => {
      const { count: users } = await supabase.from("users").select("*", { count: "exact", head: true })
      const { count: news } = await supabase.from("berita").select("*", { count: "exact", head: true })
      const { count: tasks } = await supabase.from("tasks").select("*", { count: "exact", head: true })

      setUserCount(users || 0)
      setNewsCount(news || 0)
      setTaskCount(tasks || 0)
    }

    const fetchTaskProgress = async () => {
      const { data, error } = await supabase.from("tasks").select("status")
      if (error) return console.error("Fetch error:", error)

      const total = data.length
      const doneCount = data.filter(t => t.status === "done").length
      const percent = total ? Math.round((doneCount / total) * 100) : 0
      setTaskProgress(percent)
    }

    const fetchUserGrowth = async () => {
      const { data, error } = await supabase.from("users").select("created_at").order("created_at", { ascending: true })
      if (error) return console.error("Fetch error:", error)

      const grouped = data.reduce((acc, curr) => {
        const month = new Date(curr.created_at).toLocaleString("default", { month: "short", year: "numeric" })
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {})

      const chartData = Object.entries(grouped).map(([month, count]) => ({ month, count }))
      setUserGrowthData(chartData)
    }

    fetchCounts()
    fetchTaskProgress()
    fetchUserGrowth()
  }, [])

  return (
    <div className="bg-white text-gray-800 w-full p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-pink-400">{userCount}</p>
          <Link href="/admin/users" className="text-sm text-blue-500 hover:underline mt-2 inline-block">Lihat semua</Link>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Total News</h2>
          <p className="text-3xl font-bold text-blue-400">{newsCount}</p>
          <Link href="/admin/berita" className="text-sm text-blue-500 hover:underline mt-2 inline-block">Lihat semua</Link>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold mb-2">Total Tasks</h2>
          <p className="text-3xl font-bold text-yellow-400">{taskCount}</p>
          <Link href="/admin/tasks" className="text-sm text-blue-500 hover:underline mt-2 inline-block">Lihat semua</Link>
        </div>
      </div>

      <div className="mt-10 bg-white border border-gray-200 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Task Completion Progress</h2>
        <div className="text-sm text-gray-500 mb-2">{taskProgress}% selesai</div>
        <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-5 bg-green-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${taskProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow border border-gray-200">
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
