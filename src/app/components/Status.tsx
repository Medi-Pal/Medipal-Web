"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function Unverified() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;

    // Set a direct timeout for navigation that will sign out the user first
    const redirectTimer = setTimeout(async () => {
      console.log("Redirect timeout triggered");
      try {
        // Sign out the user first, removing the session
        await signOut({ redirect: false });
        console.log("User signed out");

        // After signout, redirect to login
        window.location.href = '/login';
      } catch (error) {
        console.error("Error during sign out:", error);
        // Fallback direct navigation
        window.location.href = '/login';
      }
    }, 5000);

    // Separate interval just for updating the visual countdown
    const countdownTimer = setInterval(() => {
      setCountdown((prevCount) => {
        // Just update the display counter
        return prevCount > 0 ? prevCount - 1 : 0;
      });
    }, 1000);

    // Clear both timers on unmount
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
      console.log("Timers cleared on unmount");
    };
  }, []);

  // Function for manual redirect with signout
  const handleManualRedirect = async () => {
    console.log("Manual redirect triggered");
    try {
      await signOut({ redirect: false });
      console.log("User signed out manually");
      window.location.href = '/login';
    } catch (error) {
      console.error("Error during manual sign out:", error);
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Account Verification Pending
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto my-4"></div>
        </div>

        <p className="text-lg text-gray-700 mb-6">
          Your account is currently under review by our administration team.
          You will be able to access the system once your credentials have been verified.
        </p>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            If you have any questions, please contact our support team for assistance.
          </p>
        </div>

        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-2">
            Redirecting to login page in
          </div>
          <div className="flex justify-center items-center">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{countdown}</span>
            </div>
          </div>
          {/* Sign out button */}
          <button
            onClick={handleManualRedirect}
            className="mt-4 btn btn-primary w-full"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}
