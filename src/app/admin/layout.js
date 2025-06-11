'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconKey, IconLogout, IconUser, IconNews } from '@tabler/icons-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="flex w-screen h-screen">

      <aside className="w-[220px] bg-white border-r border-gray-300 p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Connect</h1>

        <Link
          href="/admin/users"
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
            isActive('/admin/users') ? 'bg-gray-300 font-bold' : ''
          }`}
        >
          <IconUser size={20} /> Users
        </Link>

        <Link
          href="/admin/roles"
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
            isActive('/admin/roles') ? 'bg-gray-300 font-bold' : ''
          }`}
        >
          <IconKey size={20} /> Hak Akses
        </Link>

        <Link
          href="/admin/berita"
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
            isActive('/admin/berita') ? 'bg-gray-300 font-bold' : ''
          }`}
        >
          <IconNews size={20} /> Berita
        </Link>

        <button
          onClick={() => alert('Logout')}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
        >
          <IconLogout size={20} /> Logout
        </button>
      </aside>

      {/* Konten */}
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
