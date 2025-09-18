'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface LanguageContextType {
  currentLanguage: string
  setLanguage: (language: string) => void
  availableLanguages: string[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const availableLanguages = ['en', 'pl', 'ua']

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }

    // Listen for language change events
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  const setLanguage = (language: string) => {
    if (availableLanguages.includes(language)) {
      setCurrentLanguage(language)
      localStorage.setItem('preferred-language', language)

      // Set cookie for server-side usage
      document.cookie = `language=${language}; path=/; max-age=${60 * 60 * 24 * 365}`

      // Dispatch event
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language }
      }))
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}