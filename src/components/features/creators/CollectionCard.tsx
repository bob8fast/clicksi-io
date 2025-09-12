'use client'

import { Collection } from '@/types/creator';

interface CollectionCardProps
{
    collection: Collection;
    isSelected: boolean;
    onClick: () => void;
}

export function CollectionCard({ collection, isSelected, onClick }: CollectionCardProps)
{
    return (
        <button
            onClick={onClick}
            className={`group relative aspect-square rounded-xl overflow-hidden bg-[#202020] border-2 transition-all ${isSelected
                    ? 'border-[#D78E59]'
                    : 'border-[#202020] hover:border-[#575757]'
                }`}
        >
            <img
                src={collection.coverImage}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold mb-1">{collection.name}</h3>
                <p className="text-white/80 text-sm">{collection.postCount} posts</p>
            </div>
            {isSelected && (
                <div className="absolute inset-0 bg-[#D78E59]/20 pointer-events-none" />
            )}
        </button>
    );
}