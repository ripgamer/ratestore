"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { requireAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, User, MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!formData.name || !formData.address) {
      setError("Name and address are required");
      setIsSaving(false);
      return;
    }

    if (formData.name.length < 2 || formData.name.length > 60) {
      setError("Name must be between 2 and 60 characters");
      setIsSaving(false);
      return;
    }

    if (formData.address.length > 400) {
      setError("Address must not exceed 400 characters");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      // Refresh user data from server
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account information and settings
          </p>
        </div>

        <Card className="p-8 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
              <AlertDescription className="text-red-800 dark:text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Profile Info Section */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="disabled:bg-gray-100 dark:disabled:bg-slate-800 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Email */}
            <div>
              <Label className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="disabled:bg-gray-100 dark:disabled:bg-slate-800 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Address */}
            <div>
              <Label className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="disabled:bg-gray-100 dark:disabled:bg-slate-800 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Role Display */}
            <div>
              <Label className="mb-2 block text-gray-900 dark:text-white">Account Type</Label>
              <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700">
                <span className="capitalize text-gray-700 dark:text-gray-300 font-medium">
                  {user.role.replace("_", " ").toLowerCase()}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <Label className="mb-2 block text-gray-900 dark:text-white">Account Information</Label>
              <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700">
                <span className="text-gray-700 dark:text-gray-300">
                  Active member
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {!isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-1"
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/change-password")}
                  className="flex-1"
                >
                  Change Password
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      address: user.address,
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="p-6 mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="space-y-2">
            {user.role === "NORMAL_USER" && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/user/stores")}
              >
                Browse and Rate Stores
              </Button>
            )}
            {user.role === "SYSTEM_ADMIN" && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/admin/dashboard")}
              >
                Admin Dashboard
              </Button>
            )}
            {user.role === "STORE_OWNER" && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/store/dashboard")}
              >
                Store Dashboard
              </Button>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
