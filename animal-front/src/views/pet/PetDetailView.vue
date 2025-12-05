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
              <!-- 当前用户已领养 -->
              <el-button v-if="isCurrentUserAdopted" type="success" size="large"
                :icon="Document" disabled>
                已领养
              </el-button>

              <!-- 当前用户有有效申请（待审核或已批准） -->
              <el-button v-else-if="hasValidApplication" type="warning" size="large"
                :icon="Document" @click="checkApplication">
                {{ applicationStatusText }}
              </el-button>

              <!-- 其他用户已领养 -->
              <el-button v-else-if="pet.adoptionStatus?.toLowerCase() === 'adopted'" type="info" size="large"
                :icon="Document" disabled>
                已被领养
              </el-button>

              <!-- 宠物可领养且当前用户未申请（或申请被拒/已撤销） -->
              <el-button v-else-if="pet.adoptionStatus?.toLowerCase() === 'available'" type="primary" size="large"
                :icon="CirclePlus" @click="applyForAdoption">
                申请领养
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
        <!-- 只显示随机宠物图片（不包括当前宠物的图片） -->
        <el-image v-for="(image, index) in randomPetImages.slice(0, 6)" :key="`random-${index}`" :src="image"
          fit="cover" class="gallery-image" lazy
          @click="() => { imageViewerIndex = index; imageViewerVisible = true }" />
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

  <!-- 图片预览器 -->
  <div v-if="imageViewerVisible && allGalleryImages.length > 0" class="image-viewer-overlay"
    @click="imageViewerVisible = false">
    <div class="image-viewer-container" @click.stop>
      <button class="close-btn" @click="imageViewerVisible = false">
        <el-icon :size="24">
          <Close />
        </el-icon>
      </button>
      <img :src="allGalleryImages[imageViewerIndex]" :alt="`图片 ${imageViewerIndex + 1}`" class="viewer-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { openAuthDialog } from '@/utils/authHelper'
import { Star, CirclePlus, Document, Share, ArrowLeft, Close, Loading, Grid, Clock, User, MagicStick, Warning, Picture, QuestionFilled } from '@element-plus/icons-vue'
import { getPetDetail, getRandomPetImages } from '@/api/pet'
import { addPetFavorite, removePetFavorite, isPetFavorited, getPetFavoriteCount } from '@/api/favorite'
import { likePet, unlikePet, isPetLiked, getPetLikeCount } from '@/api/like'
import { getMyApplications } from '@/api/application'
import type { Pet } from '@/types'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)

const pet = ref<Pet | null>(null)
const defaultImage = 'http://localhost:9000/animal-adopt/default.jpg'

// 当前登录用户ID
const currentUserId = ref<number | null>(null)

// 随机推荐宠物
const recommendedPets = ref<Pet[]>([])
const randomPetImages = ref<string[]>([])

// 图片预览
const imageViewerVisible = ref(false)
const imageViewerIndex = ref(0)
const allGalleryImages = computed(() => {
  return randomPetImages.value
})

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
    case 'adopted': return 'primary'
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
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录后再申请领养')
    openAuthDialog('login')
    return
  }
  if (pet.value) {
    router.push(`/apply/${pet.value.id}`)
  }
}

const checkApplication = () => {
  router.push('/applications')
}

const favored = ref(false)
const liked = ref(false)
const favoriteCount = ref(0)
const likeCount = ref(0)

// 当前申请的状态
const applicationStatus = ref<string>('')

// 判断宠物是否由当前用户领养
const isCurrentUserAdopted = computed(() => {
  if (!pet.value || !currentUserId.value) return false
  // 检查宠物是否已被领养，且领养者是当前用户
  return pet.value.adoptionStatus?.toLowerCase() === 'adopted' && pet.value.adoptedBy === currentUserId.value
})

// 判断当前用户是否有有效的申请（待审核或已批准）
const hasValidApplication = computed(() => {
  const status = applicationStatus.value?.toLowerCase()
  // 只有待审核和已批准状态才算有效申请
  return status === 'pending' || status === 'approved'
})

// 申请状态文本
const applicationStatusText = computed(() => {
  const status = applicationStatus.value?.toLowerCase()
  const statusMap: Record<string, string> = {
    'pending': '待批准',
    'approved': '已批准',
    'rejected': '已拒绝',
    'cancelled': '已撤销'
  }
  return statusMap[status] || '查看申请状态'
})

