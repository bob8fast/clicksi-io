// app/(management)/creator-management/links/page.tsx - Affiliate Links Management
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Studio - Affiliate Links',
  description: 'Manage your affiliate links and track performance'
};

export default function CreatorLinksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Affiliate Links</h1>
          <p className="text-[#828288] mt-1">
            Create and manage your affiliate links to track conversions and earnings.
          </p>
        </div>
        <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Generate New Link
        </button>
      </div>

      {/* Links Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Active Links</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">28</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+5 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Clicks</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">12,847</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+2,451 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Conversions</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">342</p>
          <p className="text-sm text-[#8B5CF6] mt-1">2.7% conversion rate</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Earnings</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">$2,847</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+$423 this month</p>
        </div>
      </div>

      {/* Active Links */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#EDECF8]">Active Links</h3>
          <div className="flex gap-2">
            <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-1 rounded text-sm">
              <option>All Brands</option>
              <option>Beauty Co.</option>
              <option>Glow Cosmetics</option>
              <option>Natural Beauty</option>
            </select>
            <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-1 rounded text-sm">
              <option>Best Performing</option>
              <option>Most Recent</option>
              <option>Most Clicks</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              product: 'Glossy Lip Balm - Natural Pink',
              brand: 'Beauty Co.',
              shortLink: 'clicksi.io/gl-pink-123',
              clicks: '1,234',
              conversions: '45',
              commission: '$45.60',
              rate: '3.6%',
              created: '2 weeks ago'
            },
            {
              product: 'Foundation - Warm Beige',
              brand: 'Glow Cosmetics',
              shortLink: 'clicksi.io/foundation-456',
              clicks: '987',
              conversions: '32',
              commission: '$38.20',
              rate: '3.2%',
              created: '1 month ago'
            },
            {
              product: 'Eye Shadow Palette - Sunset',
              brand: 'Natural Beauty',
              shortLink: 'clicksi.io/eyeshadow-789',
              clicks: '756',
              conversions: '21',
              commission: '$29.40',
              rate: '2.8%',
              created: '3 weeks ago'
            },
            {
              product: 'Moisturizer - Daily Glow',
              brand: 'Beauty Co.',
              shortLink: 'clicksi.io/moisturizer-012',
              clicks: '445',
              conversions: '18',
              commission: '$22.50',
              rate: '4.0%',
              created: '1 week ago'
            }
          ].map((link, index) => (
            <div key={index} className="border border-[#575757] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-[#EDECF8]">{link.product}</h4>
                    <span className="px-2 py-1 text-xs bg-[#575757] text-[#EDECF8] rounded">
                      {link.brand}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[#828288] mb-2">
                    <span className="font-mono text-[#8B5CF6]">{link.shortLink}</span>
                    <span>Created {link.created}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[#828288]">
                    <span>Clicks: {link.clicks}</span>
                    <span>Conversions: {link.conversions}</span>
                    <span>Rate: {link.rate}</span>
                    <span className="text-[#8B5CF6] font-medium">Earned: {link.commission}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm">
                    Copy Link
                  </button>
                  <button className="text-[#828288] hover:text-[#EDECF8] text-sm">
                    Analytics
                  </button>
                  <button className="text-[#828288] hover:text-[#EDECF8] text-sm">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm">
            Load More Links
          </button>
        </div>
      </div>
    </div>
  );
}