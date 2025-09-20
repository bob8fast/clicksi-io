// app/creators/[handle]/page.tsx

// import { creatorService } from '@/services/creatorService'; // Service removed

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  
  return {
    title: `@${handle} - Creator Profile | Clicksi`,
    description: `Check out @${handle}'s creator profile on Clicksi`,
  };
}

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function CreatorPage({ params }: PageProps) {
  const { handle } = await params;

  return (
    <div className="min-h-screen bg-[#171717]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[#EDECF8] mb-4">Creator Profile</h1>
          <p className="text-[#828288] mb-6">@{handle}</p>
          <p className="text-[#575757]">
            Creator profiles are not available in this version.
          </p>
        </div>
      </div>
    </div>
  );
}