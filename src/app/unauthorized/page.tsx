"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-error">Unauthorized Access</h1>
                <p className="text-lg">You do not have permission to access this page.</p>
                <button
                    onClick={() => router.push("/login")}
                    className="btn btn-primary"
                >
                    Return to Login
                </button>
            </div>
        </div>
    );
} 