<template>
  <div class="guide-detail-container" v-if="guide">
    <div class="guide-header">
      <h1>{{ guide.title }}</h1>
      <div class="guide-meta">
        <span class="meta-item">{{ guide.category }}</span>
        <span class="meta-item">{{ guide.publishDate }}</span>
        <span class="meta-item">阅读: {{ guide.views }}</span>
      </div>
    </div>

    <div class="guide-content">
      <div class="content-image" v-if="guide.image">
        <img :src="guide.image" :alt="guide.title" />
      </div>

      <div class="content-text markdown-body" v-html="renderedContent"></div>
    </div>

    <div class="guide-actions">
      <button @click="likeGuide" class="btn-like" :class="{ liked: isLiked }">
        {{ isLiked ? '已点赞' : '点赞' }} ({{ likeCount }})
      </button>
      <button @click="shareGuide" class="btn-share">
        分享
      </button>
      <button @click="collectGuide" class="btn-collect" :class="{ collected: isCollected }">
        {{ isCollected ? '已收藏' : '收藏' }}
      </button>
    </div>

    <div class="related-guides">
      <h3>相关指南</h3>
      <div class="related-grid">
        <div v-for="related in relatedGuides" :key="related.id" class="related-item"
          @click="viewRelatedGuide(related.id)">
          <img :src="related.image || defaultImage" :alt="related.title" />
          <h4>{{ related.title }}</h4>
        </div>
      </div>
    </div>
  </div>

  <div class="guide-not-found" v-else>
    <h2>指南未找到</h2>
    <p>抱歉，您查找的指南不存在。</p>
    <router-link to="/guides" class="btn-back">返回指南列表</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { getGuideDetail, getAllGuides, likeGuide as likeGuideAPI, unlikeGuide as unlikeGuideAPI, favoriteGuide as favoriteGuideAPI, unfavoriteGuide as unfavoriteGuideAPI, getGuideLikeCount, getGuideFavoriteCount, isGuideLiked, isGuideFavorited, type GuideVO } from '@/api/guide'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'

// 路由相关
const route = useRoute()
const router = useRouter()

// 指南数据
const guide = ref<GuideVO | null>(null)

// 当前用户ID
const currentUserId = ref<number | null>(null)

// 点赞状态
const isLiked = ref(false)
const likeCount = ref(0)

// 收藏状态
const isCollected = ref(false)

// 获取用户登录状态和用户信息
const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)

// 默认图片
const defaultImage = 'https://via.placeholder.com/100x100?text=指南'

// 相关指南
const relatedGuides = ref<GuideVO[]>([])

// 渲染后的Markdown内容
const renderedContent = computed(() => {
  if (!guide.value) return ''
  return marked(guide.value.content)
})

