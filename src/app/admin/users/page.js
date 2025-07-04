"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import UserCard from "@/components/ui/user-card"
import { IconPlus } from "@tabler/icons-react"

export default function Users_Page() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const router = useRouter() 

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*")
      if (error) {
        setError(error)
      } else {
        setUsers(data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase().includes(search.toLowerCase()) ||
     user.email?.toLowerCase().includes(search.toLowerCase()) ||
     user.role?.toLowerCase().includes(search.toLowerCase()) ||
     user.status?.toLowerCase().includes(search.toLowerCase()))
  )

  const handleAddUser = () => {
   router.push("/admin/users/create")

  }

  if (loading) {
    return (
      <div>
        <p> Loading... </p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <p> Gagal memuat data: {error.message} </p>
      </div>
    )
  }

  return (
    <section id="content">
      <input
        type="text"
        placeholder="Cari User"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border px-4 py-2 rounded mb-6 placeholder-gray-600 text-black"
      />
      <div id="list-users" className="flex flex-col gap-4">
        {filteredUsers.map((employee, index) => (
          <UserCard
            key={index}
            fullname={employee.name}
            email={employee.email}
            role={employee.role}
            status={employee.status}
          />
        ))}
      </div>
      <button
        onClick={handleAddUser}
        className="fixed bottom-6 right-6 bg-gray-200 hover:bg-gray-300 p-3 rounded shadow text-black"
      >
        <IconPlus size={20} />
      </button>
    </section>
  )
}