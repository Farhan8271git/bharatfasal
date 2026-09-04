import { ShieldCheck, TrendingUp, Users, CircleCheck } from "lucide-react";

import { useTranslation } from "react-i18next";
import ScrollReveal from "./ScrollReveal";

const WhyBharatFasal = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: ShieldCheck,
      title: t("more_transparent"),
      text: t("more_transparent_text"),
    },
    {
      icon: TrendingUp,
      title: t("better_market_access"),
      text: t("better_market_access_text"),
    },
    {
      icon: Users,
      title: t("direct_connections"),
      text: t("direct_connections_text"),
    },
    {
      icon: CircleCheck,
      title: t("simple_organized"),
      text: t("simple_organized_text"),
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                {t("why_bharat_fasal")}
              </p>

              <h2 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                {t("making_agricultural_trade_simpler")}
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
                {t("why_bharat_fasal_description")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="h-full rounded-xl border border-gray-200 bg-[#F8FAF5] p-6 transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">
                      <Icon
                        className="h-5 w-5 text-green-700"
                        strokeWidth={1.8}
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-gray-900">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {benefit.text}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBharatFasal;
