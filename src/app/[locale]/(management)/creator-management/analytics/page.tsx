// app/(management)/creator-management/analytics/page.tsx - Creator Analytics
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Studio - Analytics',
  description: 'Track your performance, engagement, and earnings analytics'
};

export default function CreatorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Analytics Dashboard</h1>
          <p className="text-[#828288] mt-1">
            Track your content performance, audience engagement, and earnings over time.
          </p>
        </div>
        <div className="flex gap-2">
          <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-2 rounded">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>Custom range</option>
          </select>
          <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Views</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">847.2K</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-[#8B5CF6]">+12.5%</span>
            <span className="text-xs text-[#575757] ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Engagement Rate</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">8.7%</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-[#8B5CF6]">+2.1%</span>
            <span className="text-xs text-[#575757] ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Click-through Rate</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">3.4%</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-[#8B5CF6]">+0.8%</span>
            <span className="text-xs text-[#575757] ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Earnings</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">$3,847</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-[#8B5CF6]">+$847</span>
            <span className="text-xs text-[#575757] ml-1">this month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Over Time */}
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Engagement Over Time</h3>
          <div className="h-64 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-[#8B5CF6] mb-2">📊</div>
              <p className="text-[#828288] text-sm">Interactive chart would be rendered here</p>
              <p className="text-[#575757] text-xs mt-1">Using Chart.js or similar library</p>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Top Performing Content</h3>
          <div className="space-y-4">
            {[
              { title: 'Summer Beauty Routine', views: '45.2K', engagement: '12.8%', earnings: '$245' },
              { title: 'Product Review: Foundation', views: '38.9K', engagement: '10.5%', earnings: '$189' },
              { title: 'Behind the Scenes', views: '29.1K', engagement: '15.2%', earnings: '$156' },
              { title: 'Makeup Tutorial', views: '22.7K', engagement: '9.8%', earnings: '$134' }
            ].map((content, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-[#575757] last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-[#EDECF8] mb-1">{content.title}</p>
                  <div className="flex items-center gap-4 text-sm text-[#828288]">
                    <span>{content.views} views</span>
                    <span>{content.engagement} engagement</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#8B5CF6] font-medium">{content.earnings}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audience Demographics */}
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Audience Demographics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#828288] text-sm">18-24 years</span>
                <span className="text-[#EDECF8] text-sm">34%</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-full h-2">
                <div className="bg-[#8B5CF6] h-2 rounded-full" style={{ width: '34%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#828288] text-sm">25-34 years</span>
                <span className="text-[#EDECF8] text-sm">42%</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-full h-2">
                <div className="bg-[#8B5CF6] h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#828288] text-sm">35-44 years</span>
                <span className="text-[#EDECF8] text-sm">18%</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-full h-2">
                <div className="bg-[#8B5CF6] h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#828288] text-sm">45+ years</span>
                <span className="text-[#EDECF8] text-sm">6%</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-full h-2">
                <div className="bg-[#8B5CF6] h-2 rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Content Type Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#8B5CF6] rounded-full"></div>
                <span className="text-[#EDECF8]">Videos</span>
              </div>
              <div className="text-right">
                <p className="text-[#EDECF8] font-medium">68%</p>
                <p className="text-[#828288] text-sm">of total engagement</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#A78BFA] rounded-full"></div>
                <span className="text-[#EDECF8]">Photos</span>
              </div>
              <div className="text-right">
                <p className="text-[#EDECF8] font-medium">22%</p>
                <p className="text-[#828288] text-sm">of total engagement</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#DDD6FE] rounded-full"></div>
                <span className="text-[#EDECF8]">Posts</span>
              </div>
              <div className="text-right">
                <p className="text-[#EDECF8] font-medium">10%</p>
                <p className="text-[#828288] text-sm">of total engagement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-lg">
              <div className="text-[#8B5CF6]">🏆</div>
              <div>
                <p className="text-[#EDECF8] font-medium text-sm">1M Total Views</p>
                <p className="text-[#828288] text-xs">Reached on July 25, 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-lg">
              <div className="text-[#8B5CF6]">💰</div>
              <div>
                <p className="text-[#EDECF8] font-medium text-sm">$1K Monthly Earnings</p>
                <p className="text-[#828288] text-xs">First time this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-lg">
              <div className="text-[#8B5CF6]">📈</div>
              <div>
                <p className="text-[#EDECF8] font-medium text-sm">10% Engagement Rate</p>
                <p className="text-[#828288] text-xs">Above industry average</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}