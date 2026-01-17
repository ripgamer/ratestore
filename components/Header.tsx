"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Store, LogOut, LayoutDashboard, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  // Don't show header on auth pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/signup")) {
    return null;
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Store className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-lg hidden sm:inline">RateStore</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user?.role === "NORMAL_USER" && (
            <Link
              href="/user/stores"
              className={`flex items-center gap-2 text-sm ${
                pathname === "/user/stores"
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Stores
            </Link>
          )}

          {user?.role === "SYSTEM_ADMIN" && (
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-2 text-sm ${
                pathname === "/admin/dashboard"
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}

          {user?.role === "STORE_OWNER" && (
            <Link
              href="/store/dashboard"
              className={`flex items-center gap-2 text-sm ${
                pathname === "/store/dashboard"
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Store Dashboard
            </Link>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role.replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/change-password">Change Password</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
