"use client";
// SecuritySettings.tsx
import React, { useState, useEffect } from "react";
import { CheckCircleIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SecuritySettings: React.FC = () =>
{
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [fieldErrors, setFieldErrors] = useState<{current?: string; new?: string; confirm?: string}>({});

    // Password strength calculation
    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const getPasswordStrengthText = (strength: number) => {
        if (strength <= 2) return { text: 'Weak', color: 'text-red-400' };
        if (strength <= 4) return { text: 'Fair', color: 'text-yellow-400' };
        if (strength <= 5) return { text: 'Good', color: 'text-blue-400' };
        return { text: 'Strong', color: 'text-green-400' };
    };

    const getPasswordStrengthColor = (strength: number) => {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 4) return 'bg-yellow-500';
        if (strength <= 5) return 'bg-blue-500';
        return 'bg-green-500';
    };

    // Validation
    const validateField = (field: 'current' | 'new' | 'confirm', value: string) => {
        const errors = { ...fieldErrors };
        
        if (field === 'current') {
            if (!value.trim()) {
                errors.current = 'Current password is required';
            } else {
                delete errors.current;
            }
        }
        
        if (field === 'new') {
            if (!value) {
                errors.new = 'New password is required';
            } else if (value.length < 8) {
                errors.new = 'Password must be at least 8 characters';
            } else if (value === currentPassword) {
                errors.new = 'New password must be different from current password';
            } else {
                delete errors.new;
            }
        }
        
        if (field === 'confirm') {
            if (!value) {
                errors.confirm = 'Please confirm your new password';
            } else if (value !== newPassword) {
                errors.confirm = 'Passwords do not match';
            } else {
                delete errors.confirm;
            }
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Update password strength when new password changes
    useEffect(() => {
        if (newPassword) {
            setPasswordStrength(calculatePasswordStrength(newPassword));
        } else {
            setPasswordStrength(0);
        }
    }, [newPassword]);

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        // Reset states
        setError("");
        setSuccess(false);

        // Validate all fields
        const currentValid = validateField('current', currentPassword);
        const newValid = validateField('new', newPassword);
        const confirmValid = validateField('confirm', confirmPassword);
        
        if (!currentValid || !newValid || !confirmValid) {
            return;
        }

        setLoading(true);

        try
        {
            const response = await fetch("/api/user/password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            if (!response.ok)
            {
                const data = await response.json();
                throw new Error(data.error || "Failed to change password");
            }

            // Success
            setSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any)
        {
            setError(err.message || "An error occurred while changing your password");
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="max-w-4xl">
                <h2 className="text-2xl font-semibold text-[#EDECF8] mb-2">Security & Privacy</h2>
                <p className="text-[#828288] mb-6">
                    Update your password to maintain account security.
                </p>

            {success && (
                <div className="mt-4 p-4 bg-[#202020] border border-[#D78E59] rounded-lg">
                    <p className="text-[#D78E59] text-sm font-medium">
                        Your password has been changed successfully.
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
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-[#EDECF8] mb-2">
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                validateField('current', e.target.value);
                            }}
                            onBlur={(e) => validateField('current', e.target.value)}
                            required
                            className={`block w-full bg-[#202020] border rounded-lg px-3 py-2 pr-20 text-[#EDECF8] placeholder-[#828288] focus:ring-1 focus:outline-none transition-all duration-200 ${
                                fieldErrors.current 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                    : currentPassword && !fieldErrors.current
                                    ? 'border-green-500 focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                                    : 'border-[#575757] focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                            }`}
                            placeholder="Enter your current password"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                            {currentPassword && (
                                <div className="mr-2">
                                    {fieldErrors.current ? (
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="mr-3 text-[#828288] hover:text-[#EDECF8] transition-colors"
                                tabIndex={-1}
                            >
                                {showCurrentPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                    {fieldErrors.current && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            {fieldErrors.current}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-[#EDECF8] mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                validateField('new', e.target.value);
                                if (confirmPassword) {
                                    validateField('confirm', confirmPassword);
                                }
                            }}
                            onBlur={(e) => validateField('new', e.target.value)}
                            required
                            className={`block w-full bg-[#202020] border rounded-lg px-3 py-2 pr-20 text-[#EDECF8] placeholder-[#828288] focus:ring-1 focus:outline-none transition-all duration-200 ${
                                fieldErrors.new 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                    : newPassword && !fieldErrors.new
                                    ? 'border-green-500 focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                                    : 'border-[#575757] focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                            }`}
                            placeholder="Enter your new password"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                            {newPassword && (
                                <div className="mr-2">
                                    {fieldErrors.new ? (
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="mr-3 text-[#828288] hover:text-[#EDECF8] transition-colors"
                                tabIndex={-1}
                            >
                                {showNewPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                    {newPassword && (
                        <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-[#828288]">Password strength</span>
                                <span className={`text-xs font-medium ${getPasswordStrengthText(passwordStrength).color}`}>
                                    {getPasswordStrengthText(passwordStrength).text}
                                </span>
                            </div>
                            <div className="w-full bg-[#202020] rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                                    style={{ width: `${(passwordStrength / 6) * 100}%` }}
                                ></div>
                            </div>
                            <div className="mt-1 text-xs text-[#828288]">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className={newPassword.length >= 8 ? 'text-green-400' : 'text-[#828288]'}>
                                        ✓ 8+ characters
                                    </span>
                                    <span className={/[A-Z]/.test(newPassword) ? 'text-green-400' : 'text-[#828288]'}>
                                        ✓ Uppercase
                                    </span>
                                    <span className={/[a-z]/.test(newPassword) ? 'text-green-400' : 'text-[#828288]'}>
                                        ✓ Lowercase
                                    </span>
                                    <span className={/[0-9]/.test(newPassword) ? 'text-green-400' : 'text-[#828288]'}>
                                        ✓ Number
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {fieldErrors.new && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            {fieldErrors.new}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#EDECF8] mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                validateField('confirm', e.target.value);
                            }}
                            onBlur={(e) => validateField('confirm', e.target.value)}
                            required
                            className={`block w-full bg-[#202020] border rounded-lg px-3 py-2 pr-20 text-[#EDECF8] placeholder-[#828288] focus:ring-1 focus:outline-none transition-all duration-200 ${
                                fieldErrors.confirm 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                    : confirmPassword && !fieldErrors.confirm && confirmPassword === newPassword
                                    ? 'border-green-500 focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                                    : 'border-[#575757] focus:border-[#D78E59] focus:ring-[#D78E59]/20'
                            }`}
                            placeholder="Confirm your new password"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                            {confirmPassword && (
                                <div className="mr-2">
                                    {fieldErrors.confirm ? (
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                    ) : confirmPassword === newPassword && confirmPassword ? (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    ) : null}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="mr-3 text-[#828288] hover:text-[#EDECF8] transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                    {fieldErrors.confirm && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            {fieldErrors.confirm}
                        </p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || Object.keys(fieldErrors).length > 0 || !currentPassword || !newPassword || !confirmPassword || passwordStrength <= 2}
                        className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-lg transition-all duration-200 ${
                            loading || Object.keys(fieldErrors).length > 0 || !currentPassword || !newPassword || !confirmPassword || passwordStrength <= 2
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
                                Changing Password...
                            </>
                        ) : (
                            "Change Password"
                        )}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default SecuritySettings;