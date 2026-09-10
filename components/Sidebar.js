"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Download,
  LogOut,
  BarChart3,
  ChevronDown,
  ChevronRight,
  User,
  Stethoscope,
  ClipboardList,
  Megaphone,
  FileText,
  Pill,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    if (
      pathname === "/admin/patients" ||
      pathname === "/admin/doctors" ||
      pathname === "/admin/secretaries"
    ) {
      setIsUserMenuOpen(true);
    }
  }, [pathname]);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/adminlogin" });
  };

  const item =
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200";
  const activeItem = "bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 text-white";
  const idleItem = "text-slate-400 hover:bg-white/5 hover:text-white";

  const iconBox = "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition";
  const activeIcon = "bg-indigo-500/30 text-indigo-200";
  const idleIcon = "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white";

  const accent = (isActive) =>
    `absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-400 transition-all duration-200 ${
      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
    }`;

  return (
    <aside className="flex min-h-screen w-64 flex-col justify-between border-r border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 shadow-2xl">
      {/* TOP */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-900/40">
            <img src="/centraLogo.jpg" alt="Centra Clinic" className="h-7 w-7 object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-tight text-white">Centra Clinic</h1>
            <p className="text-[11px] font-medium text-indigo-400">Admin Panel</p>
          </div>
        </div>

        <div className="p-3">
          <nav className="space-y-1 text-sm">
            {/* Dashboard */}
            <Link
              href="/admin/dashboard"
              className={`${item} ${pathname === "/admin/dashboard" ? activeItem : idleItem}`}
            >
              <span className={accent(pathname === "/admin/dashboard")} />
              <span className={`${iconBox} ${pathname === "/admin/dashboard" ? activeIcon : idleIcon}`}>
                <LayoutDashboard size={17} />
              </span>
              <span>Dashboard</span>
            </Link>

            {/* User Management */}
            <div>
              <button
                onClick={toggleUserMenu}
                className={`${item} w-full justify-between ${isUserMenuOpen ? activeItem : idleItem}`}
              >
                <span className={accent(isUserMenuOpen)} />
                <span className="flex items-center gap-3">
                  <span className={`${iconBox} ${isUserMenuOpen ? activeIcon : idleIcon}`}>
                    <Users size={17} />
                  </span>
                  <span>User Management</span>
                </span>
                <span className="text-slate-500 transition group-hover:text-slate-300">
                  {isUserMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="relative ml-6 mt-1 space-y-1 border-l border-slate-800 pl-3">
                  <Link
                    href="/admin/patients"
                    className={`${item} py-2 ${pathname === "/admin/patients" ? activeItem : idleItem}`}
                  >
                    <span className={accent(pathname === "/admin/patients")} />
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${pathname === "/admin/patients" ? activeIcon : idleIcon}`}>
                      <User size={15} />
                    </span>
                    <span>Patient</span>
                  </Link>

                  <Link
                    href="/admin/doctors"
                    className={`${item} py-2 ${pathname === "/admin/doctors" ? activeItem : idleItem}`}
                  >
                    <span className={accent(pathname === "/admin/doctors")} />
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${pathname === "/admin/doctors" ? activeIcon : idleIcon}`}>
                      <Stethoscope size={15} />
                    </span>
                    <span>Doctors</span>
                  </Link>

                  <Link
                    href="/admin/secretaries"
                    className={`${item} py-2 ${pathname === "/admin/secretaries" ? activeItem : idleItem}`}
                  >
                    <span className={accent(pathname === "/admin/secretaries")} />
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${pathname === "/admin/secretaries" ? activeIcon : idleIcon}`}>
                      <ClipboardList size={15} />
                    </span>
                    <span>Secretary</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Appointment */}
            <Link
              href="/admin/appointments"
              className={`${item} ${pathname === "/admin/appointments" ? activeItem : idleItem}`}
            >
              <span className={accent(pathname === "/admin/appointments")} />
              <span className={`${iconBox} ${pathname === "/admin/appointments" ? activeIcon : idleIcon}`}>
                <Calendar size={17} />
              </span>
              <span>Appointment</span>
            </Link>

            {/* Content Management */}
            <Link
              href="/admin/content"
              className={`${item} ${
                pathname === "/admin/content" || pathname.startsWith("/admin/content")
                  ? activeItem
                  : idleItem
              }`}
            >
              <span
                className={accent(
                  pathname === "/admin/content" || pathname.startsWith("/admin/content")
                )}
              />
              <span
                className={`${iconBox} ${
                  pathname === "/admin/content" || pathname.startsWith("/admin/content")
                    ? activeIcon
                    : idleIcon
                }`}
              >
                <FileText size={17} />
              </span>
              <span>Content Management</span>
            </Link>

            {/* Report */}
            <Link
              href="/admin/report"
              className={`${item} ${pathname === "/admin/report" ? activeItem : idleItem}`}
            >
              <span className={accent(pathname === "/admin/report")} />
              <span className={`${iconBox} ${pathname === "/admin/report" ? activeIcon : idleIcon}`}>
                <Download size={17} />
              </span>
              <span>Report</span>
            </Link>

            {/* Analytics */}
            <Link
              href="/admin/analytics"
              className={`${item} ${pathname === "/admin/analytics" ? activeItem : idleItem}`}
            >
              <span className={accent(pathname === "/admin/analytics")} />
              <span className={`${iconBox} ${pathname === "/admin/analytics" ? activeIcon : idleIcon}`}>
                <BarChart3 size={17} />
              </span>
              <span>Analytics</span>
            </Link>

            {/* Medicine Management */}
            <Link
              href="/admin/medicines"
              className={`${item} ${pathname === "/admin/medicines" ? activeItem : idleItem}`}
            >
              <span className={accent(pathname === "/admin/medicines")} />
              <span className={`${iconBox} ${pathname === "/admin/medicines" ? activeIcon : idleIcon}`}>
                <Pill size={17} />
              </span>
              <span>Medicine Management</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-slate-800/80 bg-slate-950/50 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-bold text-white shadow-md shadow-indigo-900/40">
            A
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Admin</p>
            <p className="text-[11px] font-medium text-indigo-400">Administrator</p>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 font-medium text-red-400/90 transition hover:bg-red-500/10 hover:text-red-300"
            suppressHydrationWarning
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition group-hover:bg-red-500/20 group-hover:text-red-300">
              <LogOut size={15} />
            </span>
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}