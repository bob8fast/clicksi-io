'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱'
  },
  {
    code: 'ua',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦'
  }
]

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && LANGUAGES.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    // Save to localStorage
    localStorage.setItem('preferred-language', languageCode)
    setCurrentLanguage(languageCode)
    setIsOpen(false)

    // Set a cookie for server-side usage (optional)
    document.cookie = `language=${languageCode}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year

    // Refresh the current page to load content in the new language
    router.refresh()

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: languageCode }
    }))
  }

  const currentLang = LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-gray-2 hover:text-light hover:bg-accent transition-colors"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline text-sm">
            {currentLang.flag} {currentLang.code.toUpperCase()}
          </span>
          <span className="sm:hidden">
            {currentLang.flag}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-0 bg-secondary border border-accent"
        align="end"
        sideOffset={8}
      >
        <div className="p-1">
          <div className="px-3 py-2 text-sm font-medium text-light border-b border-accent">
            Choose Language
          </div>
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="w-full px-3 py-2 text-left hover:bg-accent rounded-md transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-light">
                    {language.name}
                  </span>
                  <span className="text-xs text-gray-2">
                    {language.nativeName}
                  </span>
                </div>
              </div>
              {currentLanguage === language.code && (
                <Check className="h-4 w-4 text-orange" />
              )}
            </button>
          ))}
        </div>
        <div className="px-3 py-2 text-xs text-gray-2 border-t border-accent">
          Language preference is saved locally
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default LanguageSwitcher