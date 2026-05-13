import { User, Bell } from "lucide-react";

export function Navbar() {
  return (
    <div className="flex items-center p-4 border-b border-border bg-card glass">
      <div className="flex w-full justify-end">
        <div className="flex gap-x-4 items-center">
          <button className="p-2 rounded-full hover:bg-secondary text-zinc-400 hover:text-white transition">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-x-2 p-2 rounded-lg hover:bg-secondary cursor-pointer transition">
            <div className="bg-primary/20 p-1.5 rounded-full border border-primary/50">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
