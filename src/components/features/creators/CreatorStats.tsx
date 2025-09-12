'use client'

interface CreatorStatsProps
{
    stats: {
        totalReach: string;
        avgReach: string;
        totalEngagements: string;
        contentCreated: number;
    };
}

export function CreatorStats({ stats }: CreatorStatsProps)
{
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Performance Overview</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[#828288]">Total Reach</span>
                        <span className="text-xl font-bold text-[#EDECF8]">{stats.totalReach}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[#828288]">Average Reach</span>
                        <span className="text-xl font-bold text-[#EDECF8]">{stats.avgReach}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[#828288]">Total Engagements</span>
                        <span className="text-xl font-bold text-[#D78E59]">{stats.totalEngagements}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[#828288]">Content Created</span>
                        <span className="text-xl font-bold text-[#EDECF8]">{stats.contentCreated}</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Audience Demographics</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#828288]">18-24 years</span>
                            <span className="text-[#EDECF8]">35%</span>
                        </div>
                        <div className="w-full bg-[#202020] rounded-full h-2">
                            <div className="bg-[#D78E59] h-2 rounded-full" style={{ width: '35%' }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#828288]">25-34 years</span>
                            <span className="text-[#EDECF8]">45%</span>
                        </div>
                        <div className="w-full bg-[#202020] rounded-full h-2">
                            <div className="bg-[#D78E59] h-2 rounded-full" style={{ width: '45%' }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#828288]">35-44 years</span>
                            <span className="text-[#EDECF8]">15%</span>
                        </div>
                        <div className="w-full bg-[#202020] rounded-full h-2">
                            <div className="bg-[#D78E59] h-2 rounded-full" style={{ width: '15%' }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#828288]">45+ years</span>
                            <span className="text-[#EDECF8]">5%</span>
                        </div>
                        <div className="w-full bg-[#202020] rounded-full h-2">
                            <div className="bg-[#D78E59] h-2 rounded-full" style={{ width: '5%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}