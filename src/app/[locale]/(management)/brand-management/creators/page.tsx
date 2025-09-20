// app/brand-management/creators/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, TrendingUp, Users } from 'lucide-react';

export default function CreatorsPage()
{
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#EDECF8]">Creators</h1>
                    <p className="text-[#828288] mt-1">Manage creator relationships and collaborations</p>
                </div>
                <Button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                    Invite Creator
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-[#D78E59]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Interested Creators</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">167</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-[#FFAA6C]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Active Collaborations</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">12</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-[#575757]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Avg. Rating</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">4.8</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center py-12">
                <Users className="w-16 h-16 text-[#575757] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">Creator Management Coming Soon</h3>
                <p className="text-[#828288]">
                    Advanced creator management features will be available in the next update.
                </p>
            </div>
        </div>
    );
}