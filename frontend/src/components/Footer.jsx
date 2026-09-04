import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-12 bg-[#1f2b3a] text-white">
      {/* Green top border */}
      <div className="h-1 bg-green-500" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        {/* ================================
            MAIN FOOTER
            ================================ */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-10
            lg:gap-16
            py-12
          "
        >
          {/* ================================
              BRAND
              ================================ */}
          <div>
            <div
              className="
                flex
                items-center
                gap-3
                mb-5
              "
            >
              <img
                src="/images/bharat-fasal-logo.png"
                alt="Bharat Fasal"
                className="
                  w-11
                  h-11
                  sm:w-12
                  sm:h-12
                  object-contain
                "
              />

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  tracking-tight
                "
              >
                BHARAT FASAL
              </h2>
            </div>

            <p
              className="
                text-gray-400
                text-sm
                sm:text-base
                leading-relaxed
                max-w-xs
              "
            >
              Better Markets. Better Decisions. Better Returns.
            </p>
          </div>

          {/* ================================
              PRODUCT
              ================================ */}
          <div>
            <h3
              className="
                text-sm
                font-bold
                tracking-wider
                uppercase
                text-white
                mb-5
              "
            >
              Product
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/market-intelligence")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                Market Intelligence
              </button>

              <button
                onClick={() => navigate("/buyers")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                Marketplace
              </button>

              <button
                onClick={() => navigate("/logistics")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                Logistics
              </button>

              <button
                onClick={() => navigate("/payments")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                Payments
              </button>
            </div>
          </div>

          {/* ================================
              COMPANY
              ================================ */}
          <div>
            <h3
              className="
                text-sm
                font-bold
                tracking-wider
                uppercase
                text-white
                mb-5
              "
            >
              Company
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/about")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                About
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                Contact
              </button>

              <button
                onClick={() => navigate("/help")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                Help Center
              </button>
            </div>
          </div>

          {/* ================================
              LEGAL
              ================================ */}
          <div>
            <h3
              className="
                text-sm
                font-bold
                tracking-wider
                uppercase
                text-white
                mb-5
              "
            >
              Legal
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/privacy")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                Privacy
              </button>

              <button
                onClick={() => navigate("/terms")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                Terms
              </button>

              <button
                onClick={() => navigate("/grievance")}
                className="
                  block
                  text-sm
                  sm:text-base
                  text-gray-400
                  hover:text-green-400
                  transition-colors
                "
              >
                Grievance
              </button>
            </div>
          </div>
        </div>

        {/* ================================
            BOTTOM
            ================================ */}
        <div
          className="
            border-t
            border-gray-700
            py-6
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-3
          "
        >
          <p
            className="
              text-sm
              text-gray-400
              text-center
              sm:text-left
            "
          >
            © 2026 Bharat Fasal. All rights reserved.
          </p>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Empowering farmers with better markets 🌾
          </p>
        </div>
      </div>
    </footer>
  );
}
