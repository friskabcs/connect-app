"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconKey, IconLogout, IconUser, IconNews } from "@tabler/icons-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="flex w-screen h-screen">
      <aside className="w-[220px] bg-white border-r border-gray-300 p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Connect</h1>

        <Link
          href="/admin/users"
          className={`flex items-center gap-2 px-3 py-2 rounded  ${
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
          className={`flex items-center gap-2 px-3 py-2 rounded  ${
            isActive("/admin/berita") ? "bg-black text-white font-bold" : ""
          }`}
        >
          <IconNews size={20} /> Berita
        </Link>

        <button
          onClick={() => alert("Logout")}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black-100"
        >
          <IconLogout size={20} /> Logout
        </button>
      </aside>

      <section id="content" className="bg-white w-[100%] p-5">
        {children}
      </section>
    </div>
  );
}
