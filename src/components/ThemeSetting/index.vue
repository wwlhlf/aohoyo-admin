<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// 显示设置面板
const visible = ref(false)

// 主题预设
const presets = computed(() => themeStore.presets)

// 自定义颜色
const customColor = ref(themeStore.primaryColor)

// 选择主题色
const handleSelectColor = (color: string) => {
  themeStore.setPrimaryColor(color)
  customColor.value = color
}

// 自定义颜色变化
const handleCustomColorChange = (color: string) => {
  themeStore.setPrimaryColor(color)
}

// 切换暗黑模式
const handleToggleDark = () => {
  themeStore.toggleDark()
}

// 圆角变化
const handleBorderRadiusChange = (val: number) => {
  themeStore.setBorderRadius(val)
}

// 打开设置
const open = () => {
  visible.value = true
}

// 暴露方法
defineExpose({ open })
</script>

<template>
  <el-drawer v-model="visible" title="主题设置" size="300px">
    <div class="theme-setting">
      <!-- 暗黑模式 -->
      <div class="setting-item">
        <span class="label">暗黑模式</span>
        <el-switch
          :model-value="themeStore.mode === 'dark'"
          @change="handleToggleDark"
        />
      </div>

      <!-- 主题色 -->
      <div class="setting-item">
        <span class="label">主题色</span>
        <div class="color-list">
          <div
            v-for="preset in presets"
            :key="preset.primary"
            class="color-item"
            :class="{ active: themeStore.primaryColor === preset.primary }"
            :style="{ backgroundColor: preset.primary }"
            @click="handleSelectColor(preset.primary)"
          >
            <el-icon v-if="themeStore.primaryColor === preset.primary" color="#fff">
              <Check />
            </el-icon>
          </div>
          <!-- 自定义颜色 -->
          <el-color-picker
            v-model="customColor"
            :teleported="false"
            @change="handleCustomColorChange"
          />
        </div>
      </div>

      <!-- 侧边栏主题 -->
      <div class="setting-item">
        <span class="label">侧边栏主题</span>
        <el-radio-group
          :model-value="themeStore.sidebarTheme"
          @change="(val: string) => themeStore.setSidebarTheme(val as 'light' | 'dark')"
        >
          <el-radio value="light">浅色</el-radio>
          <el-radio value="dark">深色</el-radio>
        </el-radio-group>
      </div>

      <!-- 头部主题 -->
      <div class="setting-item">
        <span class="label">头部主题</span>
        <el-radio-group
          :model-value="themeStore.headerTheme"
          @change="(val: string) => themeStore.setHeaderTheme(val as 'light' | 'dark')"
        >
          <el-radio value="light">浅色</el-radio>
          <el-radio value="dark">深色</el-radio>
        </el-radio-group>
      </div>

      <!-- 圆角大小 -->
      <div class="setting-item">
        <span class="label">圆角大小: {{ themeStore.borderRadius }}px</span>
        <el-slider
          :model-value="themeStore.borderRadius"
          :min="0"
          :max="16"
          :step="1"
          @input="handleBorderRadiusChange"
        />
      </div>

      <!-- 动画效果 -->
      <div class="setting-item">
        <span class="label">动画效果</span>
        <el-switch
          :model-value="themeStore.animation"
          @change="themeStore.toggleAnimation"
        />
      </div>

      <!-- 灰色模式 -->
      <div class="setting-item">
        <span class="label">灰色模式</span>
        <el-switch
          :model-value="themeStore.grayMode"
          @change="themeStore.toggleGrayMode"
        />
      </div>

      <!-- 色弱模式 -->
      <div class="setting-item">
        <span class="label">色弱模式</span>
        <el-switch
          :model-value="themeStore.colorWeak"
          @change="themeStore.toggleColorWeak"
        />
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.theme-setting {
  padding: 0 20px;
}

.setting-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.label {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-color-primary);
}

.color-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.color-item {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.active {
  border-color: var(--el-color-primary);
}

/* 颜色选择器样式 */
:deep(.el-color-picker) {
  width: 32px;
  height: 32px;
}

:deep(.el-color-picker__trigger) {
  width: 32px !important;
  height: 32px !important;
  border-radius: 4px !important;
  padding: 0 !important;
}

:deep(.el-color-picker__color) {
  border-radius: 4px !important;
}
</style>