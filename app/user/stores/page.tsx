"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Mail, Star } from "lucide-react";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: string;
  _count?: {
    ratings: number;
  };
  averageRating?: number;
}

export default function UserStoresPage() {
  const { user, loading: authLoading } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/stores");
        if (!response.ok) throw new Error("Failed to fetch stores");
        const data = await response.json();
        setStores(data.stores || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stores");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStores();
    }
  }, [authLoading]);

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
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Discover Stores</h1>
          <p className="mt-2 text-lg text-indigo-100">
            Browse and rate local stores in your area
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <Card className="mb-6 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {stores.length === 0 ? (
          <Card className="text-center py-12 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No stores found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Check back later for new stores!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Card key={store.id} className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 dark:text-white">{store.name}</CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        {store.email}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-0">
                      <Star className="h-3 w-3 mr-1 fill-indigo-700 dark:fill-indigo-300" />
                      {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{store._count?.ratings || 0} ratings</span>
                    <span>Added {new Date(store.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                    <Link href={`/user/stores/${store.id}`}>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white">View & Rate</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
