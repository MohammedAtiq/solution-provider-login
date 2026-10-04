"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Barcode, Building2, ExternalLink } from "lucide-react";
import { useProductDetail, getApiErrorMessage } from "@/lib/api";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/utils/product";
import { Badge, Button, Card, DetailRow, Skeleton, StateMessage } from "@/components/common";
import ProductImage from "@/components/products/ProductImage";

function ImageGallery({ images, alt }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = images[activeIndex] ?? images[0];

    return (
        <div>
            <ProductImage src={active} alt={alt} className="aspect-square rounded-2xl border border-line p-4" />
            {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                    {images.map((src, index) => (
                        <button
                            key={src}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeIndex ? "border-primary" : "border-line"}`}
                            aria-label={`Show image ${index + 1}`}
                        >
                            <ProductImage src={src} alt="" className="h-full w-full p-1" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function DetailSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-3 rounded-2xl bg-surface p-6 shadow-soft">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-5 w-full" />)}
            </div>
        </div>
    );
}

export default function ProductDetailPage() {
    const router = useRouter();
    const { gtin } = useParams();
    const { data, isLoading, isError, error, refetch } = useProductDetail(gtin);

    const backButton = (
        <Button variant="ghost" size="sm" className="mb-4 -ms-2" leftIcon={<ArrowLeft className="h-4 w-4 rtl:rotate-180" />} onClick={() => router.back()}>
            Back to products
        </Button>
    );

    if (isLoading) return <>{backButton}<DetailSkeleton /></>;

    if (isError) {
        return <>{backButton}<StateMessage variant="error" title="Could not load product" description={getApiErrorMessage(error)} onRetry={refetch} /></>;
    }

    if (!data) {
        return (
            <>
                {backButton}
                <StateMessage
                    title="Product not found"
                    description={`No product is registered with GTIN ${gtin}.`}
                    action={<Button size="sm" onClick={() => router.push(ROUTES.PRODUCTS)}>Browse products</Button>}
                />
            </>
        );
    }

    const { product, company } = data;
    const sizeLabel = [product.size, product.unit].filter(Boolean).join(" ");

    return (
        <>
            {backButton}

            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <div className="space-y-4">
                    <div className="rounded-2xl bg-surface p-4 shadow-soft">
                        <ImageGallery images={product.images} alt={product.name} />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Title block */}
                    <section className="rounded-2xl bg-surface p-6 shadow-soft">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={product.isActive ? "success" : "inactive"}>{product.isActive ? "Active" : "Inactive"}</Badge>
                            {product.category && <Badge>{product.category}</Badge>}
                        </div>
                        <h1 className="mt-3 text-2xl font-bold text-heading">{product.name || "Unnamed product"}</h1>
                        {product.nameAr && <p className="mt-1 text-lg text-muted" dir="rtl">{product.nameAr}</p>}
                        <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-page px-3 py-1.5 font-mono text-sm font-semibold text-primary">
                            <Barcode className="h-4 w-4" aria-hidden="true" />
                            {product.gtin}
                        </p>
                        {product.description && <p className="mt-4 text-sm leading-relaxed text-body">{product.description}</p>}
                        {product.descriptionAr && <p className="mt-2 text-sm leading-relaxed text-muted" dir="rtl">{product.descriptionAr}</p>}
                    </section>

                    <Card title="Product details">
                        <dl>
                            <DetailRow label="GTIN" value={product.gtin} />
                            <DetailRow label="Brand" value={product.brand} />
                            <DetailRow label="Brand (Arabic)" value={product.brandAr} dir="rtl" />
                            <DetailRow label="Category" value={product.category} />
                            <DetailRow label="GPC" value={product.gpc && `${product.gpc}${product.gpcCode ? ` (${product.gpcCode})` : ""}`} />
                            <DetailRow label="Packaging" value={product.packagingType} />
                            <DetailRow label="Size / Unit" value={sizeLabel} />
                            <DetailRow label="Country of origin" value={product.origin} />
                            <DetailRow label="Country of sale" value={product.countrySale} />
                            <DetailRow label="HS code" value={product.hsCode} />
                            <DetailRow label="SKU" value={product.sku} />
                            <DetailRow label="GS1 Company Prefix" value={product.gcp} />
                            <DetailRow label="Registered on" value={formatDate(product.createdAt)} />
                            <DetailRow label="Last updated" value={formatDate(product.updatedAt)} />
                        </dl>
                    </Card>

                    <Card
                        title="Company"
                        action={<Building2 className="h-5 w-5 text-muted" aria-hidden="true" />}
                    >
                        <dl>
                            <DetailRow label="Company name" value={company.name} />
                            <DetailRow label="Company (Arabic)" value={company.nameAr} dir="rtl" />
                            <DetailRow label="Address" value={company.address} />
                            <DetailRow
                                label="Website"
                                value={
                                    company.website && /^https?:\/\//i.test(company.website) ? (
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                                            {company.website}
                                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                        </a>
                                    ) : company.website
                                }
                            />
                            <DetailRow label="Licence type" value={company.licenceType} />
                            <DetailRow label="Licence expiry" value={company.licenceExpiry && formatDate(company.licenceExpiry)} />
                            <DetailRow label="Member organisation" value={company.memberOrganisation} />
                        </dl>
                    </Card>
                </div>
            </div>
        </>
    );
}
