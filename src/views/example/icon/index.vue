<script setup lang="ts">
import { ref, computed } from 'vue'

// 导入 Element Plus 图标集合
import epIcons from '@iconify-json/ep/icons.json'

// 所有图标名列表
const allIcons = Object.keys(epIcons.icons)

// 搜索
const search = ref('')
const filtered = computed(() => {
  if (!search.value) return allIcons
  const q = search.value.toLowerCase()
  return allIcons.filter(n => n.toLowerCase().includes(q))
})

// 分页（一次加载 80 个）
const PAGE = 80
const page = ref(0)
const visible = computed(() => filtered.value.slice(0, (page.value + 1) * PAGE))
const hasMore = computed(() => visible.value.length < filtered.value.length)

function loadMore() {
  if (hasMore.value) page.value++
}

function copy(name: string) {
  navigator.clipboard.writeText(name).then(() => {
    // 静默成功
  })
}
</script>

<template>
  <div class="icon-page">
    <el-card>
      <template #header>
        <div class="header">
          <span>图标示例</span>
          <el-input
            v-model="search"
            placeholder="搜索图标..."
            clearable
            style="width: 240px"
            @input="page = 0"
          >
            <template #prefix><i-ep-Search /></template>
          </el-input>
        </div>
      </template>

      <div class="icon-grid">
        <div
          v-for="name in visible"
          :key="name"
          class="icon-item"
          :title="name"
          @click="copy(name)"
        >
          <el-icon :size="28"><component :is="`i-ep-${name}`" /></el-icon>
          <span class="icon-name">{{ name }}</span>
        </div>
      </div>

      <div v-if="hasMore" class="load-more">
        <el-button @click="loadMore">加载更多</el-button>
      </div>

      <div v-if="filtered.length === 0" class="empty">
        <el-icon :size="48"><i-ep-Search /></el-icon>
        <p>未找到图标「{{ search }}」</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.icon-page {
  padding: 0;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}
.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.icon-item:hover {
  background: var(--el-fill-color-light);
}
.icon-name {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: center;
  word-break: break-all;
  max-width: 100px;
}
.load-more {
  text-align: center;
  padding: 16px;
}
.empty {
  text-align: center;
  padding: 48px;
  color: var(--el-text-color-secondary);
}
</style>
