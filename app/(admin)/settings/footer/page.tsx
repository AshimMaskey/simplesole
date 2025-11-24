"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit2, Plus } from "lucide-react";
import {
  getFooterInfo,
  updateFooterInfo,
  getFooterLinks,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  getFooterSocialLinks,
  createFooterSocialLink,
  updateFooterSocialLink,
  deleteFooterSocialLink,
  type FooterLink,
  type FooterSocialLink,
  type FooterInfo,
} from "@/app/actions/footer";
import toast from "react-hot-toast";
import Spinner from "@/components/spinner/Spinner";

const socialIcons = {
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg>`,
  twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" /></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" /></svg>`,
};

export default function FooterAdminPage() {
  const [loading, setLoading] = useState(true);
  const [footerInfo, setFooterInfo] = useState<FooterInfo | null>(null);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<FooterSocialLink[]>([]);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [editingSocial, setEditingSocial] = useState<FooterSocialLink | null>(
    null
  );

  useEffect(() => {
    loadFooterData();
  }, []);

  async function loadFooterData() {
    try {
      setLoading(true);
      const [info, links, socials] = await Promise.all([
        getFooterInfo(),
        getFooterLinks(),
        getFooterSocialLinks(),
      ]);
      setFooterInfo(info);
      setFooterLinks(links);
      setSocialLinks(socials);
    } catch (error) {
      toast.error("Failed to load footer data");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateInfo(formData: FormData) {
    try {
      const companyName = formData.get("companyName") as string;
      const description = formData.get("description") as string;
      const copyrightText = formData.get("copyrightText") as string;

      const updated = await updateFooterInfo({
        companyName,
        description,
        copyrightText,
      });
      setFooterInfo(updated);
      setIsEditingInfo(false);
      toast.success("Footer info updated");
    } catch (error) {
      toast.error("Failed to update footer info");
    }
  }

  async function handleAddLink(formData: FormData) {
    try {
      const label = formData.get("label") as string;
      const href = formData.get("href") as string;

      const newLink = await createFooterLink({
        label,
        href,
        order: footerLinks.length,
      });
      setFooterLinks([...footerLinks, newLink]);

      toast.success("Link Added");
    } catch (error) {
      toast.error("Failed to add link");
    }
  }

  async function handleUpdateLink(id: string, formData: FormData) {
    try {
      const label = formData.get("label") as string;
      const href = formData.get("href") as string;

      const updated = await updateFooterLink(id, { label, href });
      setFooterLinks(footerLinks.map((l) => (l.id === id ? updated : l)));
      setEditingLink(null);

      toast.success("Link Updated");
    } catch (error) {
      toast.error("Failed to update lin");
    }
  }

  async function handleDeleteLink(id: string) {
    try {
      await deleteFooterLink(id);
      setFooterLinks(footerLinks.filter((l) => l.id !== id));

      toast.success("Link deleted");
    } catch (error) {
      toast.error("Failed to delete link");
    }
  }

  async function handleAddSocial(formData: FormData) {
    try {
      const name = formData.get("name") as string;
      const href = formData.get("href") as string;
      const icon = socialIcons[name as keyof typeof socialIcons] || "";

      const newSocial = await createFooterSocialLink({
        name,
        href,
        icon,
        order: socialLinks.length,
      });
      setSocialLinks([...socialLinks, newSocial]);

      toast.success("Social link added");
    } catch (error) {
      toast.error("Failed to add social link");
    }
  }

  async function handleUpdateSocial(id: string, formData: FormData) {
    try {
      const name = formData.get("name") as string;
      const href = formData.get("href") as string;
      const icon = socialIcons[name as keyof typeof socialIcons] || "";

      const updated = await updateFooterSocialLink(id, { name, href, icon });
      setSocialLinks(socialLinks.map((s) => (s.id === id ? updated : s)));
      setEditingSocial(null);

      toast.success("Social link updated");
    } catch (error) {
      toast.error("Failed to update social link");
    }
  }

  async function handleDeleteSocial(id: string) {
    try {
      await deleteFooterSocialLink(id);
      setSocialLinks(socialLinks.filter((s) => s.id !== id));
      toast.success("Social link deleted");
    } catch (error) {
      toast.error("Failed to delete social link");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-3xl mb-3 font-semibold">Footer Management</h1>
        <p className="text-muted-foreground">
          Manage footer details in your ecommerce shoe store
        </p>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="py-4">
          <TabsTrigger className="cursor-pointer p-4" value="info">
            Company Info
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer p-4" value="links">
            Quick Links
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer p-4" value="social">
            Social Links
          </TabsTrigger>
        </TabsList>

        {/* Company Info Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Manage your company name, description, and copyright text
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditingInfo ? (
                <div className=" rounded-md space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Company Name
                    </p>
                    <p className="text-lg">{footerInfo?.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Description
                    </p>
                    <p className="text-base">{footerInfo?.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Copyright Text
                    </p>
                    <p className="text-base">{footerInfo?.copyrightText}</p>
                  </div>
                  <Button onClick={() => setIsEditingInfo(true)}>
                    Edit Information
                  </Button>
                </div>
              ) : (
                <form
                  action={async (formData) => {
                    await handleUpdateInfo(formData);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Company Name
                    </label>
                    <Input
                      defaultValue={footerInfo?.companyName || ""}
                      name="companyName"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <Textarea
                      defaultValue={footerInfo?.description || ""}
                      name="description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Copyright Text
                    </label>
                    <Input
                      defaultValue={footerInfo?.copyrightText || ""}
                      name="copyrightText"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingInfo(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Links Tab */}
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Manage footer navigation links</CardDescription>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Link</DialogTitle>
                  </DialogHeader>
                  <form
                    action={async (formData) => {
                      await handleAddLink(formData);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium">Label</label>
                      <Input
                        name="label"
                        placeholder="e.g., About Us"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">URL</label>
                      <Input name="href" placeholder="e.g., /about" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Link
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {footerLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <p className="font-medium">{link.label}</p>
                      <p className="text-sm text-gray-600">{link.href}</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog
                        open={editingLink?.id === link.id}
                        onOpenChange={(open) => {
                          if (!open) setEditingLink(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingLink(link)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Link</DialogTitle>
                          </DialogHeader>
                          <form
                            action={async (formData) => {
                              await handleUpdateLink(link.id, formData);
                            }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="text-sm font-medium">
                                Label
                              </label>
                              <Input
                                name="label"
                                defaultValue={link.label}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">URL</label>
                              <Input
                                name="href"
                                defaultValue={link.href}
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Update Link
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage your social media profiles
              </CardDescription>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Social Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Social Media Link</DialogTitle>
                  </DialogHeader>
                  <form
                    action={async (formData) => {
                      await handleAddSocial(formData);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium">Platform</label>
                      <select
                        name="name"
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      >
                        <option value="">Select a platform</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Profile URL</label>
                      <Input
                        name="href"
                        placeholder="e.g., https://facebook.com/yourprofile"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Social Link
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <div
                    key={social.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8"
                        dangerouslySetInnerHTML={{ __html: social.icon }}
                      />
                      <div>
                        <p className="font-medium capitalize">{social.name}</p>
                        <p className="text-sm text-gray-600">{social.href}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog
                        open={editingSocial?.id === social.id}
                        onOpenChange={(open) => {
                          if (!open) setEditingSocial(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingSocial(social)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Social Link</DialogTitle>
                          </DialogHeader>
                          <form
                            action={async (formData) => {
                              await handleUpdateSocial(social.id, formData);
                            }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="text-sm font-medium">
                                Platform
                              </label>
                              <select
                                name="name"
                                defaultValue={social.name}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                              >
                                <option value="facebook">Facebook</option>
                                <option value="twitter">Twitter</option>
                                <option value="instagram">Instagram</option>
                                <option value="youtube">YouTube</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Profile URL
                              </label>
                              <Input
                                name="href"
                                defaultValue={social.href}
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Update Social Link
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSocial(social.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
