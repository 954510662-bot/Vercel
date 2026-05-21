import { useState } from 'react'
import { useI18n, languageNames, Language } from '../i18n'
import { Globe, ChevronDown } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  
  const languages: Language[] = ['en', 'zh', 'es']
  
  const handleSelect = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors"
        title={t('settings.language')}
      >
        <Globe size={18} />
        <span className="text-sm">{languageNames[language]}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-lg py-1 min-w-[140px] z-50 border border-gray-700">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelect(lang)}
                className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between transition-colors ${
                  language === lang
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{languageNames[lang]}</span>
                {language === lang && (
                  <span className="text-blue-300">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher
