"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import UserCard from "@/components/ui/user-card"
import { IconPlus } from "@tabler/icons-react"

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase.from("berita").select("*")
      if (error) {
        setError(error)
      } else {
        setNews(data)
      }
      setLoading(false)
    }

    fetchNews()
  }, [])

  const filteredNews = news.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.body?.toLowerCase().includes(search.toLowerCase()) ||
    item.userId?.toString().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <p>Gagal memuat data: {error.message}</p>
      </div>
    )
  }

  return (
    <section id="content">
      <input
        type="text"
        placeholder="Cari Berita"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border px-4 py-2 rounded mb-6 placeholder-gray-600 text-black"
      />
      <div id="list-news" className="flex flex-col gap-4">
        {filteredNews.map((item, index) => (
          <UserCard
            key={index}
            fullname={item.title}
            email={item.body}
            role={item.userId}
            status={item.id}
          />
        ))}
      </div>
      <button
        className="fixed bottom-6 right-6 bg-gray-200 p-3 rounded shadow text-black cursor-default"
        title="Hanya ikon"
        disabled
      >
        <IconPlus size={20} />
      </button>
    </section>
  )
}
