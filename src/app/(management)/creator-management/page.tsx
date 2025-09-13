// app/(management)/creator-management/page.tsx - Creator Dashboard
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Studio - Dashboard',
  description: 'Creator Studio dashboard for content creators and influencers'
};

export default function CreatorDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Creator Dashboard</h1>
          <p className="text-[#828288] mt-1">
            Welcome to your Creator Studio. Manage your content, track performance, and grow your audience.
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Content</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">142</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+12 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Active Links</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">28</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+5 this week</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Earnings</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">$2,847</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+$423 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Engagement Rate</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">8.4%</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+1.2% this week</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Recent Content</h3>
          <div className="space-y-3">
            {[
              { title: 'Summer Beauty Routine', type: 'Video', date: '2 hours ago' },
              { title: 'Product Review: New Foundation', type: 'Post', date: '1 day ago' },
              { title: 'Behind the Scenes', type: 'Photo Set', date: '3 days ago' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#EDECF8] font-medium">{item.title}</p>
                  <p className="text-sm text-[#828288]">{item.type}</p>
                </div>
                <p className="text-sm text-[#575757]">{item.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Top Performing Links</h3>
          <div className="space-y-3">
            {[
              { product: 'Glossy Lip Balm', clicks: '1,234', commission: '$45.60' },
              { product: 'Natural Foundation', clicks: '987', commission: '$38.20' },
              { product: 'Eye Shadow Palette', clicks: '756', commission: '$29.40' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#EDECF8] font-medium">{item.product}</p>
                  <p className="text-sm text-[#828288]">{item.clicks} clicks</p>
                </div>
                <p className="text-sm text-[#8B5CF6] font-medium">{item.commission}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-3 rounded-lg font-medium transition-colors">
            Create New Content
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            Generate Affiliate Link
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}