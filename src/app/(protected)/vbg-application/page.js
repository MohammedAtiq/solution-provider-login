"use client";

import {
    Barcode,
    Building2,
    CheckCircle2,
    Code2,
    ExternalLink,
    KeyRound,
    MapPin,
    ScanLine,
    ShieldCheck,
    UserCog,
    Users,
} from "lucide-react";
import { VBG_APP_URL } from "@/config/routes";
import { Badge, Button, Card, PageHeader, StatCard } from "@/components/common";

const PORTALS = [
    {
        icon: Building2,
        title: "Member Portal",
        audience: "GS1 member companies",
        points: [
            "Register products & generate barcodes",
            "Manage brands, GLN locations and SSCC codes",
            "Create sub-users and map them to locations",
            "Traceability: batch → label → QR → map journey",
        ],
    },
    {
        icon: Code2,
        title: "API Subscriber Console",
        audience: "Developers integrating with GS1 data",
        points: [
            "Create and revoke API keys",
            "Track usage logs and remaining quota",
            "Try the live GTIN, GCP, GLN and GS1 Parse APIs",
            "Manage account and plan details",
        ],
    },
    {
        icon: UserCog,
        title: "Admin Portal",
        audience: "GS1 Saudi Arabia staff",
        points: [
            "Manage API subscribers, plans and keys",
            "Review platform-wide usage and analytics",
            "Activate, suspend or reset subscriber accounts",
            "Administer staff users and access",
        ],
    },
];

const LOOKUPS = [
    { method: "GET", path: "/v1/gtin/{barcode}", desc: "Verify a product barcode and fetch product, company and licence details." },
    { method: "POST", path: "/v1/gs1/parse", desc: "Break a GS1 element string down into its Application Identifiers." },
    { method: "GET", path: "/v1/gcp/{gcp}", desc: "Look up the company and licence behind a GS1 Company Prefix." },
    { method: "GET", path: "/v1/gln/{gln}", desc: "Look up the details of a Global Location Number." },
];

const HIGHLIGHTS = [
    { icon: ShieldCheck, text: "Mandatory two-factor authentication (authenticator app) for subscribers and staff" },
    { icon: KeyRound, text: "API key secrets are shown only once at creation — revoke and re-create if lost" },
    { icon: Users, text: "Plan-based scopes decide which lookups each subscriber can use" },
    { icon: CheckCircle2, text: "Available in English and Arabic, with full right-to-left support" },
];

const openVbg = () => VBG_APP_URL && window.open(VBG_APP_URL, "_blank", "noopener,noreferrer");

export default function VbgApplicationPage() {
    return (
        <>
            <PageHeader
                title="VBG Application"
                subtitle="Verified by GS1 — GS1 Saudi Arabia's registry and lookup platform"
                actions={
                    <Button variant="accent" rightIcon={<ExternalLink className="h-4 w-4" />} onClick={openVbg} disabled={!VBG_APP_URL}>
                        Open VBG Application
                    </Button>
                }
            />

            {/* Intro banner */}
            <section className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-6 text-white shadow-card sm:p-8">
                <p className="text-sm font-medium text-white/70">About VBG</p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Verify any barcode, company prefix or location</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/80">
                    VBG lets businesses confirm that a GTIN, GCP or GLN is genuine, licensed and linked to the right company and
                    product data. It brings together a member portal, an API console for developers and an admin portal for GS1 staff.
                </p>
                <Button variant="accent" className="mt-5" rightIcon={<ExternalLink className="h-4 w-4" />} onClick={openVbg} disabled={!VBG_APP_URL}>
                    Go to VBG Application
                </Button>
            </section>

            {/* What it verifies */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Barcode} label="GTIN" value="Products" hint="Global Trade Item Number" tone="primary" />
                <StatCard icon={Building2} label="GCP" value="Companies" hint="GS1 Company Prefix" tone="accent" />
                <StatCard icon={MapPin} label="GLN" value="Locations" hint="Global Location Number" tone="success" />
                <StatCard icon={ScanLine} label="SSCC" value="Logistics" hint="Serial Shipping Container Code" tone="indigo" />
            </div>

            {/* Portals */}
            <div className="mb-6 grid gap-6 lg:grid-cols-3">
                {PORTALS.map(({ icon: Icon, title, audience, points }) => (
                    <Card key={title} bodyClassName="flex h-full flex-col">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <h3 className="font-bold text-heading">{title}</h3>
                                <p className="text-xs text-muted">{audience}</p>
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {points.map((point) => (
                                <li key={point} className="flex gap-2 text-sm text-body">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <Card title="Verified by GS1 lookup APIs" subtitle="Authenticated with an X-API-Key issued in the API console" className="xl:col-span-2">
                    <ul className="divide-y divide-line">
                        {LOOKUPS.map(({ method, path, desc }) => (
                            <li key={path} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4">
                                <div className="flex shrink-0 items-center gap-2 sm:w-56">
                                    <Badge variant={method === "GET" ? "success" : "accent"}>{method}</Badge>
                                    <code className="truncate text-sm font-semibold text-primary">{path}</code>
                                </div>
                                <p className="text-sm text-muted">{desc}</p>
                            </li>
                        ))}
                    </ul>
                </Card>

                <div className="space-y-6">
                    <Card title="Security & access">
                        <ul className="space-y-3">
                            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex gap-2 text-sm text-body">
                                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card title="Ready to get started?" subtitle="Sign in with your VBG credentials">
                        <Button fullWidth rightIcon={<ExternalLink className="h-4 w-4" />} onClick={openVbg} disabled={!VBG_APP_URL}>
                            Open VBG Application
                        </Button>
                        <p className="mt-3 break-all text-center text-xs text-muted">{VBG_APP_URL || "Link not configured"}</p>
                    </Card>
                </div>
            </div>
        </>
    );
}
