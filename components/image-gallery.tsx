// tomato-classification-frontend/components/image-gallery.tsx
"use client"

import Image from "next/image"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ title, images }: ImageGalleryProps) {
  if (images.length === 0) return null

  const gridCols =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-2"
        : "grid-cols-2 md:grid-cols-3"

  return (
    <div className={`grid gap-2 ${gridCols}`}>
      {images.map((image, index) => (
        <div
          key={image}
          className="relative aspect-video overflow-hidden rounded-lg border border-border/50 bg-muted"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}${image}`}
            alt={`${title} ${index + 1}`}
            fill
            className="object-cover"
            quality={100} 
            sizes="
              (max-width: 640px) 100vw, 
              (max-width: 1024px) 50vw, 
              33vw
            "
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}