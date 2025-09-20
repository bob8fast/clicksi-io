// app/(management)/creator-management/team/page.tsx - Creator Team Management
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Studio - Team Management',
  description: 'Manage your creator team, permissions, and collaboration settings'
};

export default function CreatorTeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Team Management</h1>
          <p className="text-[#828288] mt-1">
            Manage your creator team members, permissions, and collaboration settings.
          </p>
        </div>
        <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Invite Team Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Team Members</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">5</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+1 this month</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Active Projects</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">12</p>
          <p className="text-sm text-[#8B5CF6] mt-1">3 new this week</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Pending Invites</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">2</p>
          <p className="text-sm text-[#575757] mt-1">Awaiting response</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Team Limit</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">5/10</p>
          <p className="text-sm text-[#8B5CF6] mt-1">Pro plan</p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#EDECF8]">Team Members</h3>
          <div className="flex gap-2">
            <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-1 rounded text-sm">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
            <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-1 rounded text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              name: 'Sarah Johnson',
              email: 'sarah@example.com',
              role: 'Admin',
              status: 'Active',
              joinDate: '6 months ago',
              lastActive: '2 hours ago',
              avatar: '👩‍💼'
            },
            {
              name: 'Mike Chen',
              email: 'mike@example.com',
              role: 'Editor',
              status: 'Active',
              joinDate: '4 months ago',
              lastActive: '1 day ago',
              avatar: '👨‍💻'
            },
            {
              name: 'Emma Wilson',
              email: 'emma@example.com',
              role: 'Editor',
              status: 'Active',
              joinDate: '3 months ago',
              lastActive: '3 hours ago',
              avatar: '👩‍🎨'
            },
            {
              name: 'Alex Rodriguez',
              email: 'alex@example.com',
              role: 'Viewer',
              status: 'Pending',
              joinDate: '1 week ago',
              lastActive: 'Never',
              avatar: '👨‍🎯'
            },
            {
              name: 'Lisa Zhang',
              email: 'lisa@example.com',
              role: 'Editor',
              status: 'Active',
              joinDate: '2 months ago',
              lastActive: '5 hours ago',
              avatar: '👩‍📊'
            }
          ].map((member, index) => (
            <div key={index} className="border border-[#575757] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{member.avatar}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-[#EDECF8]">{member.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        member.status === 'Active' 
                          ? 'bg-[#8B5CF6] text-white' 
                          : member.status === 'Pending'
                          ? 'bg-[#F59E0B] text-white'
                          : 'bg-[#575757] text-[#EDECF8]'
                      }`}>
                        {member.status}
                      </span>
                      <span className="px-2 py-1 text-xs bg-[#202020] text-[#828288] rounded">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-[#828288]">
                      <span>{member.email}</span>
                      <span>Joined {member.joinDate}</span>
                      <span>Last active: {member.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm">
                    Edit
                  </button>
                  <button className="text-[#828288] hover:text-[#EDECF8] text-sm">
                    Settings
                  </button>
                  {member.status === 'Pending' && (
                    <button className="text-[#F59E0B] hover:text-[#FBBF24] text-sm">
                      Resend Invite
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Role Permissions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-[#EDECF8] mb-2">Admin</h4>
              <ul className="text-sm text-[#828288] space-y-1 ml-3">
                <li>• Full access to all features</li>
                <li>• Manage team members</li>
                <li>• Edit content and settings</li>
                <li>• View analytics and reports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#EDECF8] mb-2">Editor</h4>
              <ul className="text-sm text-[#828288] space-y-1 ml-3">
                <li>• Create and edit content</li>
                <li>• Manage affiliate links</li>
                <li>• View analytics</li>
                <li>• Cannot manage team</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#EDECF8] mb-2">Viewer</h4>
              <ul className="text-sm text-[#828288] space-y-1 ml-3">
                <li>• View content and analytics</li>
                <li>• Cannot edit or create</li>
                <li>• Read-only access</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Team Activity</h3>
          <div className="space-y-3">
            {[
              { user: 'Sarah Johnson', action: 'Created new video content', time: '2 hours ago' },
              { user: 'Mike Chen', action: 'Updated product review post', time: '4 hours ago' },
              { user: 'Emma Wilson', action: 'Generated new affiliate link', time: '6 hours ago' },
              { user: 'Lisa Zhang', action: 'Uploaded photo set', time: '1 day ago' },
              { user: 'Sarah Johnson', action: 'Invited new team member', time: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 py-2">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-[#EDECF8] text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-[#575757] text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#575757]">
            <button className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm">
              View All Activity
            </button>
          </div>
        </div>
      </div>

      {/* Collaboration Settings */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Collaboration Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#EDECF8] font-medium">Content Approval</p>
                <p className="text-[#828288] text-sm">Require admin approval before publishing</p>
              </div>
              <div className="bg-[#8B5CF6] relative inline-flex h-6 w-11 items-center rounded-full">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#EDECF8] font-medium">Link Notifications</p>
                <p className="text-[#828288] text-sm">Notify team when new links are created</p>
              </div>
              <div className="bg-[#575757] relative inline-flex h-6 w-11 items-center rounded-full">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#EDECF8] font-medium">Analytics Access</p>
                <p className="text-[#828288] text-sm">Allow all members to view analytics</p>
              </div>
              <div className="bg-[#8B5CF6] relative inline-flex h-6 w-11 items-center rounded-full">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#EDECF8] font-medium">External Invites</p>
                <p className="text-[#828288] text-sm">Allow team members to invite others</p>
              </div>
              <div className="bg-[#575757] relative inline-flex h-6 w-11 items-center rounded-full">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}