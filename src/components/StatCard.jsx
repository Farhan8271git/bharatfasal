export default function StatCard({
  image,
  label,
  value,
  color = 'primary',
}) {
  const borderColors = {
    primary: 'border-l-primary-600',
    yellow: 'border-l-yellow-500',
    blue: 'border-l-blue-500',
    red: 'border-l-red-500',
  }

  return (
    <div
      className={`
        bg-white
        border border-gray-200
        border-l-4
        ${borderColors[color]}
        rounded-2xl
        p-4
        sm:p-5
        flex
        items-center
        justify-between
        gap-4
        shadow-sm
        hover:shadow-md
        transition-shadow
      `}
    >
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">
          {label}
        </p>

        <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
          {value}
        </p>
      </div>

      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}