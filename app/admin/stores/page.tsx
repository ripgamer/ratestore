"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, MapPin, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating?: number;
  _count?: {
    ratings: number;
  };
}

export default function AdminStoresPage() {
  const { user, loading: authLoading } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Placeholder - implement actual API call
        setStores([]);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStores();
    }
  }, [authLoading]);

  useEffect(() => {
    const filtered = stores.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchTerm, stores]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gray-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 dark:from-green-600/20 dark:to-emerald-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-4xl">🏬</span> Manage Stores
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage all stores in the system</p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <Card className="mb-8 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Search Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Search className="h-5 w-5 text-gray-400 absolute mt-3 ml-3" />
              <Input
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No stores found</p>
            </div>
          ) : (
            filteredStores.map((store) => (
              <Card key={store.id} className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">{store.name}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{store.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{store.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-800">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Rating</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {store.averageRating ? store.averageRating.toFixed(2) : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Ratings</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        {store._count?.ratings || 0}
                      </p>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
