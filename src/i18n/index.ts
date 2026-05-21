import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import en from './en.json'
import zh from './zh.json'
import es from './es.json'

export type Language = 'en' | 'zh' | 'es'

export interface TranslationKeys {
  app: typeof en.app
  toolbar: typeof en.toolbar
  layers: typeof en.layers
  properties: typeof en.properties
  editor: typeof en.editor
  actions: typeof en.actions
  shortcuts: typeof en.shortcuts
  settings: typeof en.settings
  messages: typeof en.messages
  dialogs: typeof en.dialogs
}

const translations: Record<Language, TranslationKeys> = {
  en: en as TranslationKeys,
  zh: zh as TranslationKeys,
  es: es as TranslationKeys
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español'
}

interface I18nState {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let result: unknown = obj
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  
  return typeof result === 'string' ? result : path
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en',
      
      setLanguage: (lang: Language) => {
        set({ language: lang })
      },
      
      t: (key: string) => {
        const { language } = get()
        const translation = translations[language]
        const value = getNestedValue(translation as unknown as Record<string, unknown>, key)
        return value
      }
    }),
    {
      name: 'codebrush-i18n'
    }
  )
)

export function createI18nHook(language: Language) {
  return (key: string): string => {
    const translation = translations[language]
    return getNestedValue(translation as unknown as Record<string, unknown>, key)
  }
}

export default useI18n
