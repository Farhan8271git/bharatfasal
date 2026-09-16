import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Newspaper,
  Package,
  ArrowRight,
  Users,
  WalletCards,
} from "lucide-react";

import MarketTicker from "../components/MarketTicker";
import StatCard from "../components/StatCard";
import PriceCard from "../components/PriceCard";

import { getGreeting, formatCurrency } from "../utils/formatters";
import { getMyLots } from "../api/lots.api";
import { getSellerPurchaseRequests } from "../api/purchaseRequests.api";

export default function DashboardPage({ user }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [topPrices, setTopPrices] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [activeLots, setActiveLots] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [isLoadingLots, setIsLoadingLots] = useState(true);

  const previousPricesRef = useRef({});

  const currentUser = user;
  const greeting = getGreeting();

  const currentLang = (i18n.language || "en").split("-")[0];

  const dashboardText = {
    en: {
      farmer: "Farmer",
      heroTitle1: "Your crop deserves",
      heroTitle2: "the right market.",
      heroDescription:
        "Check today's prices, discover better buyers and make a smarter selling decision.",
      bestPrice: "Today's Best Price",
      activeLots: "Active Lots",
      paymentsPending: "Payments Pending",
      recommendedBuyers: "Recommended Buyers",
      quickActivities: "Quickly access your farming activities",
      newLot: "New Lot",
      findBuyer: "Find Buyer",
      complaint: "Complaint",
      trackPayment: "Track Payment",
      yourActiveLots: "Your Active Lots",
      monitorLots: "Monitor your currently listed crops",
      viewAll: "View All",
      lotId: "Lot ID",
      buyerInterested: "buyer interested",
      buyersInterested: "buyers interested",
      viewLot: "View Lot",
      latestMandi: "Latest mandi prices from government data",
      loadingPrices: "Loading latest mandi prices...",
      latestChanges: "Latest changes in mandi prices",
      latestUpdates: "Latest updates affecting farmers and markets",
      governmentPolicy: "Government Policy",
      marketReform: "Market Reform",
      storageLogistics: "Storage & Logistics",
      today: "Today",
      yesterday: "Yesterday",
      news1:
        "Government announces 5% increase in MSP for Kharif 2026-27 season",
      news2:
        "APMC reforms: Direct selling to processors now allowed in 12 states",
      news3: "Cold storage capacity increased by 20% in Maharashtra",
      sellConfidence: "Sell with greater confidence",
      trackActivity:
        "Track orders, payments and buyer activity from one place.",
      viewPayments: "View Payments",
      quintals: "Quintals",
      grade: "Grade",
      premium: "Premium",
      active: "Active",
      wheat: "Wheat",
      rice: "Rice",
      maize: "Maize",
      alert1: "Tomato prices surged 8.5% at Kolar Mandi",
      alert2: "Onion prices dropped 5.2% at Lasalgaon",
      alert3: "Soybean crossed MSP at Indore Mandi",
      alert4: "Wheat prices stable at Karnal Mandi",
      hours2: "2 hours ago",
      hours4: "4 hours ago",
      hours6: "6 hours ago",
      day1: "1 day ago",
      loadingLots: "Loading your active lots...",
      noLots: "No active lots found.",
      noPriceChanges: "No recent mandi price changes available.",
      noNews: "Live market news is not available yet.",
      newsSource:
        "Current mandi prices are available from government market data.",
    },

    hi: {
      farmer: "किसान",
      heroTitle1: "आपकी फसल की हकदार है",
      heroTitle2: "सही बाज़ार की।",
      heroDescription:
        "आज के भाव देखें, बेहतर खरीदार खोजें और समझदारी से बिक्री का निर्णय लें।",
      bestPrice: "आज का सबसे अच्छा भाव",
      activeLots: "सक्रिय लॉट्स",
      paymentsPending: "लंबित भुगतान",
      recommendedBuyers: "अनुशंसित खरीदार",
      quickActivities: "अपनी खेती से जुड़ी गतिविधियों तक जल्दी पहुँचें",
      newLot: "नई लॉट",
      findBuyer: "खरीदार खोजें",
      complaint: "शिकायत",
      trackPayment: "भुगतान ट्रैक करें",
      yourActiveLots: "आपकी सक्रिय लॉट्स",
      monitorLots: "अपनी वर्तमान में सूचीबद्ध फसलों पर नज़र रखें",
      viewAll: "सभी देखें",
      lotId: "लॉट आईडी",
      buyerInterested: "खरीदार रुचि रखता है",
      buyersInterested: "खरीदार रुचि रखते हैं",
      viewLot: "लॉट देखें",
      latestMandi: "सरकारी डेटा से नवीनतम मंडी भाव",
      loadingPrices: "नवीनतम मंडी भाव लोड हो रहे हैं...",
      latestChanges: "मंडी भाव में नवीनतम बदलाव",
      latestUpdates: "किसानों और बाजारों को प्रभावित करने वाले नवीनतम अपडेट",
      governmentPolicy: "सरकारी नीति",
      marketReform: "बाजार सुधार",
      storageLogistics: "भंडारण और लॉजिस्टिक्स",
      today: "आज",
      yesterday: "कल",
      sellConfidence: "अधिक भरोसे के साथ बेचें",
      trackActivity:
        "एक ही जगह से ऑर्डर, भुगतान और खरीदार की गतिविधि ट्रैक करें।",
      viewPayments: "भुगतान देखें",
      quintals: "क्विंटल",
      grade: "ग्रेड",
      premium: "प्रीमियम",
      active: "सक्रिय",
      wheat: "गेहूं",
      rice: "चावल",
      maize: "मक्का",
      alert1: "कोलार मंडी में टमाटर के भाव 8.5% बढ़े",
      alert2: "लासलगांव में प्याज के भाव 5.2% गिरे",
      alert3: "इंदौर मंडी में सोयाबीन का भाव MSP से ऊपर पहुंचा",
      alert4: "करनाल मंडी में गेहूं के भाव स्थिर",
      hours2: "2 घंटे पहले",
      hours4: "4 घंटे पहले",
      hours6: "6 घंटे पहले",
      day1: "1 दिन पहले",
      loadingLots: "आपकी सक्रिय लॉट्स लोड हो रही हैं...",
      noLots: "कोई सक्रिय लॉट नहीं मिली।",
      noPriceChanges: "मंडी भाव में हाल की कोई बदलाव उपलब्ध नहीं है।",
      noNews: "लाइव बाजार समाचार अभी उपलब्ध नहीं है।",
      newsSource:
        "वर्तमान मंडी भाव सरकारी बाजार डेटा से उपलब्ध हैं।",
    },

    ur: {
      farmer: "کسان",
      heroTitle1: "آپ کی فصل کی مستحق ہے",
      heroTitle2: "صحیح بازار کی۔",
      heroDescription:
        "آج کی قیمتیں دیکھیں، بہتر خریدار تلاش کریں اور سمجھداری سے فروخت کا فیصلہ کریں۔",
      bestPrice: "آج کی بہترین قیمت",
      activeLots: "فعال لاٹس",
      paymentsPending: "زیر التوا ادائیگیاں",
      recommendedBuyers: "تجویز کردہ خریدار",
      quickActivities: "اپنی زرعی سرگرمیوں تک فوری رسائی حاصل کریں",
      newLot: "نئی لاٹ",
      findBuyer: "خریدار تلاش کریں",
      complaint: "شکایت",
      trackPayment: "ادائیگی ٹریک کریں",
      yourActiveLots: "آپ کی فعال لاٹس",
      monitorLots: "اپنی موجودہ درج فصلوں پر نظر رکھیں",
      viewAll: "سب دیکھیں",
      lotId: "لاٹ آئی ڈی",
      buyerInterested: "خریدار دلچسپی رکھتا ہے",
      buyersInterested: "خریدار دلچسپی رکھتے ہیں",
      viewLot: "لاٹ دیکھیں",
      latestMandi: "سرکاری ڈیٹا سے تازہ ترین منڈی قیمتیں",
      loadingPrices: "تازہ ترین منڈی قیمتیں لوڈ ہو رہی ہیں...",
      latestChanges: "منڈی قیمتوں میں تازہ ترین تبدیلیاں",
      latestUpdates: "کسانوں اور بازاروں کو متاثر کرنے والی تازہ ترین معلومات",
      governmentPolicy: "حکومتی پالیسی",
      marketReform: "بازار اصلاحات",
      storageLogistics: "ذخیرہ اور لاجسٹکس",
      today: "آج",
      yesterday: "کل",
      sellConfidence: "زیادہ اعتماد کے ساتھ فروخت کریں",
      trackActivity:
        "ایک ہی جگہ سے آرڈرز، ادائیگیوں اور خریدار کی سرگرمی کو ٹریک کریں۔",
      viewPayments: "ادائیگیاں دیکھیں",
      quintals: "کوئنٹل",
      grade: "گریڈ",
      premium: "پریمیم",
      active: "فعال",
      wheat: "گندم",
      rice: "چاول",
      maize: "مکئی",
      alert1: "کولار منڈی میں ٹماٹر کی قیمتیں 8.5 فیصد بڑھ گئیں",
      alert2: "لاسالگاؤں میں پیاز کی قیمتیں 5.2 فیصد کم ہوئیں",
      alert3: "اندور منڈی میں سویا بین کی قیمت MSP سے اوپر پہنچ گئی",
      alert4: "کرنال منڈی میں گندم کی قیمتیں مستحکم",
      hours2: "2 گھنٹے پہلے",
      hours4: "4 گھنٹے پہلے",
      hours6: "6 گھنٹے پہلے",
      day1: "1 دن پہلے",
      loadingLots: "آپ کی فعال لاٹس لوڈ ہو رہی ہیں...",
      noLots: "کوئی فعال لاٹ نہیں ملی۔",
      noPriceChanges: "منڈی قیمتوں میں حالیہ تبدیلیاں دستیاب نہیں ہیں۔",
      noNews: "لائیو مارکیٹ نیوز ابھی دستیاب نہیں ہے۔",
      newsSource:
        "موجودہ منڈی قیمتیں سرکاری مارکیٹ ڈیٹا سے دستیاب ہیں۔",
    },

    hinglish: {
      farmer: "Kisan",
      heroTitle1: "Aapki crop deserve karti hai",
      heroTitle2: "right market.",
      heroDescription:
        "Aaj ke prices check karein, better buyers discover karein aur smarter selling decision lein.",
      bestPrice: "Aaj ka Best Price",
      activeLots: "Active Lots",
      paymentsPending: "Payments Pending",
      recommendedBuyers: "Recommended Buyers",
      quickActivities: "Apni farming activities ko quickly access karein",
      newLot: "New Lot",
      findBuyer: "Buyer Dhundhein",
      complaint: "Complaint",
      trackPayment: "Payment Track Karein",
      yourActiveLots: "Aapki Active Lots",
      monitorLots: "Apni listed crops ko monitor karein",
      viewAll: "Sab Dekhein",
      lotId: "Lot ID",
      buyerInterested: "buyer interested",
      buyersInterested: "buyers interested",
      viewLot: "Lot Dekhein",
      latestMandi: "Government data se latest mandi prices",
      loadingPrices: "Latest mandi prices load ho rahe hain...",
      latestChanges: "Mandi prices mein latest changes",
      latestUpdates:
        "Farmers aur markets ko affect karne wale latest updates",
      governmentPolicy: "Government Policy",
      marketReform: "Market Reform",
      storageLogistics: "Storage & Logistics",
      today: "Today",
      yesterday: "Yesterday",
      sellConfidence: "Zyada confidence ke saath sell karein",
      trackActivity:
        "Orders, payments aur buyer activity ko ek hi jagah se track karein.",
      viewPayments: "Payments Dekhein",
      quintals: "Quintals",
      grade: "Grade",
      premium: "Premium",
      active: "Active",
      wheat: "Wheat",
      rice: "Rice",
      maize: "Maize",
      alert1: "Kolar Mandi mein tomato prices 8.5% badhe",
      alert2: "Lasalgaon mein onion prices 5.2% gire",
      alert3: "Indore Mandi mein soybean MSP se upar gaya",
      alert4: "Karnal Mandi mein wheat prices stable hain",
      hours2: "2 hours pehle",
      hours4: "4 hours pehle",
      hours6: "6 hours pehle",
      day1: "1 din pehle",
      loadingLots: "Aapki active lots load ho rahi hain...",
      noLots: "Koi active lot nahi mili.",
      noPriceChanges: "Mandi prices mein recent changes available nahi hain.",
      noNews: "Live market news abhi available nahi hai.",
      newsSource:
        "Current mandi prices government market data se available hain.",
    },
  };

  const d = dashboardText[currentLang] || dashboardText.en;

  const cropText = {
    Wheat: d.wheat,
    Rice: d.rice,
    Maize: d.maize,
  };

  const formatLotQuantity = (quantity) =>
    `${Number(quantity || 0).toLocaleString("en-IN")} ${d.quintals}`;

  const translateGrade = (value) => {
    if (value === "Premium") return d.premium;
    if (value === "Grade A") return `${d.grade} A`;
    return value;
  };

  const getBuyerInterest = (lotId) => {
    const count = sellerRequests.filter((request) => {
      const requestLotId =
        typeof request.lotId === "object"
          ? request.lotId?._id
          : request.lotId;

      return requestLotId === lotId;
    }).length;

    if (count === 1) {
      return `1 ${d.buyerInterested}`;
    }

    return `${count} ${d.buyersInterested}`;
  };

  const getBestMandiPrice = () => {
    if (!topPrices.length) {
      return null;
    }

    const prices = topPrices
      .map((price) => Number(price.modal_price || 0))
      .filter((price) => price > 0);

    if (!prices.length) {
      return null;
    }

    return Math.max(...prices);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingLots(true);

      try {
        const [lotsResponse, requestsResponse] = await Promise.all([
          getMyLots({
            status: "listed",
            page: 1,
            limit: 20,
          }),
          getSellerPurchaseRequests({
            status: "pending",
            page: 1,
            limit: 100,
          }),
        ]);

        setActiveLots(
          Array.isArray(lotsResponse?.lots)
            ? lotsResponse.lots
            : []
        );

        setSellerRequests(
          Array.isArray(requestsResponse?.requests)
            ? requestsResponse.requests
            : []
        );
      } catch (error) {
        console.error("Dashboard data fetch error:", error);

        setActiveLots([]);
        setSellerRequests([]);
      } finally {
        setIsLoadingLots(false);
      }
    };

    if (
      currentUser?.role === "farmer" ||
      currentUser?.role === "fpo"
    ) {
      fetchDashboardData();
    } else {
      setActiveLots([]);
      setSellerRequests([]);
      setIsLoadingLots(false);
    }
  }, [currentUser?.role]);

  useEffect(() => {
    const fetchMandiPrices = async () => {
      try {
        const response = await fetch("/api/mandi-prices");

        if (!response.ok) {
          throw new Error(`Mandi API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.records || !Array.isArray(data.records)) {
          console.warn("No mandi records found");
          setTopPrices([]);
          setPriceAlerts([]);
          return;
        }

        const records = data.records
          .map((item) => {
            const commodity =
              item.commodity || item.Commodity || "";

            const market =
              item.market || item.Market || "";

            const state =
              item.state || item.State || "";

            const minPrice = Number(
              item.min_price || item.Min_Price || 0
            );

            const maxPrice = Number(
              item.max_price || item.Max_Price || 0
            );

            const modalPrice = Number(
              item.modal_price || item.Modal_Price || 0
            );

            return {
              ...item,
              commodity,
              market,
              state,
              min_price: minPrice,
              max_price: maxPrice,
              modal_price: modalPrice,
            };
          })
          .filter(
            (item) =>
              item.commodity &&
              item.modal_price > 0
          );

        const updatedRecords = records.map((item) => {
          const key =
            `${item.commodity}-${item.market}`.toLowerCase();

          const previousPrice =
            previousPricesRef.current[key];

          let change = 0;

          if (previousPrice && previousPrice > 0) {
            change =
              ((item.modal_price - previousPrice) /
                previousPrice) *
              100;
          }

          return {
            ...item,
            change,
          };
        });

        const currentPrices = {};

        updatedRecords.forEach((item) => {
          const key =
            `${item.commodity}-${item.market}`.toLowerCase();

          currentPrices[key] = item.modal_price;
        });

        previousPricesRef.current = currentPrices;

        setTopPrices(updatedRecords.slice(0, 6));

        const alerts = updatedRecords
          .filter((item) => Math.abs(item.change) > 0)
          .sort(
            (a, b) =>
              Math.abs(b.change) -
              Math.abs(a.change)
          )
          .slice(0, 4);

        setPriceAlerts(alerts);
      } catch (error) {
        console.error("Mandi price fetch error:", error);
      }
    };

    fetchMandiPrices();

    const interval = setInterval(
      fetchMandiPrices,
      5 * 60 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  const quickActions = [
    {
      image: "/images/actions/new-lot.jpg",
      label: d.newLot,
      path: "/lots",
    },
    {
      image: "/images/actions/find-buyer.jpg",
      label: d.findBuyer,
      path: "/buyers",
    },
    {
      image: "/images/actions/customer-complaint.jpg",
      label: d.complaint,
      path: "/disputes",
    },
    {
      image: "/images/actions/payment.jpg",
      label: d.trackPayment,
      path: "/payments",
    },
  ];

  const bestMandiPrice = getBestMandiPrice();

  return (
    <div className="w-full">
      <section
        className="
          relative
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-primary-100
          bg-primary-50
          shadow-sm
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1.1fr_0.9fr]
            min-h-[280px]
            sm:min-h-[300px]
            lg:min-h-[320px]
          "
        >
          <div
            className="
              flex
              items-center
              px-6
              py-8
              sm:px-8
              lg:px-10
              xl:px-12
            "
          >
            <div className="max-w-2xl">
              <p className="text-base sm:text-lg font-semibold text-primary-700">
                {t(greeting)}, {currentUser?.name || d.farmer}
              </p>

              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin
                  size={17}
                  strokeWidth={2}
                  className="text-primary-600"
                />

                <span className="text-sm sm:text-base font-medium">
                  {currentUser?.location || "India"}
                </span>
              </div>

              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-extrabold
                  leading-tight
                  tracking-tight
                  text-gray-900
                  mt-6
                "
              >
                {d.heroTitle1}
                <br />
                <span className="text-primary-700">
                  {d.heroTitle2}
                </span>
              </h2>

              <p
                className="
                  text-sm
                  sm:text-base
                  text-gray-600
                  mt-4
                  max-w-xl
                  leading-relaxed
                "
              >
                {d.heroDescription}
              </p>
            </div>
          </div>

          <div className="relative min-h-[220px] lg:min-h-full overflow-hidden">
            <img
              src="/images/hero/farmer-dash.jpg"
              alt="Farmer working in agricultural field"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.28) 20%, rgba(0,0,0,0.58) 34%, rgba(0,0,0,0.82) 48%, #000 62%)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.28) 20%, rgba(0,0,0,0.58) 34%, rgba(0,0,0,0.82) 48%, #000 62%)",
              }}
            />
          </div>
        </div>
      </section>

      <div
        className="
          w-full
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          space-y-7
          pb-10
        "
      >
        <MarketTicker />

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-3
          "
        >
          <StatCard
            image="/images/stats/best-price.jpg"
            label={d.bestPrice}
            value={
              bestMandiPrice
                ? formatCurrency(bestMandiPrice)
                : "—"
            }
            color="primary"
          />

          <StatCard
            image="/images/stats/active-lots.jpg"
            label={d.activeLots}
            value={String(activeLots.length)}
            color="blue"
          />

          <StatCard
            image="/images/stats/pending-payment.jpg"
            label={d.paymentsPending}
            value="—"
            color="yellow"
          />

          <StatCard
            image="/images/stats/nearby-buyer.jpg"
            label={d.recommendedBuyers}
            value="—"
            color="primary"
          />
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("quick_actions")}
              </h3>

              <p className="text-sm text-gray-500 mt-0.5">
                {d.quickActivities}
              </p>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-4
              gap-4
            "
          >
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="
                  group
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  overflow-hidden
                  text-left
                  shadow-sm
                  hover:shadow-lg
                  hover:border-primary-300
                  hover:-translate-y-0.5
                  transition-all
                  duration-200
                "
              >
                <div
                  className="
                    h-20
                    sm:h-24
                    w-full
                    overflow-hidden
                    bg-gray-100
                  "
                >
                  <img
                    src={action.image}
                    alt={action.label}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="px-4 py-3">
                  <span
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    {action.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div
            className="
              flex
              items-center
              justify-between
              mb-3
            "
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {d.yourActiveLots}
              </h3>

              <p className="text-sm text-gray-500 mt-0.5">
                {d.monitorLots}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/lots")}
              className="
                inline-flex
                items-center
                gap-1
                text-primary-600
                text-sm
                font-semibold
                hover:text-primary-700
              "
            >
              {d.viewAll}
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="space-y-3">
            {isLoadingLots ? (
              <div
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  p-6
                  text-center
                  text-sm
                  text-gray-500
                "
              >
                {d.loadingLots}
              </div>
            ) : activeLots.length === 0 ? (
              <div
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  p-6
                  text-center
                  text-sm
                  text-gray-500
                "
              >
                {d.noLots}
              </div>
            ) : (
              activeLots.map((lot) => (
                <div
                  key={lot._id}
                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    p-4
                    hover:shadow-md
                    transition-shadow
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                      gap-4
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="
                          w-11
                          h-11
                          rounded-xl
                          bg-green-50
                          border
                          border-green-100
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                        "
                      >
                        <Package
                          size={21}
                          className="text-green-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-gray-900">
                            {cropText[lot.commodity] ||
                              lot.commodity}
                          </h4>

                          <span
                            className="
                              px-2
                              py-1
                              rounded-md
                              bg-green-50
                              text-green-700
                              text-[11px]
                              font-semibold
                            "
                          >
                            {lot.status === "listed"
                              ? d.active
                              : lot.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {d.lotId}: {lot._id}
                        </p>

                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-4
                            gap-y-1
                            mt-2
                            text-sm
                            text-gray-600
                          "
                        >
                          <span>
                            {formatLotQuantity(
                              lot.quantity
                            )}
                          </span>

                          <span>
                            {translateGrade(lot.grade)}
                          </span>

                          <span>
                            ₹
                            {Number(
                              lot.expectedPrice || 0
                            ).toLocaleString("en-IN")}
                            /q
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        gap-3
                        lg:min-w-[360px]
                        lg:justify-end
                      "
                    >
                      <div
                        className="
                          text-sm
                          text-gray-600
                          sm:text-right
                        "
                      >
                        <p className="flex items-center gap-1.5 sm:justify-end">
                          <MapPin size={14} />
                          {lot.pickupLocation}
                        </p>

                        <p
                          className="
                            flex
                            items-center
                            gap-1.5
                            mt-1
                            text-green-700
                            font-medium
                            sm:justify-end
                          "
                        >
                          <Users size={14} />
                          {getBuyerInterest(lot._id)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate("/lots")}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1.5
                          px-4
                          py-2.5
                          rounded-xl
                          border
                          border-gray-200
                          bg-gray-50
                          text-sm
                          font-semibold
                          text-gray-700
                          hover:bg-gray-100
                          transition-colors
                        "
                      >
                        {d.viewLot}
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div
            className="
              flex
              items-center
              justify-between
              mb-3
            "
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("top_prices_today")}
              </h3>

              <p className="text-sm text-gray-500 mt-0.5">
                {d.latestMandi}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/prices")}
              className="
                text-primary-600
                text-sm
                font-semibold
                hover:text-primary-700
              "
            >
              {t("mandi_prices")} →
            </button>
          </div>

          {topPrices.length > 0 ? (
            <div
              className="
                flex
                gap-3
                overflow-x-auto
                pb-2
                -mx-4
                px-4
                snap-x
              "
            >
              {topPrices.map((price, index) => (
                <div
                  key={`${price.commodity}-${price.market}-${index}`}
                  className="
                    snap-start
                    flex-shrink-0
                  "
                >
                  <PriceCard price={price} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                px-5
                py-8
                text-center
                text-sm
                text-gray-500
              "
            >
              {d.loadingPrices}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900">
              {t("price_alerts")}
            </h3>

            <p className="text-sm text-gray-500 mt-0.5">
              {d.latestChanges}
            </p>
          </div>

          <div className="space-y-2">
            {priceAlerts.length > 0 ? (
              priceAlerts.map((alert, index) => (
                <div
                  key={`${alert.commodity}-${alert.market}-${index}`}
                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    shadow-sm
                    hover:shadow-md
                    transition-shadow
                  "
                >
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-gray-50
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    {alert.change > 0 ? (
                      <TrendingUp
                        size={20}
                        className="text-green-600"
                      />
                    ) : alert.change < 0 ? (
                      <TrendingDown
                        size={20}
                        className="text-red-500"
                      />
                    ) : (
                      <Minus
                        size={20}
                        className="text-gray-500"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {alert.commodity} at {alert.market}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Modal price: ₹
                      {Number(
                        alert.modal_price
                      ).toLocaleString("en-IN")}
                      {" · "}
                      {alert.change > 0 ? "+" : ""}
                      {Number(alert.change).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  px-5
                  py-6
                  text-center
                  text-sm
                  text-gray-500
                "
              >
                {d.noPriceChanges}
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900">
              {t("market_news")}
            </h3>

            <p className="text-sm text-gray-500 mt-0.5">
              {d.latestUpdates}
            </p>
          </div>

          <div
            className="
              bg-primary-50
              border
              border-primary-200
              rounded-2xl
              p-4
            "
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-white
                    flex
                    items-center
                    justify-center
                    shrink-0
                    border
                    border-primary-100
                  "
                >
                  <Newspaper
                    size={18}
                    className="text-primary-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {d.noNews}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {d.newsSource}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            px-5
            py-4
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-green-50
                  border
                  border-green-100
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <WalletCards
                  size={19}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {d.sellConfidence}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {d.trackActivity}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/payments")}
              className="
                inline-flex
                items-center
                justify-center
                gap-1.5
                px-4
                py-2.5
                rounded-xl
                bg-gray-900
                text-white
                text-sm
                font-semibold
                hover:bg-gray-800
                transition-colors
              "
            >
              {d.viewPayments}
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}