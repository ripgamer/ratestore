"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Store, Star, TrendingUp, BarChart3, PieChart, ArrowUpRight, Settings, Shield, Activity } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  averageRating: number;
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStats();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b border-gray-300/50 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 dark:from-indigo-600/20 dark:to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-4xl">📊</span> Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Welcome, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.name}</span>
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 px-3 py-1">System Admin</Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bento Grid - Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Users - Large Card */}
          <div className="lg:col-span-1 h-full">
            <div className="h-full p-6 rounded-2xl glassmorphism hover:shadow-lg transition-all duration-300 border border-white/30 dark:border-white/10 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">👥</div>
                <ArrowUpRight className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats?.totalUsers || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Active users in system</p>
            </div>
          </div>

          {/* Total Stores - Large Card */}
          <div className="lg:col-span-1 h-full">
            <div className="h-full p-6 rounded-2xl glassmorphism hover:shadow-lg transition-all duration-300 border border-white/30 dark:border-white/10 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">🏪</div>
                <ArrowUpRight className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Total Stores</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats?.totalStores || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Registered stores</p>
            </div>
          </div>

          {/* Total Ratings - Large Card */}
          <div className="lg:col-span-1 h-full">
            <div className="h-full p-6 rounded-2xl glassmorphism hover:shadow-lg transition-all duration-300 border border-white/30 dark:border-white/10 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">⭐</div>
                <ArrowUpRight className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Total Ratings</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats?.totalRatings || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Community ratings</p>
            </div>
          </div>

          {/* Average Rating - Large Card */}
          <div className="lg:col-span-1 h-full">
            <div className="h-full p-6 rounded-2xl glassmorphism hover:shadow-lg transition-all duration-300 border border-white/30 dark:border-white/10 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">📈</div>
                <ArrowUpRight className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Avg Rating</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats?.averageRating ? stats.averageRating.toFixed(2) : "N/A"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Out of 5 stars</p>
            </div>
          </div>
        </div>

        {/* Secondary Bento Grid - Actions & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Management */}
          <Link href="/admin/users" className="group">
            <div className="h-full p-8 rounded-2xl glassmorphism hover:shadow-xl transition-all duration-300 border border-white/30 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 to-indigo-600/0 group-hover:from-indigo-600/5 group-hover:to-indigo-600/10 transition-all duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4">👨‍💼</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Manage Users</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">View, edit, and manage all user accounts in the system</p>
                <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>View All</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Stores Management */}
          <Link href="/admin/stores" className="group">
            <div className="h-full p-8 rounded-2xl glassmorphism hover:shadow-xl transition-all duration-300 border border-white/30 dark:border-white/10 hover:border-green-500/50 dark:hover:border-green-500/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/0 group-hover:from-green-600/5 group-hover:to-green-600/10 transition-all duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4">🏬</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Manage Stores</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Monitor and manage all registered stores and their details</p>
                <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>View All</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/admin/analytics" className="group">
            <div className="h-full p-8 rounded-2xl glassmorphism hover:shadow-xl transition-all duration-300 border border-white/30 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-purple-500/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">View detailed analytics and system insights at a glance</p>
                <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Reports */}
          <div className="group">
            <div className="h-full p-8 rounded-2xl glassmorphism hover:shadow-xl transition-all duration-300 border border-white/30 dark:border-white/10 cursor-not-allowed opacity-70">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Generate and download system reports</p>
              <Badge className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">Coming Soon</Badge>
            </div>
          </div>

          {/* System Health */}
          <div className="group">
            <div className="h-full p-8 rounded-2xl glassmorphism hover:shadow-xl transition-all duration-300 border border-white/30 dark:border-white/10 cursor-not-allowed opacity-70">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">System Health</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Monitor system performance and status</p>
              <Badge className="bg-green-300 dark:bg-green-700 text-green-700 dark:text-green-300 border-0">Operational</Badge>
            </div>
          </div>

          {/* Settings */}
          <div className="group">
            <div className="h-full p-8 rounded-2xl glassmorphism hover:shadow-xl transition-all duration-300 border border-white/30 dark:border-white/10 cursor-not-allowed opacity-70">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Configure system settings and preferences</p>
              <Badge className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">Coming Soon</Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-12 p-8 rounded-2xl glassmorphism border border-white/30 dark:border-white/10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Quick Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Platform Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Store className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Stores</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalStores || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Ratings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalRatings || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
