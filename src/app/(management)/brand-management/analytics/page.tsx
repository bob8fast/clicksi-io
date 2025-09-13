// app/brand-management/analytics/page.tsx
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Eye, Heart, TrendingUp } from 'lucide-react';

export default function AnalyticsPage()
{
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#EDECF8]">Analytics</h1>
                <p className="text-[#828288] mt-1">Track your product performance and insights</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <Eye className="w-6 h-6 text-[#FFAA6C]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Total Views</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">12,543</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-[#D78E59]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Creator Interest</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">167</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-[#D78E59]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Conversion Rate</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">3.2%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-[#575757]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Revenue</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">$8,943</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-[#575757] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">Analytics Coming Soon</h3>
                <p className="text-[#828288]">
                    Detailed analytics and insights will be available in the next update.
                </p>
            </div>
        </div>
    );
}