// app/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <header className="mb-8">
          <div className="h-10 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded mb-4 w-full"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        </header>

        {/* Content skeleton */}
        <main className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>

          <div className="py-6">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>

          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>

          {/* Image placeholder */}
          <div className="h-64 bg-gray-200 rounded-lg my-8"></div>

          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/5"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </main>
      </div>
    </div>
  );
}