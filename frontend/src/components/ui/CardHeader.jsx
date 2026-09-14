function CardHeader({ icon: Icon, iconClass, iconBg, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
      <div
        className={`
          w-9 h-9
          rounded-lg
          ${iconBg}
          ${iconClass}
          flex items-center justify-center
        `}
      >
        <Icon size={19} />
      </div>

      <div>
        <h2 className="font-bold text-gray-900">{title}</h2>

        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export default CardHeader;