<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div class="dashboard p-6">
    <h1 class="text-2xl font-bold mb-4">欢迎回来，{{ userStore.userInfo?.nickname || userStore.username || '用户' }}！</h1>

    <el-row :gutter="20" class="mb-6">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value text-primary">1,234</div>
            <div class="stat-label">今日访问</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value text-green-500">56</div>
            <div class="stat-label">新增用户</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value text-blue-500">89%</div>
            <div class="stat-label">系统负载</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value text-purple-500">99.9%</div>
            <div class="stat-label">系统可用性</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mb-6">
      <template #header>
        <span>快速开始</span>
      </template>
      <el-space wrap>
        <el-button type="primary">新建项目</el-button>
        <el-button>查看文档</el-button>
        <el-button>系统设置</el-button>
      </el-space>
    </el-card>

    <el-card>
      <template #header>
        <span>系统信息</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="框架版本">Vue 3.x</el-descriptions-item>
        <el-descriptions-item label="UI 组件">Element Plus</el-descriptions-item>
        <el-descriptions-item label="构建工具">Vite</el-descriptions-item>
        <el-descriptions-item label="样式方案">UnoCSS</el-descriptions-item>
        <el-descriptions-item label="状态管理">Pinia</el-descriptions-item>
        <el-descriptions-item label="主题色">#F37021 (爱马仕橙)</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped>
.stat-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-content {
  text-align: center;
  padding: 10px 0;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  color: var(--text-color-secondary);
}
</style>