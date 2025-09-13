"use client";
"use client";
// AccountSettings.tsx
import { UserInfo } from "@/types/next-auth";
import React, { useState, useEffect } from "react";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface AccountSettingsProps
{
    user: UserInfo;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) =>
{
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{name?: string; email?: string}>({});
    const [hasChanges, setHasChanges] = useState(false);
    const [isValid, setIsValid] = useState(true);

    // Form validation
    const validateField = (field: 'name' | 'email', value: string) => {
        const errors = { ...fieldErrors };
        
        if (field === 'name') {
            if (!value.trim()) {
                errors.name = 'Name is required';
            } else if (value.trim().length < 2) {
                errors.name = 'Name must be at least 2 characters';
            } else {
                delete errors.name;
            }
        }
        
        if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) {
                errors.email = 'Email is required';
            } else if (!emailRegex.test(value)) {
                errors.email = 'Please enter a valid email address';
            } else {
                delete errors.email;
            }
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Check for changes and validation
    useEffect(() => {
        const nameChanged = name !== (user.name || "");
        const emailChanged = email !== (user.email || "");
        const hasFieldChanges = nameChanged || emailChanged;
        const hasNoErrors = Object.keys(fieldErrors).length === 0;
        const hasValidFields = name.trim().length > 0 && email.trim().length > 0;
        
        setHasChanges(hasFieldChanges);
        setIsValid(hasNoErrors && hasValidFields);
    }, [name, email, fieldErrors, user.name, user.email]);

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        
        // Validate all fields
        const nameValid = validateField('name', name);
        const emailValid = validateField('email', email);
        
        if (!nameValid || !emailValid) {
            return;
        }
        
        setLoading(true);
        setSuccess(false);
        setError("");

        try
        {
            // This would be replaced with your actual API call
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                }),
            });

            if (!response.ok)
            {
                throw new Error("Failed to update profile");
            }

            setSuccess(true);
        } catch (err)
        {
            setError("Failed to update profile. Please try again later.");
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="max-w-4xl">
                <h2 className="text-2xl font-semibold text-[#EDECF8] mb-2">General Information</h2>
                <p className="text-[#828288] mb-6">
                    Update your account information and email preferences.
                </p>

            {success && (
                <div className="mt-4 p-4 bg-[#202020] border border-[#D78E59] rounded-lg">
                    <p className="text-[#D78E59] text-sm font-medium">
                        Your profile has been updated successfully.
                    </p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-[#202020] border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[#EDECF8] mb-2"
                    >
                        Full Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                validateField('name', e.target.value);
                            }}
                            onBlur={(e) => validateField('name', e.target.value)}
                            className={`block w-full bg-[#202020] border rounded-lg px-3 py-2 pr-10 text-[#EDECF8] placeholder-[#828288] focus:ring-1 focus:outline-none transition-all duration-200 ${
                                fieldErrors.name 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                    : name.trim() && !fieldErrors.name
                                    ? 'border-green-500 focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                                    : 'border-[#575757] focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                            }`}
                            placeholder="Enter your full name"
                        />
                        {name.trim() && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {fieldErrors.name ? (
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                ) : (
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                )}
                            </div>
                        )}
                    </div>
                    {fieldErrors.name && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            {fieldErrors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#EDECF8] mb-2"
                    >
                        Email Address
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateField('email', e.target.value);
                            }}
                            onBlur={(e) => validateField('email', e.target.value)}
                            className={`block w-full bg-[#202020] border rounded-lg px-3 py-2 pr-10 text-[#EDECF8] placeholder-[#828288] focus:ring-1 focus:outline-none transition-all duration-200 ${
                                fieldErrors.email 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                    : email.trim() && !fieldErrors.email
                                    ? 'border-green-500 focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                                    : 'border-[#575757] focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                            }`}
                            placeholder="Enter your email address"
                        />
                        {email.trim() && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {fieldErrors.email ? (
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                ) : (
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                )}
                            </div>
                        )}
                    </div>
                    {fieldErrors.email && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            {fieldErrors.email}
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-sm text-[#828288]">
                        {hasChanges && (
                            <span className="text-[#D78E59]">
                                • You have unsaved changes
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !hasChanges || !isValid}
                        className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-lg transition-all duration-200 ${
                            loading || !hasChanges || !isValid
                                ? 'bg-[#575757] text-[#828288] cursor-not-allowed'
                                : 'text-[#171717] bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59] hover:shadow-lg transform hover:scale-105'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default AccountSettings;