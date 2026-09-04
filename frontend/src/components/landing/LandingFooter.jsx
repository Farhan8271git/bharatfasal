const LandingFooter = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/images/bharat-fasal-logo.png"
                alt="Bharat Fasal"
                className="h-9 w-auto"
              />

              <span className="text-xl font-bold text-white">
                Bharat Fasal
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Connecting farmers, FPOs and buyers through better market
              information and digital commerce.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">
              Quick Links
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <a
                href="#home"
                className="block transition-colors hover:text-white"
              >
                Home
              </a>

              <a
                href="#features"
                className="block transition-colors hover:text-white"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="block transition-colors hover:text-white"
              >
                How It Works
              </a>

              <a
                href="#about"
                className="block transition-colors hover:text-white"
              >
                About
              </a>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <h3 className="font-semibold text-white">
              Bharat Fasal
            </h3>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Better markets. Better decisions.
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              A digital platform connecting the agricultural marketplace.
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Bharat Fasal. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;