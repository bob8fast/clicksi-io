// components/categories/IconGallery.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ResponsiveModal from '@/components/ui/responsive-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import
{
    Activity,
    AlertCircle,
    Apple,
    AtSign,
    Award,
    BarChart,
    Bike,
    Book,
    Briefcase,
    Building,
    Building2,
    Bus,
    Cake,
    Calculator,
    Calendar,
    Camera,
    Car,
    CheckCircle,
    Clock,
    Cloud,
    Coffee,
    Compass,
    CreditCard,
    Crown,
    Diamond,
    DollarSign,
    Droplet,
    Dumbbell,
    Eye,
    Factory,
    Film,
    Fish,
    Flower,
    Gamepad2,
    Gem,
    Gift,
    Glasses,
    Globe,
    Hash,
    Headphones,
    Heart,
    HeartPulse,
    Home,
    Image as ImageIcon,
    Info,
    Key,
    Laptop,
    Leaf,
    LucideIcon,
    Mail,
    Map,
    MapPin,
    MessageSquare,
    Mic,
    Milk,
    Monitor,
    Moon,
    Mountain,
    Music,
    Navigation,
    Package,
    Package2,
    Palette,
    Pause,
    Phone,
    PieChart,
    Pizza,
    Plane,
    Play,
    Plus,
    Radio,
    Search,
    Settings,
    Share2,
    Shield,
    Ship,
    Shirt,
    ShoppingCart,
    Signal,
    Smartphone,
    Sparkle,
    Sparkles,
    Speaker,
    Sprout,
    Star,
    Store,
    Sun,
    Tablet,
    Tag,
    Tags,
    Target,
    Thermometer,
    Timer,
    Train,
    TreePine,
    Trees,
    TrendingUp,
    Truck,
    Tv,
    Users,
    Utensils,
    Video,
    Volume2,
    Warehouse,
    Watch,
    Wifi,
    Wine,
    Wrench,
    X,
    XCircle,
    Zap
} from 'lucide-react';
import { createElement, useMemo, useState } from 'react';

// Export icon map for use in other components
export const ICON_MAP: Record<string, LucideIcon> = {
    'Activity': Activity,
    'AlertCircle': AlertCircle,
    'Apple': Apple,
    'AtSign': AtSign,
    'Award': Award,
    'BarChart': BarChart,
    'Bike': Bike,
    'Book': Book,
    'Briefcase': Briefcase,
    'Building': Building,
    'Building2': Building2,
    'Bus': Bus,
    'Cake': Cake,
    'Calculator': Calculator,
    'Calendar': Calendar,
    'Camera': Camera,
    'Car': Car,
    'CheckCircle': CheckCircle,
    'Clock': Clock,
    'Cloud': Cloud,
    'Coffee': Coffee,
    'Compass': Compass,
    'CreditCard': CreditCard,
    'Crown': Crown,
    'Diamond': Diamond,
    'DollarSign': DollarSign,
    'Droplet': Droplet,
    'Dumbbell': Dumbbell,
    'Eye': Eye,
    'Factory': Factory,
    'Film': Film,
    'Fish': Fish,
    'Flower': Flower,
    'Gamepad2': Gamepad2,
    'Gem': Gem,
    'Gift': Gift,
    'Glasses': Glasses,
    'Hash': Hash,
    'Headphones': Headphones,
    'Heart': Heart,
    'HeartPulse': HeartPulse,
    'Home': Home,
    'Image': ImageIcon,
    'Info': Info,
    'Key': Key,
    'Laptop': Laptop,
    'Leaf': Leaf,
    'Mail': Mail,
    'Map': Map,
    'MapPin': MapPin,
    'MessageSquare': MessageSquare,
    'Mic': Mic,
    'Milk': Milk,
    'Monitor': Monitor,
    'Moon': Moon,
    'Mountain': Mountain,
    'Music': Music,
    'Navigation': Navigation,
    'Package': Package,
    'Package2': Package2,
    'Palette': Palette,
    'Pause': Pause,
    'Phone': Phone,
    'PieChart': PieChart,
    'Pizza': Pizza,
    'Plane': Plane,
    'Play': Play,
    'Plus': Plus,
    'Radio': Radio,
    'Settings': Settings,
    'Share2': Share2,
    'Shield': Shield,
    'Ship': Ship,
    'Shirt': Shirt,
    'ShoppingCart': ShoppingCart,
    'Signal': Signal,
    'Smartphone': Smartphone,
    'Sparkle': Sparkle,
    'Sparkles': Sparkles,
    'Speaker': Speaker,
    'Sprout': Sprout,
    'Star': Star,
    'Store': Store,
    'Sun': Sun,
    'Tablet': Tablet,
    'Tag': Tag,
    'Tags': Tags,
    'Target': Target,
    'Thermometer': Thermometer,
    'Timer': Timer,
    'Train': Train,
    'TreePine': TreePine,
    'Trees': Trees,
    'TrendingUp': TrendingUp,
    'Truck': Truck,
    'Tv': Tv,
    'Users': Users,
    'Utensils': Utensils,
    'Video': Video,
    'Volume2': Volume2,
    'Warehouse': Warehouse,
    'Watch': Watch,
    'Wifi': Wifi,
    'Wine': Wine,
    'Wrench': Wrench,
    'XCircle': XCircle,
    'Zap': Zap,
};