// 点赞指南
const likeGuide = async () => {
  if (!isLoggedIn.value || !userInfo.value?.id) {
    ElMessage.warning('请先登录')
    return
  }
  
  if (!guide.value) return
  
  try {
    if (isLiked.value) {
      await unlikeGuideAPI(guide.value.id, userInfo.value.id)
      isLiked.value = false
      likeCount.value--
    } else {
      await likeGuideAPI(guide.value.id, userInfo.value.id)
      isLiked.value = true
      likeCount.value++
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 分享指南
const shareGuide = () => {
  alert('分享功能')
}

// 收藏指南
const collectGuide = async () => {
  if (!isLoggedIn.value || !userInfo.value?.id) {
    ElMessage.warning('请先登录')
    return
  }
  
  if (!guide.value) return
  
  try {
    if (isCollected.value) {
      await unfavoriteGuideAPI(guide.value.id, userInfo.value.id)
      isCollected.value = false
      ElMessage.success('已取消收藏')
    } else {
      await favoriteGuideAPI(guide.value.id, userInfo.value.id)
      isCollected.value = true
      ElMessage.success('已收藏')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 查看相关指南
const viewRelatedGuide = (id: number) => {
  router.push(`/guide/${id}`)
}

// 获取指南详情
const fetchGuideDetail = async () => {
  try {
    const guideId = parseInt(route.params.id as string)
    const response = await getGuideDetail(guideId)
    guide.value = response.data as GuideVO
    
    if (guide.value) {
      // 总是获取点赞数量（无需认证）
      try {
        const likeCountRes = await getGuideLikeCount(guideId)
        likeCount.value = likeCountRes.data || 0
      } catch (e) {
        likeCount.value = 0
      }
      
      // 只有登录用户才能从数据库查询是否已点赞或收藏
      if (isLoggedIn.value) {
        try {
          const likedRes = await isGuideLiked(guideId)
          isLiked.value = likedRes.data || false
          const favoritedRes = await isGuideFavorited(guideId)
          isCollected.value = favoritedRes.data || false
        } catch (e) {
          console.error('查询用户状态失败:', e)
          isLiked.value = false
          isCollected.value = false
        }
      } else {
        // 未登录时重置状态
        isLiked.value = false
        isCollected.value = false
      }
      
      // 获取所有指南用于显示相关指南
      const allGuidesResponse = await getAllGuides()
      const allGuides = allGuidesResponse.data as GuideVO[]
      // 获取同分类的其他指南作为相关指南
      relatedGuides.value = allGuides
        .filter(g => g.category === guide.value?.category && g.id !== guide.value?.id)
        .slice(0, 3)
    }
  } catch (error) {
    console.error('获取指南详情失败:', error)
  }
}

// 更新点赞和收藏状态（仅当登录时）
const updateLikeAndFavoriteStatus = async () => {
  if (!guide.value) return
  const guideId = guide.value.id
  
  if (isLoggedIn.value) {
    try {
      const likedRes = await isGuideLiked(guideId)
      isLiked.value = likedRes.data || false
      const favoritedRes = await isGuideFavorited(guideId)
      isCollected.value = favoritedRes.data || false
    } catch (e) {
      console.error('查询用户状态失败:', e)
      isLiked.value = false
      isCollected.value = false
    }
  } else {
    // 未登录时重置状态
    isLiked.value = false
    isCollected.value = false
  }
}

onMounted(() => {
  fetchGuideDetail()
})

// 监听登录状态变化，重新查询点赞和收藏状态
watch(() => isLoggedIn.value, (newVal) => {
  if (guide.value) {
    updateLikeAndFavoriteStatus()
  }
}, { immediate: false })
</script>

<style scoped>
.guide-detail-container {
  padding: 1rem 0;
}

.guide-header h1 {
  margin: 0 0 1rem 0;
  color: #333;
}

.guide-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.meta-item {
  background-color: #e0e0e0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.guide-content {
  margin-bottom: 2rem;
}

.content-image {
  margin-bottom: 2rem;
  text-align: center;
}

.content-image img {
  max-width: 100%;
  border-radius: 8px;
}

.content-text {
  line-height: 1.6;
}

.content-text h2 {
  margin: 1.5rem 0 1rem 0;
  color: #333;
}

.content-text p {
  margin-bottom: 1rem;
  color: #333;
}

.content-text ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.content-text li {
  margin-bottom: 0.5rem;
}

.guide-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.btn-like,
.btn-share,
.btn-collect {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-like {
  background-color: #ff6b6b;
  color: white;
}

.btn-like.liked {
  background-color: #ff5252;
}

.btn-share {
  background-color: #2196f3;
  color: white;
}

.btn-collect {
  background-color: #ff9800;
  color: white;
}

.btn-collect.collected {
  background-color: #e68900;
}

.related-guides h3 {
  margin-bottom: 1rem;
  color: #333;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.related-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.related-item:hover {
  transform: translateY(-3px);
}

.related-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.related-item h4 {
  padding: 0.5rem;
  margin: 0;
  color: #333;
  font-size: 0.9rem;
}

.guide-not-found {
  text-align: center;
  padding: 2rem;
}

.btn-back {
  display: inline-block;
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .guide-actions {
    flex-direction: column;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>