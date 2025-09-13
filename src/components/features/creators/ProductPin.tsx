// app/components/creators/ProductPin.tsx
'use client'

import { ProductPin as ProductPinType } from '@/types/creator';
import { ShoppingBag } from 'lucide-react';

interface ProductPinProps
{
    pin: ProductPinType;
    isHighlighted: boolean;
    onClick: (pin: ProductPinType) => void;
}

export function ProductPin({ pin, isHighlighted, onClick }: ProductPinProps)
{
    return (
        <div
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isHighlighted ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                }`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            onClick={() => onClick(pin)}
        >
            <div className={`relative ${isHighlighted ? 'animate-pulse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${isHighlighted
                        ? 'bg-[#D78E59] shadow-lg shadow-[#D78E59]/50'
                        : 'bg-white/90 backdrop-blur-sm hover:bg-white'
                    }`}>
                    <ShoppingBag size={16} className={isHighlighted ? 'text-[#171717]' : 'text-[#171717]'} />
                </div>
                {isHighlighted && (
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-12 h-12 rounded-full bg-[#D78E59]/20 animate-ping" />
                )}

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/90 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {pin.productName}
                        <div className="font-semibold">₴{pin.price}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}