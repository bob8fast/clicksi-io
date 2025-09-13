// types/demo-request.ts
import { z } from 'zod';

// Demo request form schema
export const demoRequestSchema = z.object({
  // Contact information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  
  // Company information
  companyName: z.string().min(1, 'Company name is required'),
  website: z.string().url('Please enter a valid company website').optional().or(z.literal('')),
  role: z.string().min(1, 'Your role is required'),
  businessType: z.enum(['Brand', 'Retailer'], {
    errorMap: () => ({ message: 'Please select your business type' }),
  }),
  
  // Business details
  employeeCount: z.enum(['1-10', '11-50', '51-200', '201-500', '500+'], {
    errorMap: () => ({ message: 'Please select company size' }),
  }),
  annualRevenue: z.enum(['<$1M', '$1M-$5M', '$5M-$25M', '$25M-$100M', '$100M+'], {
    errorMap: () => ({ message: 'Please select annual revenue range' }),
  }).optional(),
  
  // Specific interests
  interests: z.array(z.string()).min(1, 'Please select at least one area of interest'),
  
  // Message
  message: z.string().optional(),
  
  // Consent
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to be contacted',
  }),
  
  // For retailers - brands they work with
  partnerBrands: z.string().optional(),
  
  // For brands - distribution method
  distributionMethod: z.enum(['Direct', 'Retailers', 'Both']).optional(),
});

export type DemoRequestData = z.infer<typeof demoRequestSchema>;

// Interest options
export const interestOptions = [
  { value: 'analytics', label: 'Analytics & Insights' },
  { value: 'campaign', label: 'Campaign Management' },
  { value: 'influencer', label: 'Influencer Marketing' },
  { value: 'retail', label: 'Retail Partnership' },
  { value: 'automation', label: 'Marketing Automation' },
  { value: 'social', label: 'Social Commerce' },
  { value: 'loyalty', label: 'Customer Loyalty' },
  { value: 'other', label: 'Other' },
];

// Employee count options
export const employeeCountOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
];

// Annual revenue options
export const annualRevenueOptions = [
  { value: '<$1M', label: 'Less than $1M' },
  { value: '$1M-$5M', label: '$1M - $5M' },
  { value: '$5M-$25M', label: '$5M - $25M' },
  { value: '$25M-$100M', label: '$25M - $100M' },
  { value: '$100M+', label: 'More than $100M' },
];