// 检查用户是否已申请过该宠物
const checkIfUserApplied = async () => {
  if (!isLoggedIn.value) {
    applicationStatus.value = ''
    return
  }

  const petId = Number(route.params.id || pet.value?.id)
  if (!petId) {
    applicationStatus.value = ''
    return
  }
  
  try {
    const response = await getMyApplications({
      current: 1,
      size: 100
    })
    const applications = response.data?.records || []
    // 查找针对当前宠物的申请
    const application = applications.find(app => app.petId === petId)
    
    if (!application) {
      // 未申请过
      applicationStatus.value = ''
      console.log(`✅ 检查申请状态: 未申请`)
      return
    }
    
    // 记录申请状态
    const status = application.status?.toLowerCase()
    applicationStatus.value = status || ''
    
    console.log(`✅ 检查申请状态: 申请状态为 ${status}`)
  } catch (error) {
    console.error('❌ 检查申请状态失败:', error)
    applicationStatus.value = ''
  }
}

// 获取随机宠物图片
const fetchRandomPetImages = async () => {
  try {
    const response = await getRandomPetImages(6)
    randomPetImages.value = response.data || []
    console.log('✅ 获取随机宠物图片成功，共', randomPetImages.value.length, '张')
  } catch (error) {
    console.error('❌ 获取随机宠物图片失败:', error)
  }
}

const fetchPetDetail = async () => {
  const petId = parseInt(route.params.id as string)
  try {
    const res = await getPetDetail(petId)
    if (res.code === 200) {
      const detail = res.data as Pet & { images: string[] | string }
      detail.images = typeof detail.images === 'string' ? JSON.parse(detail.images || '[]') : detail.images
      pet.value = detail

      // 获取收藏和点赞数量（无需认证，所有用户都能看到）
      try {
        const favCountRes = await getPetFavoriteCount(petId)
        favoriteCount.value = favCountRes.data || 0
      } catch (e) {
        favoriteCount.value = 0
      }

      try {
        const likeCountRes = await getPetLikeCount(petId)
        likeCount.value = likeCountRes.data || 0
      } catch (e) {
        likeCount.value = 0
      }

      // 只有登录用户才能查询是否已收藏或点赞
      if (isLoggedIn.value) {
        try {
          const favRes = await isPetFavorited(petId)
          favored.value = !!favRes.data
        } catch (e) {
          // 获取收藏状态失败，保持默认值
          favored.value = false
        }

        try {
          const likeRes = await isPetLiked(petId)
          liked.value = !!likeRes.data
        } catch (e) {
          // 获取点赞状态失败，保持默认值
          liked.value = false
        }
      }
    } else {
      ElMessage.error(res.message || '获取宠物详情失败')
    }
  } catch (e) {
    ElMessage.error('获取宠物详情失败')
  }
}

const toggleFavorite = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录后再进行收藏操作')
    openAuthDialog('login')
    return
  }
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
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录后再进行点赞操作')
    openAuthDialog('login')
    return
  }
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

/**
 * 更新点赞和收藏状态（仅当登录时）
 */
const updateLikeAndFavoriteStatus = async () => {
  if (!pet.value) return
  const petId = pet.value.id

  console.log('🔄 更新点赞和收藏状态, isLoggedIn:', isLoggedIn.value)

  if (isLoggedIn.value) {
    try {
      console.log('📝 查询是否已收藏...')
      const favRes = await isPetFavorited(petId)
      console.log('✅ 收藏状态:', favRes.data)
      favored.value = !!favRes.data
    } catch (e) {
      console.error('❌ 查询收藏状态失败:', e)
      favored.value = false
    }

    try {
      console.log('📝 查询是否已点赞...')
      const likeRes = await isPetLiked(petId)
      console.log('✅ 点赞状态:', likeRes.data)
      liked.value = !!likeRes.data
    } catch (e) {
      console.error('❌ 查询点赞状态失败:', e)
      liked.value = false
    }
  } else {
    // 未登录时重置状态
    console.log('🔄 未登录，重置状态')
    favored.value = false
    liked.value = false
  }
}

// 初始化用户信息
const initUserInfo = () => {
  if (currentUserId.value) return
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      currentUserId.value = user.id || user.userId
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  }
}

onMounted(() => {
  initUserInfo()
  fetchRandomPetImages()
  fetchPetDetail()
  checkIfUserApplied()
})

// 监听路由参数变化，当宠物ID改变时重新加载数据
watch(() => route.params.id, (newId) => {
  if (newId) {
    console.log('🔄 宠物ID变化，重新加载数据:', newId)
    fetchRandomPetImages()
    fetchPetDetail()
    checkIfUserApplied()
  }
}, { immediate: false })

// 监听登录状态变化，重新查询点赞和收藏状态
watch(() => isLoggedIn.value, (newVal) => {
  console.log('👁️ 登录状态变化:', newVal)
  // 如果已经加载了宠物详情，重新查询点赞和收藏状态
  if (pet.value) {
    updateLikeAndFavoriteStatus()
    checkIfUserApplied()
  }
}, { immediate: false })
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

/* 图片预览器样式 */
.image-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-in-out;
}

.image-viewer-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.viewer-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  z-index: 2001;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
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
