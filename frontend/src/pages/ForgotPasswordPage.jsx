import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Sprout,
  ShieldCheck,
} from "lucide-react";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // form state
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // phone change
  const handlePhoneChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setPhone(value);
    setError("");
    setMessage("");
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // validate mobile
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      // send forgot password request
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: phone,
        }),
      });

      // read response safely
      const contentType = response.headers.get("content-type");

      let data = {};

      if (contentType?.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to process password reset request."
        );
        return;
      }

      setMessage(
        data.message ||
          "Password reset request created successfully."
      );

      // store reset data for development flow
      if (data.resetToken) {
        sessionStorage.setItem(
          "bf_password_reset_token",
          data.resetToken
        );

        sessionStorage.setItem(
          "bf_password_reset_mobile",
          phone
        );

        navigate("/reset-password");
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/hero/marketplace.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-green-950/15" />

      <div className="relative z-10 w-full max-w-md">
        {/* brand */}
        <div className="mb-6 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 shadow-xl">
            <Sprout
              size={36}
              strokeWidth={1.8}
              className="text-green-700"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Bharat Fasal
          </h1>

          <p className="mt-1 text-white/85">
            Digital agriculture marketplace
          </p>
        </div>

        {/* forgot password card */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
          {/* back to login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            <ArrowLeft size={17} />
            Back to Login
          </button>

          {/* heading */}
          <div className="mb-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <ShieldCheck
                size={23}
                className="text-green-700"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Forgot Password?
            </h2>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Enter your registered mobile number to reset
              your Bharat Fasal password.
            </p>
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* mobile */}
            <div>
              <label
                htmlFor="forgot-password-mobile"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Mobile Number
              </label>

              <div className="flex gap-2">
                <div className="flex h-12 items-center rounded-xl border border-gray-200 bg-white/80 px-3 font-semibold text-gray-700">
                  +91
                </div>

                <div className="relative flex-1">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="forgot-password-mobile"
                    type="tel"
                    inputMode="numeric"
                    name="mobile"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* success */}
            {message && !error && (
              <div
                role="status"
                className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {message}
              </div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Continue
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* login */}
          <div className="mt-5 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-700 hover:text-green-800"
            >
              Login
            </Link>
          </div>
        </div>

        {/* footer */}
        <p className="mt-5 text-center text-xs text-white/75">
          Your account security is important to us.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;