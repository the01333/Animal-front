<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-icon-wrapper">
            <el-icon class="hero-icon">
              <Sunny />
            </el-icon>
          </div>
          <h1 class="hero-title">为流浪动物寻找温暖的家</h1>
          <p class="hero-description">
            i宠园致力于连接爱心领养者与流浪小动物，让每一只动物都能找到属于自己的幸福家庭。
          </p>
          <div class="hero-buttons">
            <el-button class="hero-btn hero-btn-primary" size="large" @click="$router.push('/pets')">
              <el-icon>
                <Search />
              </el-icon>
              <span>查看可领养宠物</span>
            </el-button>
            <el-button class="hero-btn hero-btn-success" size="large" @click="$router.push('/guides')">
              <el-icon>
                <Reading />
              </el-icon>
              <span>领养指南</span>
            </el-button>
            <el-button class="hero-btn hero-btn-warning" size="large" @click="$router.push('/ai-chat')">
              <el-icon>
                <ChatDotRound />
              </el-icon>
              <span>AI客服咨询</span>
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐宠物 -->
    <section class="featured-pets">
      <div class="section-header">
        <el-icon class="section-icon">
          <Star />
        </el-icon>
        <h2>推荐宠物</h2>
        <el-divider />
      </div>

      <div class="carousel-container">
        <el-carousel v-if="!loading && featuredPets.length > 0" ref="carouselRef" :interval="4000" type="card"
          height="450px" arrow="always" indicator-position="none" @change="handleCarouselChange">
          <el-carousel-item v-for="pet in featuredPets" :key="pet.id">
            <div class="carousel-pet-card" @click="goToPetDetail(pet.id)">
              <div class="pet-image-box">
                <img :src="pet.image" alt="pet.name" class="pet-carousel-image" />
                <div class="pet-status-overlay">
                  <el-tag :type="getStatusTagType(pet.status)" size="large" effect="dark" round>
                    {{ getStatusText(pet.status) }}
                  </el-tag>
                </div>
              </div>
              <div class="pet-card-info">
                <h3 class="pet-card-name">
                  <el-icon class="name-icon">
                    <Star />
                  </el-icon>
                  {{ pet.name }}
                </h3>
                <div class="pet-card-details">
                  <div class="detail-item">
                    <el-icon>
                      <Orange />
                    </el-icon>
                    <span>{{ pet.breed || '未知品种' }}</span>
                  </div>
                  <div class="detail-item">
                    <el-icon>
                      <Calendar />
                    </el-icon>
                    <span>{{ pet.age }}岁</span>
                  </div>
                </div>
                <el-button type="primary" size="large" round class="adopt-btn" @click.stop="applyAdopt(pet.id)">
                  <el-icon>
                    <CircleCheckFilled />
                  </el-icon>
                  申请领养
                </el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && featuredPets.length === 0" class="empty-container">
          <el-empty description="暂无推荐宠物" />
        </div>

        <!-- 自定义指示器 -->
        <div v-if="!loading && featuredPets.length > 0" class="custom-indicators">
          <span v-for="(pet, index) in featuredPets" :key="index"
            :class="['indicator-dot', { 'is-active': currentSlide === index }]" @click="goToSlide(index)"
            @mouseenter="goToSlide(index)"></span>
        </div>
      </div>

      <div class="view-all">
        <el-button type="primary" size="large" plain :icon="ArrowRight" @click="$router.push('/pets')">
          查看所有宠物
        </el-button>
      </div>
    </section>

    <!-- 领养步骤 -->
    <section class="adoption-guide">
      <div class="section-header">
        <el-icon class="section-icon">
          <List />
        </el-icon>
        <h2>领养流程</h2>
        <el-divider />
      </div>

      <el-row :gutter="30">
        <el-col :xs="24" :md="12">
          <el-timeline>
            <el-timeline-item v-for="(step, index) in adoptionSteps" :key="index" :timestamp="step.title"
              placement="top" :color="timelineColors[index]" :icon="stepIcons[index]" size="large">
              <el-card shadow="hover" class="step-card">
                <div class="step-content">
                  <div class="step-number">{{ index + 1 }}</div>
                  <div>
                    <h3>{{ step.title }}</h3>
                    <p>{{ step.description }}</p>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-col>

        <el-col :xs="24" :md="12">
          <el-card class="guide-image-card" shadow="hover">
            <el-image src="http://localhost:9000/animal-adopt/family.png" fit="cover" class="guide-image">
              <template #placeholder>
                <div class="image-slot">
                  <el-icon class="is-loading">
                    <Loading />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div class="guide-stats">
              <el-statistic title="成功领养" :value="1268" suffix="只">
                <template #prefix>
                  <el-icon>
                    <TrophyBase />
                  </el-icon>
                </template>
              </el-statistic>
              <el-divider direction="vertical" />
              <el-statistic title="爱心家庭" :value="856" suffix="个">
                <template #prefix>
                  <el-icon>
                    <House />
                  </el-icon>
                </template>
              </el-statistic>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 领养故事 -->
    <section class="adoption-stories">
      <div class="section-header">
        <el-icon class="section-icon">
          <ChatLineSquare />
        </el-icon>
        <h2>成功领养故事</h2>
        <el-divider />
      </div>

      <el-row :gutter="20">
        <el-col v-for="story in stories" :key="story.id" :xs="24" :sm="12" :md="12">
          <el-card class="story-card" shadow="hover">
            <!-- 暂时写死，后续再对接接口 -->
            <el-image :src="story.image" :alt="story.title" fit="cover" class="story-image" />
            <div class="story-content">
              <h3>{{ story.title }}</h3>
              <el-text type="info" line-clamp="2">{{ story.excerpt }}</el-text>
              <div class="story-footer">
                <el-button type="primary" link :icon="View" @click="$router.push(`/story/${story.id}`)">
                  阅读更多
                </el-button>
                <el-tag type="success" effect="plain" size="small">
                  <el-icon>
                    <CircleCheck />
                  </el-icon>
                  已领养
                </el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 快速操作 -->
    <section class="quick-actions">
      <el-card shadow="always" class="action-card">
        <div class="action-content">
          <el-icon class="action-icon">
            <Promotion />
          </el-icon>
          <div>
            <h3>准备好领养一只宠物了吗？</h3>
            <p>浏览我们的宠物列表，找到您心仪的小伙伴，开始您的领养之旅！</p>
          </div>
          <el-button type="primary" size="large" round :icon="ArrowRight" @click="$router.push('/pets')">
            立即开始
          </el-button>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { Search, Reading, ChatDotRound, ArrowRight, View, Star, List, Sunny, Orange, Calendar } from '@element-plus/icons-vue'
