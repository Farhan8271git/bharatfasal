import { Sprout, Building2, ShoppingBasket } from "lucide-react";

import { useTranslation } from "react-i18next";
import ScrollReveal from "./ScrollReveal";

const UserTypes = () => {
  const { t } = useTranslation();

  const users = [
    {
      icon: Sprout,
      title: t("farmers"),
      text: t("farmers_description"),
    },
    {
      icon: Building2,
      title: t("fpos"),
      text: t("fpos_description"),
    },
    {
      icon: ShoppingBasket,
      title: t("buyers"),
      text: t("buyers_description"),
    },
  ];

  return (
    <section id="about" className="bg-[#F8FAF5] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              {t("one_platform")}
            </p>

            <h2 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {t("built_for_everyone_agriculture")}
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              {t("built_for_everyone_agriculture_description")}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {users.map((user, index) => {
            const Icon = user.icon;

            return (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="h-full rounded-xl border border-gray-200 bg-white p-8 transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                    <Icon
                      className="h-6 w-6 text-green-700"
                      strokeWidth={1.8}
                    />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {user.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {user.text}
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

export default UserTypes;
