"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Info, Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DEMO_CREDENTIALS, HAS_DEMO_CREDENTIALS } from "@/config/demoUser";
import { ROUTES } from "@/config/routes";
import { Button, Input } from "@/components/common";
import gs1Logo from "@/assets/images/gs1-logo.png";
import loginBg from "@/assets/images/login-bg-img.jpg";

const validationSchema = Yup.object({
    email: Yup.string().trim().required("Email is required").email("Enter a valid email address"),
    password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) router.replace(ROUTES.DASHBOARD);
    }, [isAuthenticated, isLoading, router]);

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const user = await login(values);
                toast.success(`Welcome back, ${user.name}`);
                router.push(ROUTES.DASHBOARD);
            } catch (error) {
                toast.error(error.message);
            }
        },
    });

    const fillDemoCredentials = () => {
        formik.setValues(DEMO_CREDENTIALS, true);
    };

    const fieldError = (name) => (formik.touched[name] && formik.errors[name] ? formik.errors[name] : undefined);

    return (
        <div className="flex min-h-screen bg-[#d5e4f0] lg:bg-white">
            {/* ── Left branding panel (desktop) ── */}
            <div className="relative hidden flex-1 lg:flex">
                <Image src={loginBg} alt="" fill priority placeholder="blur" className="object-cover" sizes="50vw" />
                <div className="relative z-10 flex flex-1 flex-col px-16 py-10 xl:px-[70px]">
                    <Image src={gs1Logo} alt="GS1 Saudi Arabia" className="h-auto w-[clamp(120px,12vw,200px)]" priority />
                    <div className="flex flex-1 flex-col justify-center">
                        <h2 className="max-w-lg text-4xl font-bold leading-tight text-heading xl:text-[2.8rem]">
                            Solution Provider Portal
                        </h2>
                        <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-[#4a6080]">
                            Browse, search and verify GS1 registered products from the national product catalogue.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:bg-white lg:px-16">
                <div className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-card sm:p-10 lg:rounded-none lg:p-0 lg:shadow-none">
                    <Image src={gs1Logo} alt="GS1 Saudi Arabia" className="mb-8 h-12 w-auto lg:hidden" priority />

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-heading sm:text-[2.5rem]">Login</h1>
                        <p className="mt-2 text-sm text-muted">Sign in to your solution provider account</p>
                    </div>

                    {/* Demo credentials (only when set in .env) */}
                    {HAS_DEMO_CREDENTIALS && (
                        <div className="mb-6 rounded-xl border border-primary/15 bg-primary-soft p-4">
                            <div className="flex items-start gap-3">
                                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                                <div className="min-w-0 flex-1 text-sm">
                                    <p className="font-bold text-primary">Demo account</p>
                                    <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-heading">
                                        <dt className="text-muted">Email</dt>
                                        <dd className="truncate font-mono font-semibold">{DEMO_CREDENTIALS.email}</dd>
                                        <dt className="text-muted">Password</dt>
                                        <dd className="font-mono font-semibold">{DEMO_CREDENTIALS.password}</dd>
                                    </dl>
                                </div>
                                <Button variant="outline" size="sm" onClick={fillDemoCredentials} className="shrink-0">
                                    Use
                                </Button>
                            </div>
                        </div>
                    )}

                    <form noValidate onSubmit={formik.handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            icon={Mail}
                            autoComplete="username"
                            placeholder="Enter your email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={fieldError("email")}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            icon={Lock}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={fieldError("password")}
                        />

                        <Button type="submit" size="lg" fullWidth loading={formik.isSubmitting} loadingText="Logging in..." className="!mt-6">
                            Login
                        </Button>
                    </form>

                    <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Official GS1 Saudi Arabia solution provider portal
                    </p>
                </div>
            </div>
        </div>
    );
}
