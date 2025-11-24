"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import {
  getBrandStoryFeatures,
  createBrandStoryFeature,
  updateBrandStoryFeature,
  deleteBrandStoryFeature,
  reorderBrandStoryFeatures,
  type BrandStoryFeature,
} from "@/app/actions/brand-story";
import toast from "react-hot-toast";

const ICON_OPTIONS = [
  "Zap",
  "Shield",
  "Sparkles",
  "TrendingUp",
  "Heart",
  "Star",
  "Rocket",
  "Lightbulb",
  "Package",
  "Globe",
  "Users",
  "Award",
];

export default function BrandStoryAdmin() {
  const [features, setFeatures] = useState<BrandStoryFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Zap",
  });

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    setLoading(true);
    try {
      const data = await getBrandStoryFeatures();
      setFeatures(data);
    } catch (error) {
      toast.error("Failed to load brand story features");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (feature?: BrandStoryFeature) => {
    if (feature) {
      setEditingId(feature.id);
      setFormData({
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", description: "", icon: "Zap" });
    }
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingId) {
        await updateBrandStoryFeature(editingId, formData);
        toast.success("Feature updated successfully");
      } else {
        await createBrandStoryFeature(formData);

        toast.success("Feature updated successfully");
      }
      setIsOpen(false);
      loadFeatures();
    } catch (error) {
      toast.error(
        editingId ? "Failed to update feature" : "Failed to create feature"
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBrandStoryFeature(deleteId);
      toast.success("Feature deleted successfully");
      loadFeatures();
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete feature");
    }
  };

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === id) return;

    const draggedIndex = features.findIndex((f) => f.id === draggingId);
    const targetIndex = features.findIndex((f) => f.id === id);

    const newFeatures = [...features];
    [newFeatures[draggedIndex], newFeatures[targetIndex]] = [
      newFeatures[targetIndex],
      newFeatures[draggedIndex],
    ];

    setFeatures(newFeatures);
  };

  const handleDragEnd = async () => {
    setDraggingId(null);
    const reorderedFeatures = features.map((f, i) => ({ id: f.id, order: i }));
    try {
      await reorderBrandStoryFeatures(reorderedFeatures);

      toast.success("Features reordered successfully");
    } catch (error) {
      toast.success("Failed to reorder features");
      loadFeatures();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-3 font-semibold">
            Brand Story Management
          </h1>
          <p className="text-muted-foreground">
            Manage brand story in your ecommerce shoe store
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Feature" : "Add New Feature"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update the feature details below"
                  : "Create a new feature for your brand story section"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Innovative Design"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Cutting-edge technology meets timeless aesthetics..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(v) => setFormData({ ...formData, icon: v })}
                >
                  <SelectTrigger id="icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingId ? "Update Feature" : "Create Feature"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : features.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-muted-foreground mb-4">No features added yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Feature
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Features ({features.length})</CardTitle>
            <CardDescription>
              Drag to reorder features on your brand story section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  draggable
                  onDragStart={() => handleDragStart(feature.id)}
                  onDragOver={(e) => handleDragOver(e, feature.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    draggingId === feature.id
                      ? "bg-muted border-primary opacity-50"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {feature.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Icon: {feature.icon}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(feature)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(feature.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feature</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feature? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
