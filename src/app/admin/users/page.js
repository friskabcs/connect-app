import UserCard from "@/components/ui/user-card";
import { dataUser } from "@/mock/data-user";
import { IconKey, IconLogout, IconUser, IconPlus } from "@tabler/icons-react";

export default function Users_Page() {
  const data = dataUser;

  return (
    <section id="content">
      <input
        type="text"
        placeholder="Cari Users"
        className="w-full border px-4 py-2 rounded mb-6 placeholder-gray-600 text-black"
      />
      <div id="list-users" className="flex flex-col gap-4">
        {data.map((employee, index) => (
          <UserCard
            key={index}
            fullname={employee.fullname}
            email={employee.email}
            role={employee.role}
            status={employee.status}
          />
        ))}
      </div>
      <button className="absolute bottom-6 right-6 bg-gray-200 hover:bg-gray-300 p-3 rounded shadow text-black">
        <IconPlus size={20} />
      </button>
    </section>
  );
}