// Icon interface
interface IconData
{
    name: string;
    icon: LucideIcon;
    keywords: string[];
}

// Comprehensive icon collection organized by categories
const ICON_COLLECTION_BASE: Record<string, IconData[]> = {
    'Basic': [
        { name: 'Star', icon: Star, keywords: ['star', 'favorite', 'rating'] },
        { name: 'Heart', icon: Heart, keywords: ['heart', 'love', 'like'] },
        { name: 'CheckCircle', icon: CheckCircle, keywords: ['circle', 'check', 'complete'] },
        { name: 'Plus', icon: Plus, keywords: ['plus', 'add', 'create'] },
        { name: 'Settings', icon: Settings, keywords: ['settings', 'config', 'gear'] },
        { name: 'XCircle', icon: XCircle, keywords: ['error', 'remove', 'delete'] },
        { name: 'AlertCircle', icon: AlertCircle, keywords: ['warning', 'alert', 'caution'] },
        { name: 'Info', icon: Info, keywords: ['info', 'information', 'help'] },
    ],
    'Shopping': [
        { name: 'Package', icon: Package, keywords: ['package', 'box', 'product'] },
        { name: 'ShoppingCart', icon: ShoppingCart, keywords: ['cart', 'shopping', 'buy'] },
        { name: 'Store', icon: Store, keywords: ['store', 'shop', 'retail'] },
        { name: 'Gift', icon: Gift, keywords: ['gift', 'present', 'surprise'] },
        { name: 'CreditCard', icon: CreditCard, keywords: ['payment', 'card', 'money'] },
        { name: 'Tag', icon: Tag, keywords: ['tag', 'label', 'price'] },
        { name: 'DollarSign', icon: DollarSign, keywords: ['dollar', 'money', 'price'] },
        { name: 'Truck', icon: Truck, keywords: ['delivery', 'shipping', 'transport'] },
        { name: 'Package2', icon: Package2, keywords: ['package', 'delivery', 'box'] },
        { name: 'Tags', icon: Tags, keywords: ['tags', 'labels', 'categories'] },
    ],
    'Fashion & Beauty': [
        { name: 'Shirt', icon: Shirt, keywords: ['shirt', 'clothing', 'fashion'] },
        { name: 'Watch', icon: Watch, keywords: ['watch', 'time', 'accessory'] },
        { name: 'Glasses', icon: Glasses, keywords: ['glasses', 'sunglasses', 'accessory'] },
        { name: 'Sparkles', icon: Sparkles, keywords: ['sparkles', 'beauty', 'makeup'] },
        { name: 'Diamond', icon: Diamond, keywords: ['diamond', 'jewelry', 'gem'] },
        { name: 'Crown', icon: Crown, keywords: ['crown', 'luxury', 'premium'] },
        { name: 'Palette', icon: Palette, keywords: ['makeup', 'beauty', 'cosmetics'] },
        { name: 'Eye', icon: Eye, keywords: ['eye', 'vision', 'see'] },
        { name: 'Sparkle', icon: Sparkle, keywords: ['sparkle', 'shine', 'glitter'] },
        { name: 'Gem', icon: Gem, keywords: ['gem', 'jewel', 'precious'] },
    ],
    'Electronics': [
        { name: 'Smartphone', icon: Smartphone, keywords: ['phone', 'mobile', 'device'] },
        { name: 'Laptop', icon: Laptop, keywords: ['laptop', 'computer', 'device'] },
        { name: 'Monitor', icon: Monitor, keywords: ['monitor', 'screen', 'display'] },
        { name: 'Headphones', icon: Headphones, keywords: ['headphones', 'audio', 'music'] },
        { name: 'Camera', icon: Camera, keywords: ['camera', 'photo', 'picture'] },
        { name: 'Tv', icon: Tv, keywords: ['tv', 'television', 'entertainment'] },
        { name: 'Speaker', icon: Speaker, keywords: ['speaker', 'audio', 'sound'] },
        { name: 'Gamepad2', icon: Gamepad2, keywords: ['gaming', 'controller', 'games'] },
        { name: 'Tablet', icon: Tablet, keywords: ['tablet', 'ipad', 'device'] },
        { name: 'Phone', icon: Phone, keywords: ['phone', 'call', 'communication'] },
    ],
    'Home & Living': [
        { name: 'Home', icon: Home, keywords: ['home', 'house', 'residence'] },
        { name: 'Moon', icon: Moon, keywords: ['bed', 'sleep', 'bedroom'] },
        { name: 'Sun', icon: Sun, keywords: ['light', 'lamp', 'illumination'] },
        { name: 'Utensils', icon: Utensils, keywords: ['kitchen', 'cooking', 'food'] },
        { name: 'Flower', icon: Flower, keywords: ['garden', 'plants', 'nature'] },
        { name: 'Wrench', icon: Wrench, keywords: ['tools', 'repair', 'maintenance'] },
        { name: 'Key', icon: Key, keywords: ['key', 'lock', 'security'] },
        { name: 'Building', icon: Building, keywords: ['building', 'structure', 'office'] },
        { name: 'Warehouse', icon: Warehouse, keywords: ['warehouse', 'storage', 'building'] },
        { name: 'Factory', icon: Factory, keywords: ['factory', 'manufacturing', 'industry'] },
    ],
    'Food & Drink': [
        { name: 'Apple', icon: Apple, keywords: ['apple', 'fruit', 'healthy'] },
        { name: 'Pizza', icon: Pizza, keywords: ['pizza', 'food', 'italian'] },
        { name: 'Coffee', icon: Coffee, keywords: ['coffee', 'drink', 'caffeine'] },
        { name: 'Wine', icon: Wine, keywords: ['wine', 'alcohol', 'drink'] },
        { name: 'Cake', icon: Cake, keywords: ['cake', 'dessert', 'sweet'] },
        { name: 'Utensils', icon: Utensils, keywords: ['utensils', 'dining', 'restaurant'] },
        { name: 'Fish', icon: Fish, keywords: ['fish', 'seafood', 'food'] },
        { name: 'Milk', icon: Milk, keywords: ['milk', 'dairy', 'drink'] },
    ],
    'Health & Fitness': [
        { name: 'Activity', icon: Activity, keywords: ['health', 'fitness', 'heart'] },
        { name: 'Dumbbell', icon: Dumbbell, keywords: ['fitness', 'gym', 'workout'] },
        { name: 'Bike', icon: Bike, keywords: ['bike', 'cycling', 'exercise'] },
        { name: 'Zap', icon: Zap, keywords: ['energy', 'power', 'speed'] },
        { name: 'HeartPulse', icon: HeartPulse, keywords: ['pulse', 'heartbeat', 'health'] },
        { name: 'Shield', icon: Shield, keywords: ['protection', 'safety', 'health'] },
        { name: 'Thermometer', icon: Thermometer, keywords: ['temperature', 'health', 'medical'] },
        { name: 'Timer', icon: Timer, keywords: ['timer', 'time', 'stopwatch'] },
    ],
    'Travel & Transport': [
        { name: 'Plane', icon: Plane, keywords: ['plane', 'travel', 'flight'] },
        { name: 'Car', icon: Car, keywords: ['car', 'vehicle', 'transport'] },
        { name: 'Map', icon: Map, keywords: ['map', 'navigation', 'location'] },
        { name: 'Compass', icon: Compass, keywords: ['compass', 'direction', 'navigation'] },
        { name: 'Briefcase', icon: Briefcase, keywords: ['luggage', 'travel', 'suitcase'] },
        { name: 'Train', icon: Train, keywords: ['train', 'transport', 'railway'] },
        { name: 'Ship', icon: Ship, keywords: ['ship', 'boat', 'water'] },
        { name: 'Bus', icon: Bus, keywords: ['bus', 'transport', 'public'] },
        { name: 'Navigation', icon: Navigation, keywords: ['navigation', 'gps', 'direction'] },
        { name: 'MapPin', icon: MapPin, keywords: ['location', 'pin', 'place'] },
    ],
    'Nature & Weather': [
        { name: 'Sun', icon: Sun, keywords: ['sun', 'sunny', 'weather'] },
        { name: 'Moon', icon: Moon, keywords: ['moon', 'night', 'dark'] },
        { name: 'Cloud', icon: Cloud, keywords: ['cloud', 'weather', 'sky'] },
        { name: 'TreePine', icon: TreePine, keywords: ['tree', 'nature', 'forest'] },
        { name: 'Leaf', icon: Leaf, keywords: ['leaf', 'nature', 'plant'] },
        { name: 'Flower', icon: Flower, keywords: ['flower', 'nature', 'bloom'] },
        { name: 'Mountain', icon: Mountain, keywords: ['mountain', 'nature', 'peak'] },
        { name: 'Droplet', icon: Droplet, keywords: ['water', 'drop', 'liquid'] },
        { name: 'Trees', icon: Trees, keywords: ['trees', 'forest', 'nature'] },
        { name: 'Sprout', icon: Sprout, keywords: ['sprout', 'growth', 'plant'] },
    ],
    'Business & Office': [
        { name: 'Briefcase', icon: Briefcase, keywords: ['business', 'work', 'office'] },
        { name: 'Calculator', icon: Calculator, keywords: ['calculator', 'math', 'finance'] },
        { name: 'Calendar', icon: Calendar, keywords: ['calendar', 'date', 'schedule'] },
        { name: 'Clock', icon: Clock, keywords: ['clock', 'time', 'schedule'] },
        { name: 'BarChart', icon: BarChart, keywords: ['chart', 'graph', 'data'] },
        { name: 'Target', icon: Target, keywords: ['target', 'goal', 'objective'] },
        { name: 'Award', icon: Award, keywords: ['award', 'achievement', 'success'] },
        { name: 'Building2', icon: Building2, keywords: ['building', 'office', 'company'] },
        { name: 'TrendingUp', icon: TrendingUp, keywords: ['growth', 'increase', 'success'] },
        { name: 'PieChart', icon: PieChart, keywords: ['chart', 'statistics', 'data'] },
    ],
    'Social & Communication': [
        { name: 'Users', icon: Users, keywords: ['users', 'people', 'community'] },
        { name: 'MessageSquare', icon: MessageSquare, keywords: ['message', 'chat', 'communication'] },
        { name: 'Mail', icon: Mail, keywords: ['mail', 'email', 'contact'] },
        { name: 'Phone', icon: Phone, keywords: ['phone', 'call', 'contact'] },
        { name: 'Share2', icon: Share2, keywords: ['share', 'social', 'network'] },
        { name: 'Globe', icon: Globe, keywords: ['globe', 'world', 'internet'] },
        { name: 'Wifi', icon: Wifi, keywords: ['wifi', 'internet', 'connection'] },
        { name: 'Signal', icon: Signal, keywords: ['signal', 'connection', 'network'] },
        { name: 'AtSign', icon: AtSign, keywords: ['email', 'at', 'contact'] },
        { name: 'Hash', icon: Hash, keywords: ['hashtag', 'social', 'tag'] },
    ],
    'Media & Entertainment': [
        { name: 'Music', icon: Music, keywords: ['music', 'audio', 'sound'] },
        { name: 'Video', icon: Video, keywords: ['video', 'film', 'movie'] },
        { name: 'Image', icon: ImageIcon, keywords: ['image', 'picture', 'photo'] },
        { name: 'Book', icon: Book, keywords: ['book', 'reading', 'education'] },
        { name: 'Film', icon: Film, keywords: ['film', 'movie', 'cinema'] },
        { name: 'Play', icon: Play, keywords: ['play', 'start', 'media'] },
        { name: 'Pause', icon: Pause, keywords: ['pause', 'stop', 'media'] },
        { name: 'Volume2', icon: Volume2, keywords: ['volume', 'sound', 'audio'] },
        { name: 'Mic', icon: Mic, keywords: ['microphone', 'audio', 'recording'] },
        { name: 'Radio', icon: Radio, keywords: ['radio', 'music', 'broadcast'] },
    ]
};

