"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { ImagePlus, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { createPostSchema, PostCreate } from "@/schemas/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPost } from "@/lib/api/post";
import { showErrorToast } from "@/lib/showErrorToast";

export function CreatePostModal() {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<PostCreate>({
    resolver: zodResolver(createPostSchema),
  });

  const closeModal = () => {
    form.reset();
    setPreviewUrl(null);
    setOpen(false);
  };

  const addMutation = useMutation({
    mutationFn: addPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Post created successfully");

      closeModal();
    },
    onError: (error) => showErrorToast(error),
  });

  const handleCreate = (values: PostCreate) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("content", values.content);

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    addMutation.mutate(formData);
  };

  const handleFileChange = (file: File) => {
    form.setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleCreate)}
          className="flex flex-col gap-4 pt-2"
        >
          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>

            <Input
              id="title"
              placeholder="What's your question or topic?"
              {...form.register("title")}
            />

            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="content">Content</Label>

            <Textarea
              id="content"
              placeholder="Describe your question..."
              className="min-h-[120px] resize-none"
              {...form.register("content")}
            />

            {form.formState.errors.content && (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
              <img
                src={previewUrl}
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  form.setValue("image", undefined as any);
                }}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
            }}
          />

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5"
            >
              <ImagePlus className="h-4 w-4" />
              Add Image
            </Button>

            <Button type="submit" disabled={addMutation.isPending}>
              {addMutation.isPending ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}