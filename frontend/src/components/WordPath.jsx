export default function WordPath({ path }) {
  if (!path.length) {
    return <div className="text-center text-gray-400 py-4 text-sm sm:text-base">No moves yet</div>
  }

  return (
    <div className="space-y-2 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
      {path.map((word, index) => (
        <div
          key={`${word}-${index}`}
          className="flex items-center transform transition-all duration-300 hover:scale-102"
          style={{
            opacity: 0,
            animation: `fadeSlideIn 300ms ease-out ${index * 100}ms forwards`,
          }}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
            <span className="text-xs sm:text-sm">{index}</span>
          </div>
          <div
            className={`flex-1 p-2 sm:p-3 rounded text-sm sm:text-base ${
              index === 0
                ? "bg-green-900/30 border border-green-500"
                : index === path.length - 1 && path.length > 1
                  ? "bg-purple-900/30 border border-purple-500"
                  : "bg-gray-700"
            }`}
          >
            <span
              className={`font-mono ${
                index === 0
                  ? "text-green-400"
                  : index === path.length - 1 && path.length > 1
                    ? "text-purple-400"
                    : "text-white"
              }`}
            >
              {word.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
