import { IconKey, IconLogout, IconUser } from "@tabler/icons-react";
export default function Users_Page() {
    return (
        <div id="container" className="flex h-[100vh]">
            <section id="navigation" className="bg-gray-400 p-4 w-[200px]">
                <h1 className="text-3xl font-bold text-center">Connect</h1>
                <div className="flex flex-col gap-2 mt-4">
                    <button className="flex gap-2"> 
                        <IconUser /> Users
                        </button>
                    <button className="flex gap-2">
                    <IconKey /> Hak Akses
                    </button>
                    <button className="flex gap-2"> 
                    <IconLogout />Logout
                    </button>
                </div>
            </section>
            <section id="content">
                <input type="text" placeholder="Cari Users" />
                <div id="list-users"></div>
            </section>
        </div>
    );
}