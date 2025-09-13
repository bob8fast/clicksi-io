// utils/validation.ts

export interface ValidationRules
{
    [key: string]: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        validate?: (value: any, formData?: any) => boolean;
        message?: string;
    };
}

export const validateForm = (
    data: Record<string, any>,
    rules: ValidationRules
): Record<string, string> =>
{
    const errors: Record<string, string> = {};

    Object.keys(rules).forEach(fieldName =>
    {
        const value = data[fieldName];
        const fieldRules = rules[fieldName];

        // Required validation
        if (fieldRules.required && (!value || (Array.isArray(value) && value.length === 0)))
        {
            errors[fieldName] = fieldRules.message || `${fieldName} is required`;
            return;
        }

        // Skip other validations if field is empty and not required
        if (value === undefined || value === null || value === '')
        {
            return;
        }

        // String validations
        if (typeof value === 'string')
        {
            // Min length
            if (fieldRules.minLength && value.length < fieldRules.minLength)
            {
                errors[fieldName] = fieldRules.message || `${fieldName} must be at least ${fieldRules.minLength} characters`;
                return;
            }

            // Max length
            if (fieldRules.maxLength && value.length > fieldRules.maxLength)
            {
                errors[fieldName] = fieldRules.message || `${fieldName} must be less than ${fieldRules.maxLength} characters`;
                return;
            }

            // Pattern
            if (fieldRules.pattern && !fieldRules.pattern.test(value))
            {
                errors[fieldName] = fieldRules.message || `${fieldName} is invalid`;
                return;
            }
        }

        // Custom validation
        if (fieldRules.validate && !fieldRules.validate(value, data))
        {
            errors[fieldName] = fieldRules.message || `${fieldName} is invalid`;
            return;
        }
    });

    return errors;
};

// Predefined validation rules
export const emailValidation = {
    required: true,
    pattern: /\S+@\S+\.\S+/,
    message: 'Please enter a valid email address',
};

export const passwordValidation = {
    required: true,
    minLength: 8,
    message: 'Password must be at least 8 characters',
};

export const confirmPasswordValidation = (passwordField: string) => ({
    required: true,
    validate: (value: string, formData: any) => value === formData[passwordField],
    message: 'Passwords do not match',
});

export const requiredField = (message?: string) => ({
    required: true,
    message,
});

export const urlValidation = {
    pattern: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[a-zA-Z0-9-.,;?'\\+&%$#=~_]*)*$/,
    message: 'Please enter a valid URL',
};