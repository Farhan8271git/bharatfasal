import {
  Wheat,
  Search,
  Handshake,
  Truck,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    number: "01",
    icon: Wheat,
    titleKey: "how_step_1_title",
    descriptionKey: "how_step_1_description",
  },
  {
    number: "02",
    icon: Search,
    titleKey: "how_step_2_title",
    descriptionKey: "how_step_2_description",
  },
  {
    number: "03",
    icon: Handshake,
    titleKey: "how_step_3_title",
    descriptionKey: "how_step_3_description",
  },
  {
    number: "04",
    icon: Truck,
    titleKey: "how_step_4_title",
    descriptionKey: "how_step_4_description",
  },
];

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <section
      id="how-it-works"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}

        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              {t("how_it_works_label")}
            </p>

            <h2 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {t("how_it_works_title")}
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              {t("how_it_works_description")}
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}

        <div className="relative mt-14 grid gap-8 md:grid-cols-4">

          {/* Connecting Line */}

          <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gray-200 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <ScrollReveal
                key={step.number}
                delay={index * 100}
              >
                <div className="relative text-center">

                  {/* Icon */}

                  <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green-100 bg-green-50">
                    <Icon
                      className="h-6 w-6 text-green-700"
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Step Number */}

                  <p className="mt-5 text-xs font-semibold tracking-widest text-gray-400">
                    {t("step")} {step.number}
                  </p>

                  {/* Title */}

                  <h3 className="mt-2 text-lg font-semibold text-gray-900">
                    {t(step.titleKey)}
                  </h3>

                  {/* Description */}

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-600">
                    {t(step.descriptionKey)}
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

export default HowItWorks;