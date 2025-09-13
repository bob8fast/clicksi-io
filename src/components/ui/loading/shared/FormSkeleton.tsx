// components/ui/loading/shared/FormSkeleton.tsx - Reusable Form Section Skeleton

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface FormFieldProps {
  type?: 'input' | 'textarea' | 'select' | 'date' | 'checkbox-group' | 'grid';
  label?: boolean;
  help?: boolean;
  width?: 'full' | 'half' | 'third';
}

interface FormSkeletonProps {
  title?: string | boolean;
  description?: boolean;
  fields?: FormFieldProps[];
  showActions?: boolean;
  className?: string;
}

const defaultFields: FormFieldProps[] = [
  { type: 'input', label: true },
  { type: 'textarea', label: true, help: true },
  { type: 'select', label: true },
];

export function FormSkeleton({ 
  title = true,
  description = true,
  fields = defaultFields,
  showActions = true,
  className 
}: FormSkeletonProps) {
  const renderField = (field: FormFieldProps, index: number) => {
    const widthClasses = {
      full: 'col-span-full',
      half: 'col-span-full md:col-span-1',
      third: 'col-span-full md:col-span-1 lg:col-span-1'
    };

    return (
      <div key={index} className={`space-y-2 ${widthClasses[field.width || 'full']}`}>
        {field.label && <Skeleton className="h-4 w-20" />}
        
        {field.type === 'input' && <Skeleton className="h-10 w-full" />}
        
        {field.type === 'textarea' && <Skeleton className="h-20 w-full" />}
        
        {field.type === 'select' && <Skeleton className="h-10 w-full" />}
        
        {field.type === 'date' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        
        {field.type === 'checkbox-group' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {field.type === 'grid' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        )}
        
        {field.help && <Skeleton className="h-3 w-full" />}
      </div>
    );
  };

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && (
            <Skeleton className="h-6 w-40" />
          )}
          {description && (
            <Skeleton className="h-4 w-64" />
          )}
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {fields.length <= 2 ? (
          // Simple layout for few fields
          <div className="space-y-4">
            {fields.map((field, index) => renderField(field, index))}
          </div>
        ) : (
          // Grid layout for many fields
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field, index) => renderField(field, index))}
          </div>
        )}
        
        {showActions && (
          <>
            <div className="h-px bg-[#202020] my-6" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Predefined form skeletons for common use cases
export function BasicFormSkeleton(props: Omit<FormSkeletonProps, 'fields'>) {
  return (
    <FormSkeleton 
      {...props} 
      fields={[
        { type: 'input', label: true, width: 'half' },
        { type: 'input', label: true, width: 'half' },
        { type: 'textarea', label: true, help: true },
        { type: 'select', label: true }
      ]} 
    />
  );
}

export function AdvancedFormSkeleton(props: Omit<FormSkeletonProps, 'fields'>) {
  return (
    <FormSkeleton 
      {...props} 
      fields={[
        { type: 'grid', label: true },
        { type: 'textarea', label: true },
        { type: 'date', label: true },
        { type: 'checkbox-group', label: true },
        { type: 'select', label: true, help: true }
      ]} 
    />
  );
}