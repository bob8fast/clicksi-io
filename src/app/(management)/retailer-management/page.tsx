// app/(management)/retailer-management/page.tsx - Retailer Dashboard
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retailer Hub - Dashboard',
  description: 'Retailer Hub dashboard for product distribution and brand partnerships'
};

export default function RetailerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Retailer Dashboard</h1>
          <p className="text-[#828288] mt-1">
            Welcome to your Retailer Hub. Manage distribution, partner with brands, and track performance.
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Products Distributed</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">1,247</p>
          <p className="text-sm text-[#10B981] mt-1">+89 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Brand Partners</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">23</p>
          <p className="text-sm text-[#10B981] mt-1">+3 new partnerships</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">$47,892</p>
          <p className="text-sm text-[#10B981] mt-1">+12.4% vs last month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Store Locations</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">8</p>
          <p className="text-sm text-[#10B981] mt-1">2 online, 6 physical</p>
        </div>
      </div>

      {/* Recent Activity & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New partnership request from Glow Cosmetics', time: '2 hours ago', type: 'partnership' },
              { action: 'Updated availability for Foundation products', time: '4 hours ago', type: 'inventory' },
              { action: 'Commission payment received - $2,847', time: '6 hours ago', type: 'payment' },
              { action: 'New product added to distribution catalog', time: '1 day ago', type: 'product' },
              { action: 'Store location updated for Downtown branch', time: '2 days ago', type: 'location' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 py-2">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'partnership' ? 'bg-[#10B981]' :
                  activity.type === 'payment' ? 'bg-[#F59E0B]' :
                  activity.type === 'inventory' ? 'bg-[#3B82F6]' :
                  activity.type === 'product' ? 'bg-[#8B5CF6]' : 'bg-[#6B7280]'
                }`}></div>
                <div className="flex-1">
                  <p className="text-[#EDECF8] text-sm">{activity.action}</p>
                  <p className="text-[#575757] text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Top Performing Products</h3>
          <div className="space-y-3">
            {[
              { name: 'Natural Foundation - Beige', brand: 'Beauty Co.', sales: '1,234', revenue: '$15,420', trend: '+23%' },
              { name: 'Glossy Lip Balm Set', brand: 'Glow Cosmetics', sales: '987', revenue: '$12,890', trend: '+18%' },
              { name: 'Eye Shadow Palette - Sunset', brand: 'Natural Beauty', sales: '756', revenue: '$9,450', trend: '+15%' },
              { name: 'Daily Moisturizer', brand: 'Beauty Co.', sales: '654', revenue: '$8,120', trend: '+12%' }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#EDECF8] font-medium text-sm">{product.name}</p>
                  <p className="text-[#828288] text-xs">{product.brand} • {product.sales} sold</p>
                </div>
                <div className="text-right">
                  <p className="text-[#10B981] font-medium text-sm">{product.revenue}</p>
                  <p className="text-[#10B981] text-xs">{product.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Overview */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Distribution Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-[#EDECF8] text-sm">Inventory Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">In Stock</span>
                <span className="text-[#10B981] font-medium">892 products</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Low Stock</span>
                <span className="text-[#F59E0B] font-medium">23 products</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Out of Stock</span>
                <span className="text-[#EF4444] font-medium">12 products</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-[#EDECF8] text-sm">Brand Partnerships</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Active Partners</span>
                <span className="text-[#10B981] font-medium">23 brands</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Pending Requests</span>
                <span className="text-[#F59E0B] font-medium">5 requests</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Commission Rate</span>
                <span className="text-[#EDECF8] font-medium">15-25%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-[#EDECF8] text-sm">Sales Channels</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Online Store</span>
                <span className="text-[#10B981] font-medium">68% of sales</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Physical Stores</span>
                <span className="text-[#10B981] font-medium">32% of sales</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Marketplace</span>
                <span className="text-[#828288] font-medium">Coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-3 rounded-lg font-medium transition-colors">
            Update Inventory
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            Review Partnership Requests
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            View Analytics
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            Manage Store Locations
          </button>
        </div>
      </div>
    </div>
  );
}