<template>
    <n-dropdown :options="options">
        <n-button>
            <!-- <n-icon size="20" color="#255359">
                <Open16Filled class="bg-slate-300" />
            </n-icon> -->

        </n-button>
    </n-dropdown>
</template>
  
<script lang="ts">
import { h, defineComponent } from 'vue'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import {
    Edit16Regular as EditIcon,
    Delete16Regular as DeleteIcon,
    Open16Filled as Open16Filled
} from '@vicons/fluent'

const renderIcon = (icon: Component) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        })
    }
}

export default defineComponent({
    setup() {
        return {
            options: [

                {
                    label: 'Edit',
                    key: 'editServer',
                    icon: renderIcon(EditIcon)
                },
                {
                    label: 'Delete',
                    key: 'deleteServer',
                    icon: renderIcon(DeleteIcon)
                }
            ]
        }
    }
})
</script>
