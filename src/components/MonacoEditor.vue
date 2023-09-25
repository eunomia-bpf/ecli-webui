<template>
    <div ref="codeEditBox" class="codeEditBox" :class="hightChange && 'codeEditBox1'" />
</template>
<script lang="ts">
import {
    defineComponent, onBeforeUnmount, onMounted, ref, watch,
} from 'vue'

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as monaco from 'monaco-editor'
import { editorProps } from './monacoEditorType'

export default defineComponent({
    name: 'MonacoEditor',
    props: editorProps,
    emits: ['update:modelValue', 'change', 'editor-mounted'],
    setup(props, { emit }) {
        (self as any).MonacoEnvironment = {
            getWorker(_: string, label: string) {
                return new EditorWorker()
            },
        }
        let editor: any
        const codeEditBox = ref()

        const init = () => {
            editor = monaco.editor.create(codeEditBox.value, {
                value: props.modelValue,
                language: props.language,
                readOnly: props.readOnly,
                theme: props.theme,
                ...props.options,
            })

            // listen value change
            editor.onDidChangeModelContent(() => {
                const value = editor.getValue()
                emit('update:modelValue', value)
                emit('change', value)
            })

            emit('editor-mounted', editor)
        }
        watch(
            () => props.modelValue,
            (newValue) => {
                if (editor) {
                    const value = editor.getValue()
                    if (newValue !== value) {
                        editor.setValue(newValue)
                    }
                }
            },
        )

        watch(
            () => props.options,
            (newValue) => {
                editor.updateOptions(newValue)
            },
            { deep: true },
        )
        watch(
            () => props.readOnly,
            () => {
                console.log('props.readOnly', props.readOnly)
                editor.updateOptions({ readOnly: props.readOnly })
            },
            { deep: true },
        )

        watch(
            () => props.language,
            (newValue) => {
                monaco.editor.setModelLanguage(editor.getModel()!, newValue)
            },
        )

        onBeforeUnmount(() => {
            editor.dispose()
        })

        onMounted(() => {
            init()
        })

        return { codeEditBox }
    },
})
</script>
<style lang="scss" scoped>
.codeEditBox {
    width: 100%;
    flex: 1;
    min-height: 100px;
    // height: 200px;
    overflow-y: auto;
}

.codeEditBox1 {
    height: calc(100% - 323px);
}
</style>
  