interface IconGalleryProps
{
    isOpen: boolean;
    onClose: () => void;
    onIconSelect: (iconName: string) => void;
    selectedIcon?: string;
    showSelectButton?: boolean;
}

export default function IconGallery({ isOpen, onClose, onIconSelect, selectedIcon, showSelectButton }: IconGalleryProps)
{
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [iconSize, setIconSize] = useState<'small' | 'medium' | 'large'>('medium');

    // Create ICON_COLLECTION with "All" category populated
    const ICON_COLLECTION = useMemo((): Record<string, IconData[]> =>
    {
        const allIcons = Object.values(ICON_COLLECTION_BASE)
            .flat()
            .filter((icon, index, array) =>
                // Remove duplicates based on name
                index === array.findIndex(i => i.name === icon.name)
            );

        return {
            'All': allIcons,
            ...ICON_COLLECTION_BASE
        };
    }, []);

    // Filter icons based on search query and category
    const getFilteredIcons = () =>
    {
        let icons: IconData[] = [];

        if (searchQuery.trim())
        {
            // Search across all icons when searching
            const query = searchQuery.toLowerCase();
            icons = ICON_COLLECTION['All'].filter(icon =>
                icon.name.toLowerCase().includes(query) ||
                icon.keywords.some(keyword => keyword.toLowerCase().includes(query))
            );
        } else
        {
            // Use selected category
            icons = ICON_COLLECTION[selectedCategory] || [];
        }

        return icons;
    };

    const filteredIcons = getFilteredIcons();
    const categories = Object.keys(ICON_COLLECTION);

    const footer = (
        <div className="flex items-center justify-between">
            <div className="text-sm text-[#575757]">
                {searchQuery ? (
                    `${filteredIcons.length} icons found`
                ) : (
                    `${ICON_COLLECTION[selectedCategory]?.length || 0} icons in ${selectedCategory}`
                )}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                >
                    Cancel
                </Button>
                {selectedIcon && showSelectButton && (
                    <Button
                        onClick={onClose}
                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        Select {selectedIcon}
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            title="Select Icon"
            description="Choose an icon for your category"
            icon={<Palette className="h-5 w-5 text-[#D78E59]" />}
            maxWidth="4xl"
            height="80vh"
            footer={footer}
            scrollable={false}
        >
            <div className="flex flex-col h-full space-y-4">
                {/* Search and Controls */}
                <div className="flex-shrink-0 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#575757] h-4 w-4" />
                        <Input
                            placeholder="Search icons..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#090909] border-[#575757] text-[#EDECF8] focus:border-[#D78E59]"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#575757] hover:text-[#EDECF8]"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Mobile Category Selector */}
                    <div className="md:hidden">
                        {!searchQuery && (
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full bg-[#171717] border-[#575757] text-[#EDECF8]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757] text-[#EDECF8]">
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category} ({ICON_COLLECTION[category]?.length || 0})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )
                        }
                    </div>
                </div>

                <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
                    {/* Categories Sidebar - Desktop Only, hide during search */}
                    {!searchQuery && (
                        <div className="hidden md:block w-48 flex-shrink-0">
                            <div className="text-sm font-medium text-[#828288] mb-3">Categories</div>
                            <div className="h-full overflow-hidden">
                                <ScrollArea className="h-full">
                                    <div className="space-y-1 pr-2 pb-20">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${selectedCategory === category
                                                    ? 'bg-[#D78E59] text-[#171717]'
                                                    : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]'
                                                    }`}
                                            >
                                                <div className="truncate">
                                                    {category}
                                                </div>
                                                <div className="text-xs opacity-60 truncate">
                                                    {ICON_COLLECTION[category]?.length || 0} icons
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    )}

                    {/* Icons Grid */}
                    <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                        {/* View Controls */}
                        <div className="flex items-center justify-between mb-4 flex-shrink-0">
                            <div className="text-sm text-[#828288]">
                                {filteredIcons.length} icons
                                {searchQuery && (
                                    <span className="ml-2 text-[#575757]">
                                        for "{searchQuery}"
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-1">
                                <Button
                                    variant={iconSize === 'small' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setIconSize('small')}
                                    className={iconSize === 'small' ? 'bg-[#D78E59] text-[#171717]' : 'text-[#828288] hover:text-[#EDECF8]'}
                                >
                                    S
                                </Button>
                                <Button
                                    variant={iconSize === 'medium' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setIconSize('medium')}
                                    className={iconSize === 'medium' ? 'bg-[#D78E59] text-[#171717]' : 'text-[#828288] hover:text-[#EDECF8]'}
                                >
                                    M
                                </Button>
                                <Button
                                    variant={iconSize === 'large' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setIconSize('large')}
                                    className={iconSize === 'large' ? 'bg-[#D78E59] text-[#171717]' : 'text-[#828288] hover:text-[#EDECF8]'}
                                >
                                    L
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full">
                                    <div className="pb-20">
                                        <div className={`flex flex-wrap gap-4 justify-center sm:justify-start`}>
                                            {filteredIcons.map((iconData, index) => (
                                                <IconButton
                                                    key={`${iconData.name}-${index}`}
                                                    iconData={iconData}
                                                    isSelected={selectedIcon === iconData.name}
                                                    onSelect={() => onIconSelect(iconData.name)}
                                                    size={iconSize}
                                                />
                                            ))}
                                        </div>
                                        {filteredIcons.length === 0 && (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <Package className="h-12 w-12 text-[#575757] mx-auto mb-4" />
                                                    <div className="text-[#575757] mb-2">No icons found</div>
                                                    <div className="text-sm text-[#575757]">
                                                        Try adjusting your search criteria
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Selected Icon Preview - Fixed at bottom */}
                            {selectedIcon && (
                                <div className="flex-shrink-0 mt-4 p-4 bg-[#090909] rounded-lg border border-[#575757]">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-[#D78E59] rounded-lg flex-shrink-0">
                                            {ICON_MAP[selectedIcon] &&
                                                createElement(ICON_MAP[selectedIcon], {
                                                    className: "h-6 w-6 text-[#171717]"
                                                })
                                            }
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium text-[#EDECF8] truncate">Selected Icon</div>
                                            <div className="text-xs text-[#828288] truncate">{selectedIcon}</div>
                                        </div>
                                        <Badge variant="secondary" className="bg-[#D78E59] text-[#171717] flex-shrink-0">
                                            Selected
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ResponsiveModal>
    );
}

// Individual icon button component
interface IconButtonProps
{
    iconData: IconData;
    isSelected: boolean;
    onSelect: () => void;
    size: 'small' | 'medium' | 'large';
}

function IconButton({ iconData, isSelected, onSelect, size }: IconButtonProps)
{
    const IconComponent = iconData.icon;

    const buttonSizes = {
        small: 'w-12 h-12 p-2',
        medium: 'w-16 h-16 p-3',
        large: 'w-20 h-20 p-4'
    };

    const iconSizes = {
        small: 'w-8 h-8',
        medium: 'w-10 h-10',
        large: 'w-12 h-12'
    };

    return (
        <button
            onClick={onSelect}
            className={`${buttonSizes[size]} rounded-lg border-2 transition-all duration-200 hover:scale-105 flex items-center justify-center ${isSelected
                ? 'border-[#D78E59] bg-[#D78E59]/20'
                : 'border-[#202020] bg-[#090909] hover:border-[#575757] hover:bg-[#202020]'
                }`}
            title={`${iconData.name} (${iconData.keywords.join(', ')})`}
        >
            <IconComponent
                className={`${iconSizes[size]} flex-shrink-0 ${isSelected ? 'text-[#D78E59]' : 'text-[#828288] hover:text-[#EDECF8]'
                    }`}
            />
        </button>
    );
}