import { useEffect, useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MarketPreview = () => {
  const { t } = useTranslation();

  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMarketPrices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/mandi-prices?limit=4",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch mandi prices"
        );
      }

      const data = await response.json();

      if (!Array.isArray(data?.records)) {
        throw new Error(
          "Invalid mandi data received"
        );
      }

      const records = data.records
        .filter(
          (item) =>
            item.commodity &&
            item.market &&
            item.modalPrice !== null &&
            item.modalPrice !== undefined
        )
        .slice(0, 4);

      setMarketPrices(records);
    } catch (err) {
      console.error("Mandi price error:", err);

      setError(
        t("market_prices_unavailable")
      );

      setMarketPrices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  // FORMAT PRICE

  const formatPrice = (price) => {
    const number = Number(price);

    if (!Number.isFinite(number)) {
      return "—";
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  // FORMAT ARRIVAL DATE

  const formatDate = (date) => {
    if (!date) {
      return t("date_unavailable");
    }

    const dateString = String(date).trim();

    // Government API format: DD/MM/YYYY

    const parts = dateString.split("/");

    if (parts.length === 3) {
      const [day, month, year] = parts;

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthIndex = Number(month) - 1;

      if (
        day &&
        year &&
        monthIndex >= 0 &&
        monthIndex < 12
      ) {
        return `${day} ${months[monthIndex]} ${year}`;
      }
    }

    return dateString;
  };

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADING */}

        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-700">
              {t("market_information")}
            </p>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("todays_mandi_prices")}
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              {t("market_preview_description")}
            </p>
          </div>

          <Link
            to="/prices"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
          >
            {t("view_all_prices")}

            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-center px-6 py-16">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <RefreshCw className="h-4 w-4 animate-spin" />

                {t("loading_mandi_prices")}
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
            <p className="text-sm text-gray-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchMarketPrices}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              <RefreshCw className="h-4 w-4" />

              {t("try_again")}
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          marketPrices.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
              <p className="text-sm text-gray-600">
                {t("no_mandi_data")}
              </p>
            </div>
          )}

        {/* PRICE TABLE */}

        {!loading &&
          !error &&
          marketPrices.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

              {/* Desktop Header */}

              <div className="hidden grid-cols-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 sm:grid">
                <span>{t("commodity")}</span>
                <span>{t("market")}</span>
                <span>{t("price_per_quintal")}</span>
                <span>{t("market_range")}</span>
              </div>

              {/* Rows */}

              {marketPrices.map((item, index) => (
                <div
                  key={`${item.commodity}-${item.market}-${index}`}
                  className="grid gap-3 border-b border-gray-100 px-5 py-5 last:border-0 sm:grid-cols-4 sm:items-center sm:px-6"
                >

                  {/* Commodity */}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.commodity}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.variety ||
                        t("market_reported")}
                    </p>

                    <p className="text-xs text-gray-500 sm:hidden">
                      {item.market}
                    </p>
                  </div>

                  {/* Market */}

                  <p className="hidden text-sm text-gray-600 sm:block">
                    {item.market}
                  </p>

                  {/* Price */}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.modalPrice)}

                      <span className="ml-1 text-xs font-normal text-gray-500">
                        /qtl
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(item.arrivalDate)}
                    </p>
                  </div>

                  {/* Range */}

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {formatPrice(item.minPrice)}
                      {" – "}
                      {formatPrice(item.maxPrice)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {t("min_max")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* SOURCE */}

        {!loading &&
          !error &&
          marketPrices.length > 0 && (
            <p className="mt-4 text-center text-xs text-gray-400">
              {t("mandi_source_note")}
            </p>
          )}
      </div>
    </section>
  );
};

export default MarketPreview;