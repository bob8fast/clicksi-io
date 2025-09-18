'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to get the user's preferred language from localStorage
 * Falls back to 'en' if no preference is set
 */
export const usePreferredLanguage = () => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    // Get saved language preference
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && ['en', 'pl', 'ua'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  return language
}

/**
 * Server-side function to get language from cookies
 * Use this in server components
 */
export const getLanguageFromCookies = (cookieString?: string): string => {
  if (!cookieString) return 'en'

  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  const language = cookies.language
  return ['en', 'pl', 'ua'].includes(language) ? language : 'en'
}