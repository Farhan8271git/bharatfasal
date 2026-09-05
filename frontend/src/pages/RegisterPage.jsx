import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sprout,
  Building2,
  ShoppingBag,
  Check,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";

const roles = [
  {
    id: "farmer",
    label: "Farmer",
    icon: Sprout,
    description: "Sell your produce",
  },
  {
    id: "fpo",
    label: "FPO",
    icon: Building2,
    description: "Manage your FPO",
  },
  {
    id: "buyer",
    label: "Buyer",
    icon: ShoppingBag,
    description: "Buy agricultural produce",
  },
];

const states = [
  "Uttar Pradesh",
  "Bihar",
  "Madhya Pradesh",
  "Rajasthan",
  "Maharashtra",
  "Punjab",
  "Haryana",
  "Gujarat",
  "West Bengal",
  "Tamil Nadu",
  "Karnataka",
  "Telangana",
  "Andhra Pradesh",
  "Other",
];

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "farmer",
    name: "",
    organizationName: "",
    phone: "",
    email: "",
    village: "",
    district: "",
    state: "",
    businessType: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        name: value,
      }));
    }

    setError("");
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      name: "",
      organizationName: "",
      village: "",
      businessType: "",
    }));

    setError("");
  };

  // register user
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const organizationName = formData.organizationName.trim();

    // Name
    if (!name) {
      setError(
        formData.role === "farmer"
          ? "Please enter your full name."
          : "Please enter the authorized person's name.",
      );
      return;
    }

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
      setError("Name can contain only letters and spaces.");
      return;
    }

    // Organization
    if (
      (formData.role === "fpo" || formData.role === "buyer") &&
      !organizationName
    ) {
      setError(
        formData.role === "fpo"
          ? "Please enter your FPO / organization name."
          : "Please enter your business / organization name.",
      );
      return;
    }

    // Mobile
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    // District
    if (!formData.district.trim()) {
      setError("Please enter your district.");
      return;
    }

    // State
    if (!formData.state) {
      setError("Please select your state.");
      return;
    }

    // Farmer village
    if (formData.role === "farmer" && !formData.village.trim()) {
      setError("Please enter your village / town.");
      return;
    }

    // Buyer business type
    if (formData.role === "buyer" && !formData.businessType.trim()) {
      setError("Please enter your business type.");
      return;
    }

    // Password
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Terms
    if (!agreeTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    // prepare backend registration payload
    const registrationData = {
      role: formData.role,
      name,
      mobile: formData.phone,
      email: formData.email.trim(),
      village: formData.village.trim(),
      district: formData.district.trim(),
      state: formData.state,
      password: formData.password,
      termsAccepted: true,
    };

    try {
      // send registration request
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      // save safe user data returned by backend
      localStorage.setItem(
        "bf_registered_user",
        JSON.stringify(data.user),
      );

      navigate("/verification");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero/marketplace.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/45" />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="border-b border-white/20 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/bharat-fasal-logo.png"
                alt="Bharat Fasal"
                className="h-9 w-auto"
              />

              <span className="text-lg font-bold text-green-800">
                Bharat Fasal
              </span>
            </Link>
          </div>
        </header>

        {/* Main */}
        <main className="flex justify-center px-4 py-5 sm:px-6">
          <div className="w-full max-w-xl">
            {/* Heading */}
            <div className="mb-3 text-center text-white">
              <h1 className="text-xl font-bold sm:text-2xl">
                Create your Bharat Fasal account
              </h1>

              <p className="mt-1 text-xs text-white/85">
                Join the digital agricultural marketplace
              </p>
            </div>

            {/* Registration Card */}
            <div className="rounded-xl border border-white/40 bg-white/95 p-4 shadow-2xl sm:p-5">
              {/* Role Selection */}
              <div>
                <label className="text-xs font-semibold text-gray-800">
                  I am a
                </label>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = formData.role === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleChange(role.id)}
                        className={`relative rounded-lg border p-2.5 text-left transition ${isSelected
                            ? "border-green-700 bg-green-50"
                            : "border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50"
                          }`}
                      >
                        {isSelected && (
                          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-700 text-white">
                            <Check size={10} />
                          </span>
                        )}

                        <Icon
                          size={19}
                          className={
                            isSelected ? "text-green-700" : "text-gray-500"
                          }
                        />

                        <p className="mt-1 text-xs font-semibold text-gray-900">
                          {role.label}
                        </p>

                        <p className="mt-0.5 hidden text-[10px] text-gray-500 sm:block">
                          {role.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-3 space-y-2.5">
                {/* Organization - FPO / Buyer */}
                {(formData.role === "fpo" || formData.role === "buyer") && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      {formData.role === "fpo"
                        ? "FPO / Organization Name"
                        : "Business / Organization Name"}
                    </label>

                    <div className="relative">
                      <Building2
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        placeholder={
                          formData.role === "fpo"
                            ? "Enter FPO / organization name"
                            : "Enter business / organization name"
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    {formData.role === "farmer"
                      ? "Full Name"
                      : "Authorized Person Name"}
                  </label>

                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder={
                        formData.role === "farmer"
                          ? "Enter your full name"
                          : "Enter authorized person's name"
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                {/* Mobile + Email */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {/* Mobile */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Mobile Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>

                  {/* Email Optional */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Email Address{" "}
                      <span className="font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Farmer Village */}
                {formData.role === "farmer" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Village / Town
                    </label>

                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        placeholder="Enter village / town"
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                )}

                {/* District + State */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {/* District */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      District
                    </label>

                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Enter district"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      State
                    </label>

                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    >
                      <option value="">Select state</option>

                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Buyer Business Type */}
                {formData.role === "buyer" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Business Type
                    </label>

                    <div className="relative">
                      <BriefcaseBusiness
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        placeholder="Retailer, Processor, Wholesaler etc."
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                )}

                {/* Password + Confirm Password */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {/* Password */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimum 6 characters"
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-9 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-9 text-xs outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 accent-green-700"
                  />

                  <span className="text-[10px] leading-4 text-gray-600">
                    I agree to the{" "}
                    <span className="font-medium text-green-700">
                      Terms & Conditions
                    </span>{" "}
                    and{" "}
                    <span className="font-medium text-green-700">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-green-800"
                >
                  Create Account
                  <ArrowRight size={15} />
                </button>
              </form>

              {/* Login */}
              <div className="mt-3 text-center text-xs text-gray-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-green-700 hover:text-green-800"
                >
                  Login
                </button>
              </div>
            </div>

            {/* Bottom Note */}
            <p className="mt-3 text-center text-[10px] text-white/75">
              Your account will require verification before accessing verified
              marketplace activities.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegisterPage;