<template>
    <div class="flex items-center ml-1 mt-1">
        <n-icon size="27" color="#A8D8B9">
            <Square12Regular />
        </n-icon>
        <div class="flex items-center flex-col h-full">
            <div class="font-sans items-center pt-px font-normal whitespace-nowrap text-xl">
                <p class="text-empress-900">
                    <slot></slot>
                </p>
            </div>
        </div>

        <div class="flex items-center w-full justify-end mr-1">

            <slot name="extra"></slot>

        </div>

    </div>
</template>

<script setup lang="ts">
import { Square12Regular } from '@vicons/fluent'
</script>
