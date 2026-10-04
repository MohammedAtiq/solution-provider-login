"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Product image with a placeholder for missing/broken URLs.
 * Plain <img>: product images come from many hosts (CDN, gs1.org.sa, SharePoint),
 * which next/image would require whitelisting one by one.
 */
export default function ProductImage({ src, alt, className, imgClassName }) {
    const [failedSrc, setFailedSrc] = useState(null);
    const showImage = src && failedSrc !== src;

    return (
        <div className={cn("flex items-center justify-center overflow-hidden bg-page", className)}>
            {showImage ? (
                <img src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} className={cn("h-full w-full object-contain", imgClassName)} />
            ) : (
                <div className="flex flex-col items-center gap-1 text-muted/70">
                    <ImageOff className="h-8 w-8" aria-hidden="true" />
                    <span className="text-xs">No image</span>
                </div>
            )}
        </div>
    );
}
