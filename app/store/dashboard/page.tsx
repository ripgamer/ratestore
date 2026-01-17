"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Store, Star, Users, TrendingUp } from "lucide-react";

interface StoreData {
  id: string;
  name: string;
  email: string;
  address: string;
  _count?: {
    ratings: number;
  };
  averageRating?: number;
  recentRatings?: Array<{
    id: string;
    value: number;
    user: {
      name: string;
    };
    createdAt: string;
  }>;
}

export default function StoreOwnerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch("/api/store/info");
        if (response.ok) {
          const data = await response.json();
          setStore(data.store);
        } else {
          setError("Failed to load store information");
        }
      } catch (err) {
        setError("Error loading store data");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStore();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Store Dashboard</h1>
          <p className="mt-2 text-indigo-100">Welcome, {user?.name}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {store && (
          <>
            {/* Store Info Card */}
            <Card className="mb-8 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">{store.name}</CardTitle>
                    <CardDescription className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <p>Email: {store.email}</p>
                      <p>Address: {store.address}</p>
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="text-base">
                    <Star className="h-4 w-4 mr-1" />
                    {store.averageRating ? store.averageRating.toFixed(2) : "N/A"}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Ratings */}
              <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    Total Ratings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{store._count?.ratings || 0}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Community ratings</p>
                </CardContent>
              </Card>

              {/* Average Rating */}
              <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {store.averageRating ? store.averageRating.toFixed(2) : "N/A"}/5
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Out of 5 stars</p>
                </CardContent>
              </Card>

              {/* Rating Distribution */}
              <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    Your Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {store.averageRating && store.averageRating >= 4 ? "Excellent" : store.averageRating && store.averageRating >= 3 ? "Good" : "Fair"}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on community feedback</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Ratings */}
            {store.recentRatings && store.recentRatings.length > 0 && (
              <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Recent Ratings</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Latest feedback from customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {store.recentRatings.map((rating) => (
                      <div
                        key={rating.id}
                        className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-800 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{rating.user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {rating.value}/5
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="mt-8 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  Edit Store Information
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  View All Ratings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Store Settings
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
