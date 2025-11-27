<template>
  <el-card class="pet-card" :body-style="{ padding: '0px' }" shadow="hover" @click="goToDetail">
    <div class="pet-image">
      <el-image :src="pet.image || defaultImage" :alt="pet.name" fit="cover" class="image" lazy>
        <template #placeholder>
          <div class="image-slot">
            <el-icon class="is-loading">
              <Loading />
            </el-icon>
          </div>
        </template>
        <template #error>
          <div class="image-slot">
            <el-icon>
              <Picture />
            </el-icon>
          </div>
        </template>
      </el-image>
      <el-tag :type="statusType" class="status-tag" effect="dark">
        {{ statusText }}
      </el-tag>
    </div>

    <div class="pet-info">
      <h3 class="pet-name">
        <el-icon class="name-icon">
          <Star />
        </el-icon>
        {{ pet.name }}
      </h3>

      <el-space direction="vertical" :size="8" fill>
        <div class="info-item">
          <el-icon>
            <Grid />
          </el-icon>
          <span>品种：{{ pet.breed }}</span>
        </div>
        <div class="info-item">
          <el-icon>
            <Clock />
          </el-icon>
          <span>年龄：{{ pet.age }}岁</span>
        </div>
      </el-space>

      <el-divider style="margin: 12px 0" />

      <div class="button-group">
        <el-button type="primary" :icon="View" class="view-btn" @click.stop="goToDetail">
          查看详情
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { View } from '@element-plus/icons-vue'

interface Pet {
  id: number
  name: string
  breed: string
  age: number
  image?: string
  status: 'available' | 'adopted' | 'pending'
}

const props = defineProps<{
  pet: Pet
}>()

const router = useRouter()

const defaultImage = 'http://localhost:9000/animal-adopt/default.jpg'

const statusText = computed(() => {
  switch (props.pet.status) {
    case 'available': return '可领养'
    case 'adopted': return '已领养'
    case 'pending': return '领养中'
    default: return '未知'
  }
})

const statusType = computed(() => {
  switch (props.pet.status) {
    case 'available': return 'success'
    case 'adopted': return 'info'
    case 'pending': return 'warning'
    default: return 'info'
  }
})

const goToDetail = () => {
  router.push(`/pet/${props.pet.id}`)
}
</script>

<style scoped>
:deep(.pet-card.el-card) {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  display: flex !important;
  flex-direction: column;
  height: auto !important;
  max-height: 500px;
}

.pet-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: auto;
  max-height: 500px;
}

.pet-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.pet-image {
  height: 220px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
  object-fit: cover;
}

.pet-card:hover .image {
  transform: scale(1.1);
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.status-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 20px;
}

.pet-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
}

.pet-name {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.name-icon {
  color: #f59e0b;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.info-item .el-icon {
  color: #409EFF;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: auto;
  justify-content: center;
}

.view-btn {
  flex: 1;
  border-radius: 8px;
  font-weight: bold;
}
</style>
