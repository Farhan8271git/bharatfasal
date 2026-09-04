import {
  ChartNoAxesCombined,
  BadgeCheck,
  Wheat,
  Truck,
  CreditCard,
  ClipboardCheck,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: ChartNoAxesCombined,
    titleKey: "feature_market_prices_title",
    descriptionKey: "feature_market_prices_description",
  },
  {
    icon: BadgeCheck,
    titleKey: "feature_verified_buyers_title",
    descriptionKey:
      "feature_verified_buyers_description",
  },
  {
    icon: Wheat,
    titleKey: "feature_list_produce_title",
    descriptionKey:
      "feature_list_produce_description",
  },
  {
    icon: Truck,
    titleKey: "feature_transport_title",
    descriptionKey:
      "feature_transport_description",
  },
  {
    icon: CreditCard,
    titleKey: "feature_payments_title",
    descriptionKey:
      "feature_payments_description",
  },
  {
    icon: ClipboardCheck,
    titleKey: "feature_quality_title",
    descriptionKey:
      "feature_quality_description",
  },
];

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="features"
      className="bg-[#F8FAF5] py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}

        <ScrollReveal>
          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              {t("features_label")}
            </p>

            <h2 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {t("features_title")}
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              {t("features_description")}
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Cards */}

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <ScrollReveal
                key={feature.titleKey}
                delay={index * 80}
              >
                <div className="h-full rounded-xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md">

                  {/* Icon */}

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">
                    <Icon
                      className="h-5 w-5 text-green-700"
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Title */}

                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {t(feature.titleKey)}
                  </h3>

                  {/* Description */}

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;