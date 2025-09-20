// app/(management)/retailer-management/distribution/page.tsx - Distribution Management
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retailer Hub - Distribution Management',
  description: 'Manage product distribution, inventory, and availability'
};

export default function RetailerDistributionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Distribution Management</h1>
          <p className="text-[#828288] mt-1">
            Manage your product inventory, availability, and distribution settings.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-2 rounded-lg font-medium border border-[#575757] transition-colors">
            Bulk Update
          </button>
          <button className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Add Products
          </button>
        </div>
      </div>

      {/* Distribution Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Products</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">1,247</p>
          <p className="text-sm text-[#10B981] mt-1">+89 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">In Stock</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">892</p>
          <p className="text-sm text-[#10B981] mt-1">71% of catalog</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Low Stock</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">23</p>
          <p className="text-sm text-[#F59E0B] mt-1">Need attention</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Out of Stock</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">12</p>
          <p className="text-sm text-[#EF4444] mt-1">Unavailable</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-2 rounded text-sm"
            />
          </div>
          <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-2 rounded text-sm">
            <option>All Brands</option>
            <option>Beauty Co.</option>
            <option>Glow Cosmetics</option>
            <option>Natural Beauty</option>
          </select>
          <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-2 rounded text-sm">
            <option>All Categories</option>
            <option>Foundation</option>
            <option>Lipstick</option>
            <option>Eye Makeup</option>
            <option>Skincare</option>
          </select>
          <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-2 rounded text-sm">
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
            <option>Discontinued</option>
          </select>
        </div>

        {/* Product Distribution List */}
        <div className="space-y-4">
          {[
            {
              name: 'Natural Foundation - Warm Beige',
              brand: 'Beauty Co.',
              sku: 'BC-FOUND-001',
              category: 'Foundation',
              stock: 45,
              status: 'In Stock',
              price: '$24.99',
              commission: '20%',
              availability: true
            },
            {
              name: 'Glossy Lip Balm - Cherry',
              brand: 'Glow Cosmetics',
              sku: 'GC-LIP-005',
              category: 'Lipstick',
              stock: 8,
              status: 'Low Stock',
              price: '$12.99',
              commission: '15%',
              availability: true
            },
            {
              name: 'Eye Shadow Palette - Sunset',
              brand: 'Natural Beauty',
              sku: 'NB-EYE-012',
              category: 'Eye Makeup',
              stock: 23,
              status: 'In Stock',
              price: '$32.99',
              commission: '25%',
              availability: true
            },
            {
              name: 'Daily Moisturizer - Sensitive',
              brand: 'Beauty Co.',
              sku: 'BC-SKIN-008',
              category: 'Skincare',
              stock: 0,
              status: 'Out of Stock',
              price: '$18.99',
              commission: '18%',
              availability: false
            },
            {
              name: 'Matte Lipstick - Ruby Red',
              brand: 'Glow Cosmetics',
              sku: 'GC-LIP-015',
              category: 'Lipstick',
              stock: 67,
              status: 'In Stock',
              price: '$16.99',
              commission: '22%',
              availability: true
            }
          ].map((product, index) => (
            <div key={index} className="border border-[#575757] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-[#EDECF8]">{product.name}</h4>
                    <span className="px-2 py-1 text-xs bg-[#575757] text-[#EDECF8] rounded">
                      {product.brand}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      product.status === 'In Stock' 
                        ? 'bg-[#10B981] text-white' 
                        : product.status === 'Low Stock'
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-[#EF4444] text-white'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[#828288] mb-3">
                    <span>SKU: {product.sku}</span>
                    <span>Category: {product.category}</span>
                    <span>Stock: {product.stock} units</span>
                    <span>Price: {product.price}</span>
                    <span>Commission: {product.commission}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#828288]">Available for sale:</span>
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        product.availability ? 'bg-[#10B981]' : 'bg-[#575757]'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          product.availability ? 'translate-x-6' : 'translate-x-1'
                        }`}></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-[#10B981] hover:text-[#34D399] text-sm">
                    Edit
                  </button>
                  <button className="text-[#828288] hover:text-[#EDECF8] text-sm">
                    View Details
                  </button>
                  <button className="text-[#828288] hover:text-[#EDECF8] text-sm">
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button className="text-[#10B981] hover:text-[#34D399] text-sm">
            Load More Products
          </button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Low Stock Alerts</h3>
        <div className="space-y-3">
          {[
            { product: 'Glossy Lip Balm - Cherry', current: 8, minimum: 10, brand: 'Glow Cosmetics' },
            { product: 'Face Primer - Hydrating', current: 5, minimum: 15, brand: 'Beauty Co.' },
            { product: 'Concealer - Medium', current: 3, minimum: 8, brand: 'Natural Beauty' }
          ].map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#F59E0B] bg-opacity-10 border border-[#F59E0B] border-opacity-30 rounded-lg">
              <div>
                <p className="font-medium text-[#EDECF8]">{alert.product}</p>
                <p className="text-sm text-[#828288]">
                  {alert.brand} • Current: {alert.current} units • Minimum: {alert.minimum} units
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-3 py-1 rounded text-sm">
                  Reorder
                </button>
                <button className="text-[#F59E0B] hover:text-[#FBBF24] text-sm">
                  Contact Supplier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}