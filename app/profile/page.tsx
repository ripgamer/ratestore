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
import { useState } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

    try {
      // In a real application, you would call an API endpoint to update the profile
      // For now, we'll just show a success message
      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // You would typically call: await fetch('/api/profile', { method: 'PUT', body: JSON.stringify(formData) })
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and settings
          </p>
        </div>

        <Card className="p-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
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
                className="disabled:bg-gray-100"
              />
            </div>

            {/* Email */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="disabled:bg-gray-100"
              />
            </div>

            {/* Address */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="disabled:bg-gray-100"
              />
            </div>

            {/* Role Display */}
            <div>
              <Label className="mb-2 block">Account Type</Label>
              <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
                <span className="capitalize text-gray-700 font-medium">
                  {user.role.replace("_", " ").toLowerCase()}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <Label className="mb-2 block">Member Since</Label>
              <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
                <span className="text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString()}
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
