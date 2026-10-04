/**
 * Product helpers — normalise the catalogue API's product rows into one shape
 * the UI can rely on. Adapted from product_catalogue's productHelpers / gtin.
 */

const IMAGE_BASE_URL = (
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""
).replace(/\/$/, "");

/** Decode HTML entities and drop "????" runs left by encoding issues. */
export function cleanText(text) {
    if (text == null) return "";
    return String(text)
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/[?؟�]{2,}/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/** Relative paths (incl. Windows-style `\uploads\...`) → absolute URL. */
export function toAbsoluteImageUrl(path) {
    if (!path || typeof path !== "string" || !path.trim()) return null;
    const normalized = path.trim().replace(/\\/g, "/").replace(/^\/+/, "");
    if (/^https?:\/\//i.test(normalized)) return normalized;
    return `${IMAGE_BASE_URL}/${normalized}`;
}

const isNumericCode = (value) => value != null && /^\d+$/.test(String(value).trim());

/** Map an API product row (list or detail) to the UI shape. */
export function mapProduct(product) {
    if (!product) return null;

    const images = [
        product.front_image,
        product.back_image,
        product.image_1,
        product.image_2,
        product.image_3,
    ]
        .map(toAbsoluteImageUrl)
        .filter(Boolean);

    return {
        raw: product,
        id: product.id ?? product.barcode,
        gtin: product.barcode ?? product.gtin ?? "",
        gcp: product.gcpGLNID ?? "",
        name: cleanText(product.productnameenglish ?? product.product_name_english ?? product.name),
        nameAr: cleanText(product.productnamearabic ?? product.product_name_arabic),
        brand: cleanText(product.BrandName),
        brandAr: cleanText(product.BrandNameAr),
        // A numeric ProductType is an internal code, not a readable category
        category: isNumericCode(product.ProductType) ? "" : cleanText(product.ProductType),
        gpc: cleanText(product.gpc),
        gpcCode: product.gpc_code ?? "",
        description: cleanText(product.details_page ?? product.HsDescription),
        descriptionAr: cleanText(product.details_page_ar),
        packagingType: cleanText(product.PackagingType),
        size: product.size ?? "",
        unit: product.unit ?? "",
        origin: product.Origin ?? "",
        countrySale: product.countrySale ?? "",
        hsCode: product.HSCODES ?? product.HsCodes ?? "",
        sku: product.sku ?? "",
        isActive: product.status === 1 || product.status === "1",
        createdAt: product.created_at ?? null,
        updatedAt: product.updated_at ?? null,
        images: [...new Set(images)],
    };
}

/** Company block returned alongside product_by_gtin. */
export function mapCompany(company, product) {
    const source = company ?? product ?? {};
    return {
        name: cleanText(source.company_name_eng ?? source.companyName ?? source.company_name),
        nameAr: cleanText(source.company_name_arabic),
        address: cleanText(source.address ?? source.gps_location),
        website: source.website ?? "",
        licenceType: source.licenceType ?? source.gcp_type ?? "",
        licenceExpiry: source.licence_expiry ?? source.gcp_expiry ?? null,
        memberOrganisation: source.moName ?? "",
    };
}

/* ---------- GTIN validation (Saudi 628… GTINs) ---------- */

function computeGtinCheckDigit(digitsWithoutCheck) {
    const sum = String(digitsWithoutCheck)
        .split("")
        .reverse()
        .reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 3 : 1), 0);
    return (10 - (sum % 10)) % 10;
}

function isValidGtinChecksum(gtin) {
    if (!/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(gtin)) return false;
    return computeGtinCheckDigit(gtin.slice(0, -1)) === Number(gtin.slice(-1));
}

/**
 * @returns {{ ok: true, gtin: string } | { ok: false }}
 */
export function validateSaudiGtin(query) {
    let gtin = String(query || "").trim();
    if (!/^\d+$/.test(gtin)) return { ok: false };
    // GTIN-14 with a leading indicator 0 → GTIN-13
    if (gtin.startsWith("0628")) gtin = gtin.slice(1);
    if (!gtin.startsWith("628") || !isValidGtinChecksum(gtin)) return { ok: false };
    return { ok: true, gtin };
}

export const isNumericQuery = (query) => /^\d+$/.test(String(query || "").trim());

export function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
