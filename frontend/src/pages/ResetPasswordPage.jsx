import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Sprout,
  ShieldCheck,
} from "lucide-react";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  // form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // reset password
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // get reset data
    const resetToken = sessionStorage.getItem(
      "bf_password_reset_token"
    );

    const mobile = sessionStorage.getItem(
      "bf_password_reset_mobile"
    );

    if (!resetToken || !mobile) {
      setError(
        "Password reset session has expired. Please start again."
      );
      return;
    }

    // validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // reset password request
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile,
            resetToken,
            newPassword: password,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type");

      let data = {};

      if (contentType?.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to reset your password."
        );
        return;
      }

      setMessage(
        data.message ||
          "Password reset successfully."
      );

      // clear reset session
      sessionStorage.removeItem(
        "bf_password_reset_token"
      );

      sessionStorage.removeItem(
        "bf_password_reset_mobile"
      );

      // go to login
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Reset password error:", error);

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

        {/* reset password card */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
          {/* back */}
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            <ArrowLeft size={17} />
            Back
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
              Reset Password
            </h2>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Create a new password for your Bharat Fasal
              account.
            </p>
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* new password */}
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="new-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-11 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* confirm password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value
                    );
                    setError("");
                    setMessage("");
                  }}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-11 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
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
              disabled={
                loading ||
                password.length < 6 ||
                confirmPassword.length < 6
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? (
                "Resetting..."
              ) : (
                <>
                  Reset Password
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

export default ResetPasswordPage;