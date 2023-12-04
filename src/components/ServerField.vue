<template>
  <div class="row-span-1 bg-white flex flex-col rounded-md">
    <ttl>
      Server
      <template #extra>
        <el-popover placement="top-start" trigger="hover">
          <div class="text-center">Add Server</div>

          <template #reference>
            <button>
              <el-icon :size="18" color="#255359">
                <Add12Regular />
              </el-icon>
            </button>
          </template>
        </el-popover>
      </template>
    </ttl>

    <div class="w-full h-4 flex-grow overflow-y-auto rounded-md p-2 mt-2">
      <ul class="w-full">
        <li v-for="s in servers" :key="s.id">
          <!-- TODO: forgot why defined id here, recall later -->
          <serverItem :id="s.id" :name="s.name" :url="s.url" @changeSelectedSrv="updateOnServer" />
          <!--TODO: ADD LISTEN TASK OP-->
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import ttl from '@/components/HeadTitle.vue'
import { Add12Regular } from '@vicons/fluent'
import { inject, type Ref } from 'vue'
import { Server, } from '../components/serverInfo'
import serverItem from './ServerItem.vue'

const servers = inject('servers') as Ref<Server[]>

let emit = defineEmits<{
  (e: 'onServerChange', id: number): void
}>()



const updateOnServer = (id: number) => {
  emit('onServerChange', id);
  console.log(`Selected Server Updated -> ${id}`);
};
</script>
