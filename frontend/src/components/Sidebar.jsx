import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";

const Sidebar = () => {
  const { users, selectedUser, getUsers, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers, onlineUsers.length]);

  const safeUsers = Array.isArray(users) ? users : [];

  const filteredUsers = showOnlineUsers
    ? safeUsers.filter((user) => onlineUsers.includes(user._id))
    : safeUsers;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="border-base-300 flex h-full w-20 flex-col border-r transition-all duration-200 lg:w-72">
      <div className="border-base-300 w-full border-b p-5">
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <User className="size-6" />
          <span className="hidden font-medium lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showOnlineUsers}
              onChange={e => setShowOnlineUsers(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({Math.max((onlineUsers?.length ?? 0) - 1, 0)} online)</span>
        </div>
      </div>

      <div className="w-full overflow-y-auto py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`hover:bg-base-300 flex w-full cursor-pointer items-center gap-3 p-3 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-base-300 ring-1" : ""}`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute right-0 bottom-0 size-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden min-w-0 text-left lg:block">
              <div className="truncate font-medium">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
