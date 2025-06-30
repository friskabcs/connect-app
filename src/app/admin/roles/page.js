"use client";

import { useEffect, useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { supabase } from "@/lib/supabase"; 

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from("roles") 
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data:", error.message);
    } else {
      setData(data);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus data ini?");
    if (confirmDelete) {
      const { error } = await supabase.from("roles").delete().eq("id", id);
      if (error) {
        alert("Gagal menghapus data");
      } else {
        fetchRoles();
      }
    }
  };

  // Sementara hanya alert
  const handleEdit = (id) => {
    alert(`Edit data dengan ID ${id}`);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredData = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
     <section id="content">
      <input
        type="text"
        placeholder="Cari Hak Akses"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
         className="w-full border px-4 py-2 rounded mb-6 placeholder-gray-600 text-black"
      />

      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-center align-middle p-2 w-1/12">No</th>
            <th className="text-center align-middle p-2 w-7/12">Hak Akses</th>
            <th className="text-center align-middle p-2 w-4/12">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="text-center align-middle p-2">{index + 1}</td>
                <td className="text-center align-middle p-2">{item.nama}</td>
                <td className="text-center align-middle p-2">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => handleEdit(item.id)}
                      title="Edit"
                      className="text-black"
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Hapus"
                      className="text-black"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-gray-500 p-4">
                Tidak ada data ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
