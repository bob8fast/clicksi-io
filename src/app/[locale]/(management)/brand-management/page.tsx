// app/(management)/brand-management/page.tsx - Brand Dashboard
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Management - Dashboard',
  description: 'Brand Management dashboard for business owners and brand managers'
};

export default function BrandDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Brand Dashboard</h1>
          <p className="text-[#828288] mt-1">
            Welcome to your Brand Management portal. Manage products, partnerships, and grow your business.
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Products</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">89</p>
          <p className="text-sm text-[#D78E59] mt-1">+7 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Active Creators</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">24</p>
          <p className="text-sm text-[#D78E59] mt-1">+3 this week</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Revenue</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">$12,547</p>
          <p className="text-sm text-[#D78E59] mt-1">+$1,234 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">6.8%</p>
          <p className="text-sm text-[#D78E59] mt-1">+0.9% this week</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Recent Products</h3>
          <div className="space-y-3">
            {[
              { name: 'Hydrating Face Serum', status: 'Active', date: '2 days ago' },
              { name: 'Matte Lipstick Collection', status: 'Pending', date: '1 week ago' },
              { name: 'Organic Night Cream', status: 'Active', date: '2 weeks ago' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#EDECF8] font-medium">{item.name}</p>
                  <p className="text-sm text-[#828288]">{item.status}</p>
                </div>
                <p className="text-sm text-[#575757]">{item.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Creator Partnerships</h3>
          <div className="space-y-3">
            {[
              { creator: '@beauty_guru_anna', product: 'Face Serum', performance: '+45%' },
              { creator: '@skincare_sophie', product: 'Night Cream', performance: '+32%' },
              { creator: '@makeup_maven', product: 'Lipstick Set', performance: '+28%' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#EDECF8] font-medium">{item.creator}</p>
                  <p className="text-sm text-[#828288]">{item.product}</p>
                </div>
                <p className="text-sm text-[#D78E59] font-medium">{item.performance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] px-4 py-3 rounded-lg font-medium transition-colors">
            Add New Product
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            Invite Creator
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}