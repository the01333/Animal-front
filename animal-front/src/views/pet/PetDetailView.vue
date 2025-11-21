<template>
  <div class="pet-detail" v-if="pet">
    <el-page-header @back="$router.push('/pets')" class="page-header">
      <template #content>
        <div class="header-content">
          <el-icon class="header-icon">
            <Star />
          </el-icon>
          <span class="header-title">宠物详情</span>
        </div>
      </template>
    </el-page-header>

    <!-- 宠物主要信息 -->
    <el-card class="pet-header-card" shadow="hover">
      <el-row :gutter="30">
        <el-col :xs="24" :md="12">
          <el-image :src="(pet.images && pet.images[0]) || defaultImage" :alt="pet.name" fit="cover"
            class="pet-main-image">
            <template #placeholder>
              <div class="image-slot">
                <el-icon class="is-loading">
                  <Loading />
                </el-icon>
              </div>
            </template>
          </el-image>
        </el-col>

        <el-col :xs="24" :md="12">
          <div class="pet-info">
            <h1 class="pet-name">
              <el-icon class="name-icon">
                <Star />
              </el-icon>
              {{ pet.name }}
              <el-tag :type="statusType" size="large" effect="dark" class="status-tag">
                {{ statusText }}
              </el-tag>
            </h1>

            <el-descriptions :column="2" border size="large">
              <el-descriptions-item>
                <template #label>
                  <el-icon>
                    <Grid />
                  </el-icon>
                  品种
                </template>
                {{ pet.breed }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template #label>
                  <el-icon>
                    <Clock />
                  </el-icon>
                  年龄
                </template>
                {{ pet.age }}岁
              </el-descriptions-item>

              <el-descriptions-item>
                <template #label>
                  <el-icon>
                    <User />
                  </el-icon>
                  性别
                </template>
                {{ genderText }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template #label>
                  <el-icon>
                    <MagicStick />
                  </el-icon>
                  健康状态
                </template>
                <el-tag :type="healthTagType" size="small">
                  {{ healthText }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>

            <div class="pet-actions">
              <el-button v-if="pet.adoptionStatus?.toLowerCase() === 'available'" type="primary" size="large"
                :icon="CirclePlus" @click="applyForAdoption">
                申请领养
              </el-button>

              <el-button v-else-if="pet.adoptionStatus?.toLowerCase() === 'pending'" type="warning" size="large"
                :icon="Document" @click="checkApplication">
                查看申请状态
              </el-button>

              <el-button type="info" size="large" :icon="Service" @click="contactHousekeeper">
                联系管家
              </el-button>

              <el-button :type="favored ? 'warning' : 'default'" :icon="Star" size="large" plain
                @click="toggleFavorite">
                {{ favored ? '已收藏' : '收藏' }}
              </el-button>
              <el-button :type="liked ? 'primary' : 'default'" size="large" plain @click="toggleLike">
                {{ liked ? '已点赞' : '点赞' }}
              </el-button>

              <el-button :icon="Share" size="large" plain>
                分享
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 宠物介绍 -->
    <el-card class="pet-description-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon>
            <Document />
          </el-icon>
          <span>宠物介绍</span>
        </div>
      </template>
      <el-text size="large" class="description-text">
        {{ pet.description }}
      </el-text>

      <el-divider />

      <el-alert title="温馨提示" type="info" :closable="false" show-icon>
        <template #default>
          <p>领养宠物是一项长期承诺，请确保您有足够的时间、精力和经济能力来照顾它。</p>
          <p>领养前建议先阅读我们的<el-link type="primary" @click="$router.push('/guides')">领养指南</el-link>，了解更多养宠知识。</p>
        </template>
      </el-alert>
    </el-card>

    <!-- 更多照片 -->
    <el-card class="pet-gallery-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon>
            <Picture />
          </el-icon>
          <span>更多照片</span>
        </div>
      </template>

      <el-space wrap :size="15">
        <el-image v-for="n in 6" :key="n" :src="`https://via.placeholder.com/200x200?text=照片${n}`"
          :preview-src-list="galleryImages" :initial-index="n - 1" fit="cover" class="gallery-image" lazy />
      </el-space>
    </el-card>

    <!-- 领养须知 -->
    <el-card class="adoption-notice-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon>
            <Warning />
          </el-icon>
          <span>领养须知</span>
        </div>
      </template>

      <el-timeline>
        <el-timeline-item v-for="(notice, index) in adoptionNotices" :key="index" :timestamp="notice.title"
          placement="top" :color="index % 2 === 0 ? '#409EFF' : '#67C23A'">
          <el-card shadow="never">
            <el-text>{{ notice.content }}</el-text>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>

  <div class="pet-not-found" v-else>
    <el-empty description="宠物未找到">
      <template #image>
        <el-icon :size="100">
          <QuestionFilled />
        </el-icon>
      </template>
      <el-button type="primary" :icon="ArrowLeft" @click="$router.push('/pets')">
        返回宠物列表
      </el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, CirclePlus, Document, Service, Share, ArrowLeft } from '@element-plus/icons-vue'
import { getPetDetail } from '@/api/pet'
import { addPetFavorite, removePetFavorite, isPetFavorited } from '@/api/favorite'
import { likePet, unlikePet, isPetLiked } from '@/api/like'
import type { Pet } from '@/types'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const pet = ref<Pet | null>(null)
const defaultImage = 'https://via.placeholder.com/500x400?text=宠物图片'

const galleryImages = ref([
  'https://via.placeholder.com/800x600?text=照片1',
  'https://via.placeholder.com/800x600?text=照片2',
  'https://via.placeholder.com/800x600?text=照片3',
  'https://via.placeholder.com/800x600?text=照片4',
  'https://via.placeholder.com/800x600?text=照片5',
  'https://via.placeholder.com/800x600?text=照片6'
])

const adoptionNotices = ref([
  {
    title: '年龄要求',
    content: '领养者需年满18周岁，具有完全民事行为能力'
  },
  {
    title: '居住环境',
    content: '需要有稳定的住所，且住所允许饲养宠物'
  },
  {
    title: '经济能力',
    content: '有稳定的收入来源，能够承担宠物的日常开销和医疗费用'
  },
  {
    title: '时间精力',
    content: '有足够的时间和精力照顾宠物，给予它充分的陪伴'
  },
  {
    title: '家人同意',
    content: '家庭成员都同意领养宠物，且无人对宠物过敏'
  },
  {
    title: '终身承诺',
    content: '承诺对宠物负责到底，不因任何原因遗弃宠物'
  }
])

const genderText = computed(() => {
  if (!pet.value) return ''
  return pet.value.gender === 1 ? '雄性 ♂' : pet.value.gender === 2 ? '雌性 ♀' : '未知'
})

const statusText = computed(() => {
  if (!pet.value) return ''
  const s = String(pet.value.adoptionStatus || '')
  switch (s.toLowerCase()) {
    case 'available': return '可领养'
    case 'adopted': return '已领养'
    case 'pending': return '领养中'
    default: return '未知'
  }
})

const statusType = computed(() => {
  if (!pet.value) return 'info'
  const s = String(pet.value.adoptionStatus || '').toLowerCase()
  switch (s) {
    case 'available': return 'success'
    case 'adopted': return 'info'
    case 'pending': return 'warning'
    default: return 'info'
  }
})

const healthText = computed(() => {
  if (!pet.value) return ''
  const s = String(pet.value.healthStatus || '').toLowerCase()
  switch (s) {
    case 'healthy': return '健康'
    case 'sick': return '生病'
    case 'injured': return '受伤'
    case 'recovering': return '恢复中'
    default: return '未知'
  }
})

const healthTagType = computed(() => {
  if (!pet.value) return 'info'
  const s = String(pet.value.healthStatus || '').toLowerCase()
  switch (s) {
    case 'healthy': return 'success'
    case 'sick': return 'danger'
    case 'injured': return 'danger'
    case 'recovering': return 'warning'
    default: return 'info'
  }
})

const applyForAdoption = () => {
  if (pet.value) {
    router.push(`/apply/${pet.value.id}`)
  }
}

const checkApplication = () => {
  router.push('/applications')
}

const contactHousekeeper = () => {
  router.push('/housekeeper-chat')
}

const favored = ref(false)
const liked = ref(false)

const fetchPetDetail = async () => {
  const petId = parseInt(route.params.id as string)
  try {
    const res = await getPetDetail(petId)
    if (res.code === 200) {
      const detail = res.data as Pet & { images: string[] | string }
      detail.images = typeof detail.images === 'string' ? JSON.parse(detail.images || '[]') : detail.images
      pet.value = detail
      const favRes = await isPetFavorited(petId)
      favored.value = !!favRes.data
      const likeRes = await isPetLiked(petId)
      liked.value = !!likeRes.data
    } else {
      ElMessage.error(res.message || '获取宠物详情失败')
    }
  } catch (e) {
    ElMessage.error('获取宠物详情失败')
  }
}

const toggleFavorite = async () => {
  if (!pet.value) return
  const id = pet.value.id
  try {
    if (favored.value) {
      await removePetFavorite(id)
      favored.value = false
      ElMessage.success('已取消收藏')
    } else {
      await addPetFavorite(id)
      favored.value = true
      ElMessage.success('已收藏')
    }
  } catch (e: any) {
    // 如果是重复收藏错误，仍然认为操作成功
    if (e.response?.data?.message?.includes('Duplicate') || e.message?.includes('Duplicate')) {
      favored.value = true
      ElMessage.success('已收藏')
    } else {
      ElMessage.error('操作失败，请稍后重试')
      // 重新加载状态以确保前端状态与后端一致
      const petId = parseInt(route.params.id as string)
      const favRes = await isPetFavorited(petId)
      favored.value = !!favRes.data
    }
  }
}

const toggleLike = async () => {
  if (!pet.value) return
  const id = pet.value.id
  try {
    if (liked.value) {
      await unlikePet(id)
      liked.value = false
      ElMessage.success('已取消点赞')
    } else {
      await likePet(id)
      liked.value = true
      ElMessage.success('已点赞')
    }
  } catch (e: any) {
    // 如果是重复点赞错误，仍然认为操作成功
    if (e.response?.data?.message?.includes('Duplicate') || e.message?.includes('Duplicate')) {
      liked.value = true
      ElMessage.success('已点赞')
    } else {
      ElMessage.error('操作失败，请稍后重试')
      // 重新加载状态以确保前端状态与后端一致
      const petId = parseInt(route.params.id as string)
      const likeRes = await isPetLiked(petId)
      liked.value = !!likeRes.data
    }
  }
}

onMounted(() => { 
  fetchPetDetail()
})
</script>

<style scoped>
.pet-detail {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.header-icon {
  font-size: 28px;
  color: #f59e0b;
}

.pet-header-card,
.pet-description-card,
.pet-gallery-card,
.adoption-notice-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.pet-main-image {
  width: 100%;
  height: 500px;
  border-radius: 12px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 40px;
}

.pet-info {
  padding: 20px 0;
}

.pet-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 25px 0;
  font-size: 32px;
  color: #303133;
  flex-wrap: wrap;
}

.name-icon {
  color: #f59e0b;
  font-size: 36px;
}

.status-tag {
  font-size: 16px;
  padding: 8px 16px;
}

.pet-actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.description-text {
  line-height: 2;
  display: block;
  margin-bottom: 20px;
}

.gallery-image {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.gallery-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pet-not-found {
  padding: 60px 20px;
  text-align: center;
}

:deep(.el-descriptions__label) {
  font-weight: bold;
}

:deep(.el-timeline-item__content) {
  padding-bottom: 20px;
}

@media (max-width: 768px) {
  .pet-name {
    font-size: 24px;
  }

  .pet-main-image {
    height: 300px;
  }

  .pet-actions {
    flex-direction: column;
  }

  .pet-actions .el-button {
    width: 100%;
  }

  .gallery-image {
    width: 100%;
    height: auto;
  }
}
</style>
