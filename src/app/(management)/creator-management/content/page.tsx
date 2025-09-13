// app/(management)/creator-management/content/page.tsx - Content Management
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Studio - Content Management',
  description: 'Manage your content, posts, videos, and photos'
};

export default function CreatorContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EDECF8]">Content Management</h1>
          <p className="text-[#828288] mt-1">
            Create, edit, and manage all your content in one place.
          </p>
        </div>
        <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Create New Content
        </button>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Total Posts</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">89</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+7 this week</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Videos</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">34</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+3 this week</p>
        </div>

        <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
          <h3 className="text-sm font-medium text-[#828288] mb-2">Photo Sets</h3>
          <p className="text-2xl font-bold text-[#EDECF8]">19</p>
          <p className="text-sm text-[#8B5CF6] mt-1">+2 this week</p>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#EDECF8]">Recent Content</h3>
          <div className="flex gap-2">
            <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-1 rounded text-sm">
              <option>All Types</option>
              <option>Posts</option>
              <option>Videos</option>
              <option>Photos</option>
            </select>
            <select className="bg-[#202020] border border-[#575757] text-[#EDECF8] px-3 py-1 rounded text-sm">
              <option>Latest</option>
              <option>Most Popular</option>
              <option>Most Engaging</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'Summer Beauty Routine Tutorial',
              type: 'Video',
              status: 'Published',
              engagement: '8.2%',
              views: '12.5K',
              date: '2 hours ago'
            },
            {
              title: 'New Foundation Review & Swatches',
              type: 'Post',
              status: 'Published',
              engagement: '6.8%',
              views: '8.9K',
              date: '1 day ago'
            },
            {
              title: 'Behind the Scenes: Photoshoot',
              type: 'Photo Set',
              status: 'Draft',
              engagement: '-',
              views: '-',
              date: '2 days ago'
            },
            {
              title: 'Product Unboxing: Spring Collection',
              type: 'Video',
              status: 'Published',
              engagement: '9.1%',
              views: '15.2K',
              date: '3 days ago'
            }
          ].map((content, index) => (
            <div key={index} className="border border-[#575757] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-[#EDECF8]">{content.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      content.status === 'Published' 
                        ? 'bg-[#8B5CF6] text-white' 
                        : 'bg-[#575757] text-[#EDECF8]'
                    }`}>
                      {content.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[#828288]">
                    <span>{content.type}</span>
                    <span>Views: {content.views}</span>
                    <span>Engagement: {content.engagement}</span>
                    <span>{content.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm">
                    Edit
                  </button>
                  <button className="text-[#828288] hover:text-[#EDECF8] text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}