import { Reading as ReadingIcon, Document, UserFilled, ChatLineRound, CircleCheck, CircleCheckFilled } from '@element-plus/icons-vue'
import { getRecommendedPets } from '@/api/pet'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)
const currentSlide = ref(0)
const loading = ref(false)

// 宠物数据接口（后端返回的格式）
interface PetData {
  id: number
  name: string
  breed?: string
  age: number // 后端返回的是月数
  category: string // 小写，如 "cat", "dog"
  adoptionStatus: string // 小写，如 "available", "pending", "adopted"
  coverImage?: string
  images?: string | string[] // 可能是JSON字符串或数组
  gender?: number
  color?: string
}

const featuredPets = ref<Array<PetData & { image: string; status: string }>>([])

// 处理图片URL，移除@前缀（如果存在）
function processImageUrl(url: string | undefined | null): string {
  if (!url) return ''
  // 移除@前缀（如果存在）
  return url.startsWith('@') ? url.substring(1) : url
}

// 加载推荐宠物
async function loadFeaturedPets() {
  loading.value = true
  try {
    const res = await getRecommendedPets(6)
    console.log(res.data)
    if (res.code === 200 && res.data) {
      featuredPets.value = (res.data as any[]).map((pet: any) => {
        // 处理图片：优先使用coverImage，否则从images数组中取第一张
        let imageUrl = processImageUrl(pet.coverImage)

        if (!imageUrl && pet.images) {
          try {
            let images: string[] = []

            if (typeof pet.images === 'string') {
              // 检查是否是JSON格式（以[或{开头）
              const trimmed = pet.images.trim()
              if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                // 是JSON格式，尝试解析
                images = JSON.parse(pet.images)
              } else {
                // 不是JSON，可能是直接的URL字符串（可能带@前缀）
                images = [pet.images]
              }
            } else if (Array.isArray(pet.images)) {
              images = pet.images
            }

            // 取第一张图片并处理@前缀
            if (images.length > 0) {
              imageUrl = processImageUrl(images[0])
            }
          } catch (e) {
            // JSON解析失败，可能是直接的URL字符串
            if (typeof pet.images === 'string') {
              imageUrl = processImageUrl(pet.images)
            }
            console.warn('解析图片失败，使用原始值:', e)
          }
        }

        // 如果没有图片，使用占位图
        // if (!imageUrl) {
        //   imageUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(pet.name || '宠物')}`
        // }

        return {
          ...pet,
          image: imageUrl,
          status: pet.adoptionStatus || 'available',
          // 将月数转换为岁数显示（简化处理，1岁=12个月）
          age: pet.age ? Math.floor(pet.age / 12) || 1 : 1
        }
      })

      console.log(featuredPets.value)
    }
  } catch (error: any) {
    console.error('加载推荐宠物失败:', error)
    ElMessage.error('加载推荐宠物失败，请稍后重试')
    // 失败时使用空数组，避免显示错误
    featuredPets.value = []
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  // 如果已登录，获取最新的用户信息（包括头像）
  if (isLoggedIn.value) {
    try {
      await userStore.getUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 获取用户信息失败不影响首页加载
    }
  }
  
  loadFeaturedPets()
})

