// app/(management)/admin/page.tsx - Admin Dashboard
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Dashboard',
  description: 'Admin Panel dashboard for platform management and oversight'
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Admin Dashboard</h1>
          <p className="text-[#828288] mt-1">
            Welcome to the Admin Panel. Monitor platform activity, manage users, and oversee system operations.
          </p>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">12,847</p>
          <p className="text-sm text-[#DC2626] mt-1">+234 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Active Subscriptions</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">3,456</p>
          <p className="text-sm text-[#DC2626] mt-1">+89 this week</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Pending Verifications</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">47</p>
          <p className="text-sm text-[#F59E0B] mt-1">Need attention</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">System Health</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">99.8%</p>
          <p className="text-sm text-[#10B981] mt-1">All systems operational</p>
        </div>
      </div>

      {/* Recent Activities & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Recent Admin Activities</h3>
          <div className="space-y-3">
            {[
              { admin: 'Sarah Admin', action: 'Approved verification for Beauty Co.', time: '2 hours ago', type: 'verification' },
              { admin: 'Mike Admin', action: 'Updated subscription pricing tier', time: '4 hours ago', type: 'subscription' },
              { admin: 'Alex Admin', action: 'Resolved user support ticket #1247', time: '6 hours ago', type: 'support' },
              { admin: 'Emma Admin', action: 'Added new product category: Skincare Tools', time: '1 day ago', type: 'category' },
              { admin: 'Tom Admin', action: 'Processed trial request for Retailer Hub', time: '2 days ago', type: 'trial' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 py-2">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'verification' ? 'bg-[#DC2626]' :
                  activity.type === 'subscription' ? 'bg-[#F59E0B]' :
                  activity.type === 'support' ? 'bg-[#3B82F6]' :
                  activity.type === 'category' ? 'bg-[#8B5CF6]' : 'bg-[#10B981]'
                }`}></div>
                <div className="flex-1">
                  <p className="text-[#EDECF8] text-sm">
                    <span className="font-medium">{activity.admin}</span> {activity.action}
                  </p>
                  <p className="text-[#575757] text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">System Alerts</h3>
          <div className="space-y-3">
            {[
              { type: 'High', message: '47 verification requests pending review', action: 'Review Now', priority: 'high' },
              { type: 'Medium', message: 'Monthly subscription renewal reminders sent', action: 'View Report', priority: 'medium' },
              { type: 'Low', message: 'System backup completed successfully', action: 'View Logs', priority: 'low' },
              { type: 'Medium', message: '12 new trial requests awaiting approval', action: 'Process', priority: 'medium' }
            ].map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                alert.priority === 'high' 
                  ? 'bg-[#DC2626] bg-opacity-10 border-[#DC2626] border-opacity-30' 
                  : alert.priority === 'medium'
                  ? 'bg-[#F59E0B] bg-opacity-10 border-[#F59E0B] border-opacity-30'
                  : 'bg-[#10B981] bg-opacity-10 border-[#10B981] border-opacity-30'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`px-2 py-1 text-xs rounded font-medium ${
                      alert.priority === 'high' ? 'bg-[#DC2626] text-white' :
                      alert.priority === 'medium' ? 'bg-[#F59E0B] text-white' :
                      'bg-[#10B981] text-white'
                    }`}>
                      {alert.type}
                    </span>
                    <p className="text-[#EDECF8] text-sm mt-2">{alert.message}</p>
                  </div>
                  <button className={`text-sm font-medium ${
                    alert.priority === 'high' ? 'text-[#DC2626] hover:text-[#EF4444]' :
                    alert.priority === 'medium' ? 'text-[#F59E0B] hover:text-[#FBBF24]' :
                    'text-[#10B981] hover:text-[#34D399]'
                  }`}>
                    {alert.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Platform Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-[#EDECF8] text-sm">User Distribution</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Consumers</span>
                <span className="text-[#EDECF8] font-medium">8,924 (69%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Creators</span>
                <span className="text-[#EDECF8] font-medium">2,156 (17%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Brands</span>
                <span className="text-[#EDECF8] font-medium">1,234 (10%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Retailers</span>
                <span className="text-[#EDECF8] font-medium">533 (4%)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-[#EDECF8] text-sm">Content Moderation</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Approved Content</span>
                <span className="text-[#10B981] font-medium">45,678</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Pending Review</span>
                <span className="text-[#F59E0B] font-medium">123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Flagged Content</span>
                <span className="text-[#DC2626] font-medium">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Auto-Moderated</span>
                <span className="text-[#8B5CF6] font-medium">234</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-[#EDECF8] text-sm">Financial Overview</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Monthly Revenue</span>
                <span className="text-[#10B981] font-medium">$247,890</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Commission Paid</span>
                <span className="text-[#EDECF8] font-medium">$89,456</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Trial Conversions</span>
                <span className="text-[#DC2626] font-medium">23.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#828288] text-sm">Churn Rate</span>
                <span className="text-[#F59E0B] font-medium">2.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-4 py-3 rounded-lg font-medium transition-colors">
            Review Verifications
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            Manage Users
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            Process Trials
          </button>
          <button className="bg-[#202020] hover:bg-[#404040] text-[#EDECF8] px-4 py-3 rounded-lg font-medium border border-[#575757] transition-colors">
            System Analytics
          </button>
        </div>
      </div>
    </div>
  );
}