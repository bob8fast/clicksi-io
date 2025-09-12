// app/(management)/retailer-management/brands/page.tsx - Brand Partnerships
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retailer Hub - Brand Partnerships',
  description: 'Manage brand partnerships, commission settings, and collaboration requests'
};

export default function RetailerBrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Brand Partnerships</h1>
          <p className="text-[#828288] mt-1">
            Manage your brand partnerships, review requests, and configure commission settings.
          </p>
        </div>
        <button className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Request Partnership
        </button>
      </div>

      {/* Partnership Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Active Partners</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">23</p>
          <p className="text-sm text-[#10B981] mt-1">+3 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Pending Requests</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">5</p>
          <p className="text-sm text-[#F59E0B] mt-1">Need review</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Commission</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">$12,847</p>
          <p className="text-sm text-[#10B981] mt-1">This month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Avg. Commission Rate</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">18.5%</p>
          <p className="text-sm text-[#10B981] mt-1">Range: 15-25%</p>
        </div>
      </div>

      {/* Pending Partnership Requests */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Pending Partnership Requests</h3>
        <div className="space-y-4">
          {[
            {
              brand: 'Organic Beauty Co.',
              requestType: 'Incoming',
              products: 45,
              proposedCommission: '20%',
              requestDate: '3 days ago',
              message: 'We would love to partner with your stores for our new organic skincare line.',
              priority: 'high'
            },
            {
              brand: 'Luxury Cosmetics',
              requestType: 'Outgoing',
              products: 28,
              proposedCommission: '15%',
              requestDate: '1 week ago',
              message: 'Requesting partnership for premium makeup distribution.',
              priority: 'medium'
            },
            {
              brand: 'Youth Skincare',
              requestType: 'Incoming',
              products: 12,
              proposedCommission: '22%',
              requestDate: '2 weeks ago',
              message: 'Interested in distributing our teen-focused skincare products.',
              priority: 'low'
            }
          ].map((request, index) => (
            <div key={index} className="border border-[#575757] rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-[#EDECF8]">{request.brand}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      request.requestType === 'Incoming' 
                        ? 'bg-[#10B981] text-white' 
                        : 'bg-[#3B82F6] text-white'
                    }`}>
                      {request.requestType} Request
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      request.priority === 'high' 
                        ? 'bg-[#EF4444] text-white' 
                        : request.priority === 'medium'
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-[#6B7280] text-white'
                    }`}>
                      {request.priority} priority
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[#828288] mb-2">
                    <span>{request.products} products</span>
                    <span>Commission: {request.proposedCommission}</span>
                    <span>Requested {request.requestDate}</span>
                  </div>
                  <p className="text-sm text-[#EDECF8]">{request.message}</p>
                </div>
                <div className="flex gap-2">
                  {request.requestType === 'Incoming' ? (
                    <>
                      <button className="bg-[#10B981] hover:bg-[#059669] text-white px-3 py-1 rounded text-sm">
                        Accept
                      </button>
                      <button className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-3 py-1 rounded text-sm">
                        Decline
                      </button>
                    </>
                  ) : (
                    <button className="text-[#828288] hover:text-[#EDECF8] text-sm">
                      View Status
                    </button>
                  )}
                  <button className="text-[#10B981] hover:text-[#34D399] text-sm">
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Brand Partners */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#EDECF8]">Active Brand Partners</h3>
          <div className="flex gap-2">
            <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-1 rounded text-sm">
              <option>All Partners</option>
              <option>Premium Partners</option>
              <option>Standard Partners</option>
            </select>
            <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-1 rounded text-sm">
              <option>Sort by Performance</option>
              <option>Sort by Commission</option>
              <option>Sort by Products</option>
              <option>Sort by Date</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              name: 'Beauty Co.',
              partnership: 'Premium Partner',
              products: 127,
              commission: '20%',
              monthlyRevenue: '$8,450',
              performance: '+15%',
              status: 'Active',
              partnerSince: '2 years'
            },
            {
              name: 'Glow Cosmetics',
              partnership: 'Premium Partner',
              products: 89,
              commission: '22%',
              monthlyRevenue: '$6,230',
              performance: '+23%',
              status: 'Active',
              partnerSince: '1.5 years'
            },
            {
              name: 'Natural Beauty',
              partnership: 'Standard Partner',
              products: 56,
              commission: '18%',
              monthlyRevenue: '$4,120',
              performance: '+8%',
              status: 'Active',
              partnerSince: '8 months'
            },
            {
              name: 'Eco Skincare',
              partnership: 'Standard Partner',
              products: 34,
              commission: '15%',
              monthlyRevenue: '$2,890',
              performance: '+12%',
              status: 'Active',
              partnerSince: '6 months'
            },
            {
              name: 'Urban Makeup',
              partnership: 'Standard Partner',
              products: 67,
              commission: '17%',
              monthlyRevenue: '$3,560',
              performance: '+5%',
              status: 'Active',
              partnerSince: '1 year'
            }
          ].map((partner, index) => (
            <div key={index} className="border border-[#575757] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-[#EDECF8]">{partner.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      partner.partnership === 'Premium Partner' 
                        ? 'bg-[#8B5CF6] text-white' 
                        : 'bg-[#6B7280] text-white'
                    }`}>
                      {partner.partnership}
                    </span>
                    <span className="px-2 py-1 text-xs bg-[#10B981] text-white rounded">
                      {partner.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[#828288] mb-2">
                    <span>{partner.products} products</span>
                    <span>Commission: {partner.commission}</span>
                    <span>Revenue: {partner.monthlyRevenue}/month</span>
                    <span className="text-[#10B981]">Performance: {partner.performance}</span>
                  </div>
                  <p className="text-xs text-[#575757]">Partner since {partner.partnerSince}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-[#10B981] hover:text-[#34D399] text-sm">
                    Edit Terms
                  </button>
                  <button className="text-[#828288] hover:text-[#EDECF8] text-sm">
                    View Products
                  </button>
                  <button className="text-[#828288] hover:text-[#EDECF8] text-sm">
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Settings */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Commission Settings</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-[#EDECF8] mb-3">Default Commission Rates</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#828288]">Premium Partners</span>
                <span className="text-[#EDECF8] font-medium">20-25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288]">Standard Partners</span>
                <span className="text-[#EDECF8] font-medium">15-20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288]">New Partners</span>
                <span className="text-[#EDECF8] font-medium">15%</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-[#EDECF8] mb-3">Partnership Benefits</h4>
            <div className="space-y-2 text-sm text-[#828288]">
              <p>• Exclusive product access for premium partners</p>
              <p>• Marketing support and co-promotion opportunities</p>
              <p>• Priority customer service and support</p>
              <p>• Volume-based commission bonuses</p>
              <p>• Early access to new product launches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}