// TODO: 暂时写死，后续对接接口
const stories = ref([
  {
    id: 1,
    title: '小黑的幸福新家',
    excerpt: '曾经流浪街头的小黑，如今有了温暖的家和爱它的主人。每天早晨，它都会在主人床边撒娇，陪伴主人度过美好的时光...',
    image: 'http://localhost:9000/animal-adopt/救助1.png'
  },
  {
    id: 2,
    title: '从救助站到家庭',
    excerpt: '志愿者如何帮助一只受伤的狗狗找到永久家庭。经过数月的悉心照料和康复训练，它终于迎来了属于自己的温暖家庭...',
    image: 'http://localhost:9000/animal-adopt/救助2.png'
  }
])

const adoptionSteps = ref([
  {
    title: '了解领养',
    description: '阅读领养指南，了解领养流程和责任'
  },
  {
    title: '选择宠物',
    description: '浏览宠物列表，选择心仪的小伙伴'
  },
  {
    title: '提交申请',
    description: '填写领养申请表，等待审核'
  },
  {
    title: '见面交流',
    description: '与宠物和工作人员见面，确认合适'
  },
  {
    title: '正式领养',
    description: '签署领养协议，带宠物回家'
  }
])

const timelineColors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
const stepIcons = [
  markRaw(ReadingIcon),
  markRaw(Search),
  markRaw(Document),
  markRaw(UserFilled),
  markRaw(CircleCheck)
]

// 轮播图相关方法
const carouselRef = ref()

function goToPetDetail(id: number) {
  router.push(`/pet/${id}`)
}

function goToSlide(index: number) {
  currentSlide.value = index
  if (carouselRef.value) {
    carouselRef.value.setActiveItem(index)
  }
}

function handleCarouselChange(newIndex: number) {
  currentSlide.value = newIndex
}

function applyAdopt(id: number) {
  router.push(`/apply/${id}`)
}

function getStatusTagType(status: string) {
  const typeMap: Record<string, any> = {
    available: 'success',
    pending: 'warning',
    adopted: 'info'
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    available: '可领养',
    pending: '待审核',
    adopted: '已领养'
  }
  return textMap[status] || status
}
</script>

<style scoped>
.home {
  padding: 0;
}

/* 英雄区域样式 */
.hero {
  margin-bottom: 60px;
  position: relative;
}

.hero-background {
  background: linear-gradient(135deg, #ffd89b 0%, #ffe8cc 20%, #fff5e6 40%, #ffe8cc 60%, #ffc966 80%, #ffb84d 100%);
  background-size: 300% 300%;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  padding: 100px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: heroGradient 8s ease-in-out infinite;
  box-shadow: 0 20px 60px rgba(255, 200, 102, 0.3);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 80px 40px;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
}

.hero-icon-wrapper {
  margin-bottom: 30px;
  animation: float 3s ease-in-out infinite, glow 4s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-15px);
  }
}

.hero-icon {
  font-size: 90px;
  color: #ffd04b;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes heroGradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(255, 200, 102, 0.5));
  }

  50% {
    filter: drop-shadow(0 0 25px rgba(255, 200, 102, 0.8));
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  50% {
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 200, 102, 0.15);
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.95;
  }

  50% {
    opacity: 1;
  }
}

@keyframes buttonPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 200, 102, 0.4);
  }

  50% {
    box-shadow: 0 0 0 8px rgba(255, 200, 102, 0);
  }
}

.hero-title {
  font-size: 48px;
  margin: 0 0 25px 0;
  font-weight: 700;
  color: #2c2c2c;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  letter-spacing: 1px;
  line-height: 1.3;
  animation: slideInDown 0.8s ease-out, textGlow 3s ease-in-out infinite;
}

