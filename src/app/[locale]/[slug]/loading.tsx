export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse">
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
        </div>

        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-md"></div>
          <div className="h-4 bg-gray-200 rounded-md"></div>
          <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded-md"></div>
          <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
          <div className="h-4 bg-gray-200 rounded-md"></div>
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
        </div>
      </div>
    </div>
  )
}