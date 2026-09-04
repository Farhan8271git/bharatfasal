import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const slides = [
  {
    image: "/images/hero/farmer1.jpg",
    alt: "Indian farmer standing in a crop field",
  },
  {
    image: "/images/hero/farmer2.jpg",
    alt: "Farmer working in an agricultural field",
  },
  {
    image: "/images/hero/farmer3.jpg",
    alt: "Fresh agricultural produce",
  },
  {
    image: "/images/hero/farmer4.jpg",
    alt: "Farmer harvesting crops",
  },
  {
    image: "/images/hero/farmer5.jpg",
    alt: "Agricultural produce ready for market",
  },
];

const HeroSection = ({ onGetStarted }) => {
  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % slides.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % slides.length
    );
  };

  const previousSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + slides.length) % slides.length
    );
  };

  return (
    <section
      id="home"
      className="relative min-h-[620px] w-full overflow-hidden"
    >
      {/* Background Images */}

      {slides.map((slide, index) => (
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            index === currentSlide
              ? "opacity-100"
              : "opacity-0"
          }`}
        />
      ))}

      {/* Natural Overlay */}

      <div className="absolute inset-0 bg-black/30" />

      {/* Hero Content */}

      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">

          {/* Small Label */}

          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-green-100">
            {t("landing_hero_badge")}
          </p>

          {/* Heading */}

          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t("landing_hero_title_line1")}

            <span className="block text-green-100">
              {t("landing_hero_title_line2")}
            </span>
          </h1>

          {/* Description */}

          <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
            {t("landing_hero_description")}
          </p>

          {/* Buttons */}

          <div className="mt-8 flex flex-wrap gap-4">

            {/* Get Started */}

            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              {t("get_started")}

              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Explore Features */}

            <a
              href="#features"
              className="rounded-lg border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-900"
            >
              {t("explore_features")}
            </a>
          </div>
        </div>
      </div>

      {/* Previous Button */}

      <button
        type="button"
        onClick={previousSlide}
        aria-label={t("previous_image")}
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/40 bg-black/20 p-2 text-white transition hover:bg-black/40 sm:block"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next Button */}

      <button
        type="button"
        onClick={nextSlide}
        aria-label={t("next_image")}
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/40 bg-black/20 p-2 text-white transition hover:bg-black/40 sm:block"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide Indicators */}

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={t("go_to_slide", {
              number: index + 1,
            })}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-7 bg-white"
                : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;