.hero-description {
  font-size: 20px;
  margin: 0 0 45px 0;
  line-height: 1.8;
  color: #444444;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: slideInUp 0.8s ease-out 0.2s both, fadeInOut 4s ease-in-out infinite 0.2s;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 英雄区域按钮样式 */
.hero-btn {
  height: 56px;
  padding: 0 36px;
  font-size: 17px;
  border: none;
  border-radius: 28px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideInUp 0.8s ease-out 0.4s both, buttonPulse 2s ease-in-out infinite 0.4s;
}

.hero-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
}

.hero-btn:active {
  transform: translateY(-2px);
}

.hero-btn .el-icon {
  font-size: 22px;
}

.hero-btn-primary {
  background: linear-gradient(135deg, #42b983 0%, #35a572 100%);
  color: white;
}

.hero-btn-primary:hover {
  background: linear-gradient(135deg, #35a572 0%, #2d8f61 100%);
}

.hero-btn-success {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
}

.hero-btn-success:hover {
  background: linear-gradient(135deg, #40c057 0%, #37b24d 100%);
}

.hero-btn-warning {
  background: linear-gradient(135deg, #ffd43b 0%, #fab005 100%);
  color: #333;
}

.hero-btn-warning:hover {
  background: linear-gradient(135deg, #fab005 0%, #f59f00 100%);
}

.featured-pets,
.adoption-guide,
.adoption-stories {
  margin-bottom: 50px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-icon {
  font-size: 40px;
  color: #409EFF;
  margin-bottom: 10px;
}

.section-header h2 {
  font-size: 32px;
  color: #303133;
  margin: 15px 0;
  font-weight: bold;
}

/* 轮播图样式 */
.carousel-container {
  margin-bottom: 30px;
  padding: 60px 0;
  position: relative;
}

.carousel-pet-card {
  height: 100%;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.carousel-pet-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.pet-image-box {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.pet-carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.carousel-pet-card:hover .pet-carousel-image {
  transform: scale(1.1);
}

.pet-status-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}

.pet-card-info {
  padding: 25px;
  background: #fff;
}

.pet-card-name {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-icon {
  font-size: 26px;
  color: #ffd43b;
}

.pet-card-details {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 15px;
}

.detail-item .el-icon {
  font-size: 18px;
  color: #409EFF;
}

.adopt-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #bca0d8 100%);
  border: none;
  transition: all 0.3s ease;
}

.adopt-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.adopt-btn .el-icon {
  font-size: 18px;
  margin-right: 6px;
}

/* 自定义指示器样式 */
.custom-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  padding: 10px 0;
}

.indicator-dot {
  width: 40px;
  height: 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;
}

.indicator-dot:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.indicator-dot.is-active {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

:deep(.el-carousel__arrow) {
  background-color: rgba(139, 157, 240, 0.8);
  width: 45px;
  height: 45px;
  font-size: 18px;
}

:deep(.el-carousel__arrow):hover {
  background-color: #879bf6;
}

.view-all {
  text-align: center;
  margin-top: 30px;
}

.step-card {
  border-radius: 12px;
  transition: all 0.3s;
}

.step-card:hover {
  transform: translateX(10px);
}

.step-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  min-width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #b896da 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 18px;
}

.step-content p {
  color: #606266;
  margin: 0;
  line-height: 1.6;
}

.guide-image-card {
  height: 100%;
  border-radius: 12px;
}

.guide-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.guide-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.story-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.story-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.story-image {
  width: 100%;
  height: 220px;
}

.story-content {
  padding: 20px;
}

.story-content h3 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 20px;
}

.story-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.quick-actions {
  margin-bottom: 40px;
}

.action-card {
  background: linear-gradient(135deg, #f093fb 0%, #f95f73 100%);
  border: none;
  border-radius: 16px;
}

.action-content {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px;
  color: white;
}

.action-icon {
  font-size: 60px;
  flex-shrink: 0;
}

.action-content h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.action-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
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

.loading-container {
  padding: 40px;
  min-height: 450px;
}

.empty-container {
  padding: 60px 20px;
  min-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .hero-content {
    padding: 60px 20px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-description {
    font-size: 16px;
    margin-bottom: 35px;
  }

  .hero-icon {
    font-size: 70px;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .hero-btn {
    width: 100%;
    max-width: 300px;
  }

  .section-header h2 {
    font-size: 24px;
  }

  .action-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
