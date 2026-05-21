import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useI18n, languageNames, createI18nHook, Language } from '../i18n'

describe('i18n', () => {
  describe('useI18n hook', () => {
    it('should return default language as English', () => {
      const { result } = renderHook(() => useI18n())
      expect(result.current.language).toBe('en')
    })

    it('should change language', () => {
      const { result } = renderHook(() => useI18n())
      
      act(() => {
        result.current.setLanguage('zh')
      })
      
      expect(result.current.language).toBe('zh')
    })

    it('should translate key to Chinese', () => {
      const { result } = renderHook(() => useI18n())
      
      act(() => {
        result.current.setLanguage('zh')
      })
      
      expect(result.current.t('toolbar.newProject')).toBe('新建项目')
    })

    it('should translate key to Spanish', () => {
      const { result } = renderHook(() => useI18n())
      
      act(() => {
        result.current.setLanguage('es')
      })
      
      expect(result.current.t('toolbar.undo')).toBe('Deshacer')
    })

    it('should return key if translation not found', () => {
      const { result } = renderHook(() => useI18n())
      
      expect(result.current.t('nonexistent.key')).toBe('nonexistent.key')
    })

    it('should translate nested keys', () => {
      const { result } = renderHook(() => useI18n())
      
      act(() => {
        result.current.setLanguage('en')
      })
      
      expect(result.current.t('app.name')).toBe('CodeBrush')
      expect(result.current.t('messages.projectCreated')).toBe('Project created successfully')
    })
  })

  describe('languageNames', () => {
    it('should have correct language names', () => {
      expect(languageNames.en).toBe('English')
      expect(languageNames.zh).toBe('中文')
      expect(languageNames.es).toBe('Español')
    })

    it('should have all supported languages', () => {
      const languages: Language[] = ['en', 'zh', 'es']
      languages.forEach(lang => {
        expect(languageNames[lang]).toBeDefined()
        expect(typeof languageNames[lang]).toBe('string')
      })
    })
  })

  describe('createI18nHook', () => {
    it('should create a hook for specific language', () => {
      const useChinese = createI18nHook('zh')
      
      expect(useChinese('toolbar.newProject')).toBe('新建项目')
    })

    it('should work with English', () => {
      const useEnglish = createI18nHook('en')
      
      expect(useEnglish('toolbar.newProject')).toBe('New Project')
    })

    it('should work with Spanish', () => {
      const useSpanish = createI18nHook('es')
      
      expect(useSpanish('toolbar.newProject')).toBe('Nuevo Proyecto')
    })
  })

  describe('complete translations', () => {
    it('should have all toolbar translations in Chinese', () => {
      const { result } = renderHook(() => useI18n())
      
      act(() => {
        result.current.setLanguage('zh')
      })
      
      expect(result.current.t('toolbar.selectTool')).toBe('选择工具')
      expect(result.current.t('toolbar.rectangleTool')).toBe('矩形工具')
      expect(result.current.t('toolbar.ellipseTool')).toBe('椭圆工具')
      expect(result.current.t('toolbar.export')).toBe('导出')
    })

    it('should have all editor translations in Chinese', () => {
      const { result } = renderHook(() => useI18n())
      
      act(() => {
        result.current.setLanguage('zh')
      })
      
      expect(result.current.t('editor.welcome')).toBe('欢迎使用 CodeBrush')
      expect(result.current.t('editor.createProject')).toBe('点击左侧 "+" 按钮创建新项目')
    })

    it('should have all editor translations in Spanish', () => {
      const { result } = renderHook(() => useI18n())
      
      act(() => {
        result.current.setLanguage('es')
      })
      
      expect(result.current.t('editor.welcome')).toBe('Bienvenido a CodeBrush')
      expect(result.current.t('editor.createProject')).toBe('Haz clic en el botón + para crear un nuevo proyecto')
    })
  })
})
