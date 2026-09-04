import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import ScrollReveal from "./ScrollReveal";

const CTASection = ({ onGetStarted }) => {
  const { t } = useTranslation();

  return (
    <section className="bg-[#F0FDF4] py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <ScrollReveal>
          {/* Small Label */}
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            {t("landing_cta_label")}
          </p>

          {/* Heading */}
          <h2 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {t("landing_cta_title")}
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600">
            {t("landing_cta_description")}
          </p>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onGetStarted}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-green-700 px-7 py-3 font-semibold text-white transition duration-200 hover:bg-green-800"
          >
            {t("get_started")}

            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
