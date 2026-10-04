import Link from "next/link";
import { Barcode } from "lucide-react";
import { ROUTES } from "@/config/routes";
import Badge from "@/components/common/Badge";
import Skeleton from "@/components/common/Skeleton";
import ProductImage from "./ProductImage";

/** Grid card for one product — links to the detail page by GTIN. */
export default function ProductCard({ product }) {
    return (
        <Link
            href={ROUTES.PRODUCT_DETAIL(product.gtin)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
        >
            <ProductImage src={product.images[0]} alt={product.name} className="aspect-[4/3] border-b border-line p-3" />

            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                    {product.category ? <Badge variant="primary" className="max-w-[70%] truncate">{product.category}</Badge> : <span />}
                    <Badge variant={product.isActive ? "success" : "inactive"}>{product.isActive ? "Active" : "Inactive"}</Badge>
                </div>

                <h3 className="line-clamp-2 text-sm font-bold text-heading group-hover:text-primary">{product.name || "Unnamed product"}</h3>
                {product.nameAr && (
                    <p className="line-clamp-1 text-xs text-muted" dir="rtl">{product.nameAr}</p>
                )}

                <div className="mt-auto space-y-1 pt-2 text-xs text-muted">
                    {product.brand && <p className="truncate">Brand: <span className="font-semibold text-body">{product.brand}</span></p>}
                    <p className="flex items-center gap-1.5 font-mono">
                        <Barcode className="h-3.5 w-3.5" aria-hidden="true" />
                        {product.gtin}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="mt-3 h-3 w-1/2" />
            </div>
        </div>
    );
}
