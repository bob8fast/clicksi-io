// components/features/commission/formulas/FormulaKeywordsHelper.tsx - Available Keywords Helper

'use client';

import { useState, useEffect } from 'react';
import { Search, Book, Calculator, Shield, Code, AlertCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface KeywordCategory {
  name: string;
  icon: React.ReactNode;
  keywords: KeywordInfo[];
}

interface KeywordInfo {
  keyword: string;
  description: string;
  example?: string;
  type: 'variable' | 'function' | 'operator';
  category?: string;
}

// Mock data - in real implementation, this would come from API
const KEYWORD_CATEGORIES: KeywordCategory[] = [
  {
    name: 'Variables',
    icon: <Code className="h-4 w-4" />,
    keywords: [
      {
        keyword: 'sale_amount',
        description: 'Total sale amount for the transaction',
        example: 'sale_amount * 0.05',
        type: 'variable',
      },
      {
        keyword: 'order_value',
        description: 'Total order value including taxes',
        example: 'order_value > 100 ? 0.08 : 0.05',
        type: 'variable',
      },
      {
        keyword: 'product_price',
        description: 'Individual product price',
        example: 'product_price * quantity * 0.03',
        type: 'variable',
      },
      {
        keyword: 'quantity',
        description: 'Number of items in the order',
        example: 'quantity > 5 ? sale_amount * 0.07 : sale_amount * 0.05',
        type: 'variable',
      },
      {
        keyword: 'product_id',
        description: 'Unique product identifier',
        example: 'product_id == "123" ? 0.08 : 0.05',
        type: 'variable',
      },
      {
        keyword: 'category_id',
        description: 'Product category identifier',
        example: 'category_id == "electronics" ? 0.06 : 0.04',
        type: 'variable',
      },
      {
        keyword: 'creator_tier',
        description: 'Creator tier level (1-5)',
        example: 'sale_amount * (creator_tier / 100)',
        type: 'variable',
      },
      {
        keyword: 'partnership_rate',
        description: 'Partnership-specific commission rate',
        example: 'sale_amount * partnership_rate',
        type: 'variable',
      },
      {
        keyword: 'min_order_value',
        description: 'Minimum order value requirement',
        example: 'order_value >= min_order_value ? 0.06 : 0',
        type: 'variable',
      },
      {
        keyword: 'max_order_value',
        description: 'Maximum order value cap',
        example: 'min(order_value, max_order_value) * 0.05',
        type: 'variable',
      },
    ],
  },
  {
    name: 'Functions',
    icon: <Calculator className="h-4 w-4" />,
    keywords: [
      {
        keyword: 'max(a, b)',
        description: 'Returns the maximum of two values',
        example: 'max(sale_amount * 0.03, 5)',
        type: 'function',
      },
      {
        keyword: 'min(a, b)',
        description: 'Returns the minimum of two values',
        example: 'min(sale_amount * 0.08, 100)',
        type: 'function',
      },
      {
        keyword: 'round(x)',
        description: 'Rounds a number to the nearest integer',
        example: 'round(sale_amount * 0.057)',
        type: 'function',
      },
      {
        keyword: 'abs(x)',
        description: 'Returns the absolute value',
        example: 'abs(sale_amount - 50)',
        type: 'function',
      },
      {
        keyword: 'ceiling(x)',
        description: 'Rounds up to the nearest integer',
        example: 'ceiling(sale_amount * 0.045)',
        type: 'function',
      },
      {
        keyword: 'floor(x)',
        description: 'Rounds down to the nearest integer',
        example: 'floor(sale_amount * 0.055)',
        type: 'function',
      },
    ],
  },
  {
    name: 'Operators',
    icon: <Book className="h-4 w-4" />,
    keywords: [
      {
        keyword: '+',
        description: 'Addition operator',
        example: 'sale_amount + bonus',
        type: 'operator',
      },
      {
        keyword: '-',
        description: 'Subtraction operator',
        example: 'sale_amount - discount',
        type: 'operator',
      },
      {
        keyword: '*',
        description: 'Multiplication operator',
        example: 'sale_amount * 0.05',
        type: 'operator',
      },
      {
        keyword: '/',
        description: 'Division operator',
        example: 'sale_amount / 100',
        type: 'operator',
      },
      {
        keyword: '%',
        description: 'Modulo operator (remainder)',
        example: 'sale_amount % 10',
        type: 'operator',
      },
      {
        keyword: '==',
        description: 'Equal comparison',
        example: 'category_id == "premium"',
        type: 'operator',
      },
      {
        keyword: '!=',
        description: 'Not equal comparison',
        example: 'product_id != "excluded"',
        type: 'operator',
      },
      {
        keyword: '>',
        description: 'Greater than comparison',
        example: 'sale_amount > 100',
        type: 'operator',
      },
      {
        keyword: '<',
        description: 'Less than comparison',
        example: 'quantity < 5',
        type: 'operator',
      },
      {
        keyword: '>=',
        description: 'Greater than or equal',
        example: 'order_value >= 50',
        type: 'operator',
      },
      {
        keyword: '<=',
        description: 'Less than or equal',
        example: 'creator_tier <= 3',
        type: 'operator',
      },
      {
        keyword: '&&',
        description: 'Logical AND operator',
        example: 'sale_amount > 100 && quantity > 2',
        type: 'operator',
      },
      {
        keyword: '||',
        description: 'Logical OR operator',
        example: 'category_id == "premium" || quantity > 10',
        type: 'operator',
      },
      {
        keyword: '?:',
        description: 'Ternary conditional operator',
        example: 'sale_amount > 100 ? 0.08 : 0.05',
        type: 'operator',
      },
      {
        keyword: '()',
        description: 'Grouping parentheses',
        example: '(sale_amount + bonus) * 0.05',
        type: 'operator',
      },
    ],
  },
];

interface FormulaKeywordsHelperProps {
  onKeywordSelect?: (keyword: string) => void;
  className?: string;
}

export function FormulaKeywordsHelper({ onKeywordSelect, className }: FormulaKeywordsHelperProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<KeywordCategory[]>(KEYWORD_CATEGORIES);

  // Filter keywords based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(KEYWORD_CATEGORIES);
      return;
    }

    const filtered = KEYWORD_CATEGORIES.map(category => ({
      ...category,
      keywords: category.keywords.filter(
        keyword =>
          keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
          keyword.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          keyword.example?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    })).filter(category => category.keywords.length > 0);

    setFilteredCategories(filtered);
  }, [searchTerm]);

  // Handle keyword click
  const handleKeywordClick = (keyword: string) => {
    if (onKeywordSelect) {
      onKeywordSelect(keyword);
    }
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <h3 className="font-semibold text-sm">Formula Keywords Reference</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Available variables, functions, and operators for formula creation
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-8"
        />
      </div>

      {/* Security Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          All formulas are validated for security. Only approved keywords and functions are allowed.
        </AlertDescription>
      </Alert>

      {/* Keywords Tabs */}
      <Tabs defaultValue="variables" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {filteredCategories.map((category, index) => (
            <TabsTrigger 
              key={category.name} 
              value={category.name.toLowerCase()}
              className="text-xs"
            >
              <div className="flex items-center gap-1">
                {category.icon}
                {category.name}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredCategories.map((category) => (
          <TabsContent 
            key={category.name} 
            value={category.name.toLowerCase()} 
            className="mt-3"
          >
            <ScrollArea className="h-64">
              <div className="space-y-2 pr-4">
                {category.keywords.map((keyword, index) => (
                  <Card 
                    key={`${keyword.keyword}-${index}`} 
                    className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleKeywordClick(keyword.keyword)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className="font-mono text-xs"
                        >
                          {keyword.keyword}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className="text-xs capitalize"
                        >
                          {keyword.type}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {keyword.description}
                      </p>
                      
                      {keyword.example && (
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-muted-foreground">Example:</span>
                          <code className="block text-xs bg-muted/30 p-1 rounded font-mono">
                            {keyword.example}
                          </code>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {/* No Results */}
      {searchTerm && filteredCategories.every(cat => cat.keywords.length === 0) && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No keywords found matching "{searchTerm}"
          </p>
        </div>
      )}

      <Separator />

      {/* Quick Tips */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold">Quick Tips:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use parentheses to group operations: (a + b) * c</li>
          <li>• Combine functions: max(min(value, 100), 10)</li>
          <li>• Use ternary operator for conditions: a {'>'} 10 ? 0.08 : 0.05</li>
          <li>• All variables must be defined before use</li>
        </ul>
      </div>
    </div>
  );
}