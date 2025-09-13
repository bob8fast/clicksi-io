// app/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>

          <div className="text-sm text-gray-500">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </div>

        {/* Suggested pages */}
        <div className="mt-12">
          <h3 className="text-lg font-medium mb-4">You might be looking for:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Link
              href="/about"
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <h4 className="font-medium mb-2">About Us</h4>
              <p className="text-sm text-gray-600">Learn more about our platform</p>
            </Link>

            <Link
              href="/dashboard"
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <h4 className="font-medium mb-2">Dashboard</h4>
              <p className="text-sm text-gray-600">Access your account</p>
            </Link>

            <Link
              href="/brands"
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <h4 className="font-medium mb-2">Brands</h4>
              <p className="text-sm text-gray-600">Explore our brands</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}