"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  getCompanySettings,
  updateCompanySettings,
} from "./actions/settingActions";
import toast from "react-hot-toast";

interface CompanySetting {
  id: string;
  logo_url: string | null;
  company_name: string;
  created_at: Date;
  updated_at: Date;
}

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<CompanySetting | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    logo_url: "",
  });
  const [preview, setPreview] = useState({
    company_name: "",
    logo_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const result = await getCompanySettings();
      if (result.success && result.data) {
        setSettings(result.data);
        setFormData({
          company_name: result.data.company_name,
          logo_url: result.data.logo_url || "",
        });
        setPreview({
          company_name: result.data.company_name,
          logo_url: result.data.logo_url || "",
        });
      }
    };
    loadSettings();
  }, []);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview((prev) => ({
          ...prev,
          logo_url: previewUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setIsUploadingImage(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataObj,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("[v0] Cloudinary upload error:", error);

      toast.error("Failed to upload image to Cloudinary");
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let logoUrl = formData.logo_url;

      // Check if preview has a new image that needs to be uploaded
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput?.files?.[0] && preview.logo_url.startsWith("data:")) {
        const uploadedUrl = await handleImageUpload(fileInput.files[0]);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        } else {
          setIsLoading(false);
          return;
        }
      }

      const result = await updateCompanySettings({
        company_name: formData.company_name,
        logo_url: logoUrl,
      });

      if (result.success) {
        setFormData({
          company_name: formData.company_name,
          logo_url: logoUrl,
        });
        setPreview({
          company_name: formData.company_name,
          logo_url: logoUrl,
        });

        toast.success("Company settings updated successfully");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("[v0] Save error:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl mb-3 font-semibold">General Settings</h1>
        <p className="text-muted-foreground mb-6">
          Manage the general settings in your ecommerce shoe store
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Edit Settings</h2>

            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <Label htmlFor="company_name" className="text-sm font-medium">
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      company_name: e.target.value,
                    }));
                    setPreview((prev) => ({
                      ...prev,
                      company_name: e.target.value,
                    }));
                  }}
                  className="mt-2"
                  placeholder="Enter company name"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <Label htmlFor="logo" className="text-sm font-medium">
                  Logo Image
                </Label>
                <div className="mt-2">
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleImagePreview}
                    className="block w-full cursor-pointer text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG or GIF (Max. 5MB)
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading || isUploadingImage}
                  className="flex-1"
                >
                  {isLoading || isUploadingImage ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Live Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Preview</h2>
            <div className="border border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
              {/* Navbar Preview */}
              <div className="bg-white border-b border-gray-300 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  {preview.logo_url && (
                    <div className="relative w-16 h-16">
                      <Image
                        src={preview.logo_url || "/placeholder.svg"}
                        alt="Company logo preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h1 className="text-xl font-semibold">
                    {preview.company_name || "Company Name"}
                  </h1>
                </div>
              </div>

              {/* Preview Info */}
              <div className="mt-6 text-sm text-muted-foreground">
                <p>This is how your navbar will look on the client side.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
