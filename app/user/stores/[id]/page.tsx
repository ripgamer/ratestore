"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Mail, Star, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

interface StoreDetail {
  id: string;
  name: string;
  email: string;
  address: string;
  owner: {
    name: string;
  };
  _count: {
    ratings: number;
  };
  averageRating: number;
  userRating?: number;
}

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const storeId = params.id as string;
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchStoreDetail = async () => {
      try {
        const response = await fetch(`/api/stores/${storeId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch store details");
        }
        const data = await response.json();
        setStore(data.store);
        if (data.store.userRating) {
          setSelectedRating(data.store.userRating);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load store");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && storeId) {
      fetchStoreDetail();
    }
  }, [authLoading, storeId]);

  const handleSubmitRating = async () => {
    if (!selectedRating || !user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          value: selectedRating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);

      // Refresh store data
      const updatedResponse = await fetch(`/api/stores/${storeId}`);
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setStore(data.store);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800 mb-4">{error}</p>
              <Link href="/user/stores">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Stores
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 mb-4">Store not found</p>
              <Link href="/user/stores">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Stores
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/user/stores" className="flex items-center gap-2 mb-4 w-fit hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            Back to Stores
          </Link>
          <h1 className="text-3xl font-bold">{store.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{store.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{store.address}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Store Owner</p>
                  <p className="font-medium">{store.owner.name}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rating Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Overall Rating</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-indigo-600">
                        {store.averageRating.toFixed(1)}
                      </span>
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Total Ratings</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {store._count.ratings}
                    </p>
                  </div>
                </div>

                {store.userRating && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Your current rating: <span className="font-bold">{store.userRating}/5</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Rating Submission */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>
                  {store.userRating ? "Update Your Rating" : "Submit a Rating"}
                </CardTitle>
                <CardDescription>
                  {store.userRating ? "Change your rating" : "What's your experience?"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {submitSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Rating submitted successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <p className="text-sm font-medium">Select your rating:</p>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className={`p-2 rounded-lg transition-all ${
                          selectedRating === rating
                            ? "bg-yellow-400 text-white scale-110"
                            : "bg-gray-100 text-gray-600 hover:bg-yellow-100"
                        }`}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            selectedRating === rating
                              ? "fill-white"
                              : "fill-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {selectedRating && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Your rating: <span className="font-bold">{selectedRating}/5</span>
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleSubmitRating}
                  disabled={!selectedRating || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Rating"
                  )}
                </Button>

                {!user && (
                  <p className="text-xs text-gray-500 text-center">
                    Please log in to submit a rating
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
