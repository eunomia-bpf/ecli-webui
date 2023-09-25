import { type PropType } from 'vue'

export type Theme = 'vs' | 'hc-black' | 'vs-dark'
export type FoldingStrategy = 'auto' | 'indentation'
export type RenderLineHighlight = 'all' | 'line' | 'none' | 'gutter'
export interface Options {
    automaticLayout: boolean
    foldingStrategy: FoldingStrategy
    renderLineHighlight: RenderLineHighlight
    selectOnLineNumbers: boolean
    placeholder: string
    minimap: {

        enabled: boolean
    }

    fontSize: number
    scrollBeyondLastLine: boolean
    overviewRulerBorder: boolean
}

export const editorProps = {
    modelValue: {
        type: String as PropType<string>,
        default: null,
    },
    hightChange: {
        type: Boolean,
        default: false,
    },
    width: {
        type: [String, Number] as PropType<string | number>,
        default: '100%',
    },
    height: {
        type: [String, Number] as PropType<string | number>,
        default: '100%',
    },
    language: {
        type: String as PropType<string>,
        default: 'javascript',
    },
    readOnly: {
        type: Boolean,
        default: false,
    },
    theme: {
        type: String as PropType<Theme>,
        validator(value: string): boolean {
            return ['vs', 'hc-black', 'vs-dark', 'hc-light'].includes(value)
        },
        default: 'vs',
    },
    options: {
        type: Object as PropType<Options>,
        default() {
            return {
                automaticLayout: true,

                foldingStrategy: 'indentation',

                renderLineHighlight: 'all' || 'line' || 'none' || 'gutter',
                selectOnLineNumbers: true,
                minimap: {

                    enabled: true,
                },
                placeholder: 'ss',

                fontSize: 16,
                scrollBeyondLastLine: false,
                overviewRulerBorder: false,
            }
        },
    },
}
