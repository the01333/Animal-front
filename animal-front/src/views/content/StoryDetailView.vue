<template>
  <div class="story-detail-container" v-if="story">
    <div class="story-header">
      <h1>{{ story.title }}</h1>
      <div class="story-meta">
        <span class="meta-item">{{ story.author }}</span>
        <span class="meta-item">{{ story.publishDate }}</span>
        <span class="meta-item">❤ {{ likeCount }}</span>
        <span class="meta-item">阅读: {{ story.viewCount ?? 0 }}</span>
        <span class="meta-item">★ {{ favoriteCount }}</span>
      </div>
    </div>

    <div class="story-content">
      <div class="content-image" v-if="storyCoverImage">
        <img :src="storyCoverImage" :alt="story.title" />
      </div>

      <div class="content-text markdown-body" v-html="renderedContent"></div>
    </div>

    <div class="story-actions">
      <button @click="likeStoryFn" class="btn-like" :class="{ liked: isLiked }">
        {{ isLiked ? '已点赞' : '点赞' }} ({{ likeCount }})
      </button>
      <button @click="shareStory" class="btn-share">
        分享
      </button>
      <button @click="collectStory" class="btn-collect" :class="{ collected: isCollected }">
        {{ isCollected ? '已收藏' : '收藏' }} ({{ favoriteCount }})
      </button>
    </div>

    <div class="related-stories">
      <h3>相关故事</h3>
      <div class="related-grid">
        <div v-for="related in relatedStories" :key="related.id" class="related-item"
          @click="viewRelatedStory(related.id!)">
          <img :src="formatCoverImage(related.coverImage, defaultImage)" :alt="related.title" />
          <h4>{{ related.title }}</h4>
        </div>
      </div>
    </div>
  </div>

  <div class="story-not-found" v-else>
    <h2>故事未找到</h2>
    <p>抱歉，您查找的故事不存在。</p>
    <router-link to="/stories" class="btn-back">返回故事列表</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { getStoryDetail, getStoryList, likeStory as likeStoryAPI, unlikeStory as unlikeStoryAPI, favoriteStory as favoriteStoryAPI, unfavoriteStory as unfavoriteStoryAPI, isStoryLiked, isStoryFavorited } from '@/api/story'
import type { Article } from '@/types'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import { processImageUrl } from '@/utils/image'

// 路由相关
const route = useRoute()
const router = useRouter()

// 故事数据
const story = ref<Article | null>(null)

// 当前用户ID
const currentUserId = ref<number | null>(null)

// 点赞状态
const isLiked = ref(false)
const likeCount = ref(0)

// 收藏状态
const isCollected = ref(false)
const favoriteCount = ref(0)

// 获取用户登录状态和用户信息
const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)

// 默认图片
const defaultImage = 'http://localhost:9000/animal-adopt/default.jpg'

const formatCoverImage = (cover?: string | null, fallback = '') => {
  const processed = processImageUrl(cover)
  return processed || fallback
}

const storyCoverImage = computed(() => formatCoverImage(story.value?.coverImage))

// 相关故事
const relatedStories = ref<Article[]>([])

// 宠物图片池
const petImages = ref<string[]>([])

// 渲染后的Markdown内容
const renderedContent = computed(() => {
  if (!story.value) return ''
  return marked(story.value.content)
})

// 为故事分配随机宠物图片
const assignPetImagesToStories = (stories: StoryVO[]) => {
  if (petImages.value.length === 0) return stories

  return stories.map(story => ({
    ...story,
    image: petImages.value[Math.floor(Math.random() * petImages.value.length)]
  }))
}

// 点赞故事
const likeStoryFn = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    return
  }

  if (!story.value) return

  try {
    if (isLiked.value) {
      await unlikeStoryAPI(story.value.id!)
      isLiked.value = false
      likeCount.value = Math.max(likeCount.value - 1, 0)
    } else {
      await likeStoryAPI(story.value.id!)
      isLiked.value = true
      likeCount.value += 1
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 分享故事
const shareStory = () => {
  alert('分享功能')
}

// 收藏故事
const collectStory = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    return
  }

  if (!story.value) return

  try {
    if (isCollected.value) {
      await unfavoriteStoryAPI(story.value.id!)
      isCollected.value = false
      favoriteCount.value = Math.max(favoriteCount.value - 1, 0)
      ElMessage.success('已取消收藏')
    } else {
      await favoriteStoryAPI(story.value.id!)
      isCollected.value = true
      favoriteCount.value += 1
      ElMessage.success('已收藏')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 查看相关故事
const viewRelatedStory = (id: number) => {
  router.push(`/story/${id}`)
}

// 获取宠物图片池
const fetchPetImages = async () => {
  try {
    const response = await getPetList({ current: 1, size: 100 })
    const pets = response.data?.records as Pet[] || []

    // 收集所有宠物的封面图片
    const images: string[] = []
    pets.forEach(pet => {
      if (pet.coverImage) {
        images.push(pet.coverImage)
      }
    })

    petImages.value = images
    console.log('✅ 获取宠物图片成功，共', images.length, '张')
  } catch (error) {
    console.error('获取宠物图片失败:', error)
  }
}

// 获取故事详情
const fetchStoryDetail = async () => {
  try {
    const storyId = parseInt(route.params.id as string)
    const response = await getStoryDetail(storyId)
    story.value = response.data as Article
    likeCount.value = story.value?.likeCount ?? 0
    favoriteCount.value = story.value?.favoriteCount ?? 0
    isLiked.value = story.value?.liked ?? false
    isCollected.value = story.value?.favorited ?? false

    const relatedResponse = await getStoryList({ current: 1, size: 20 })
    relatedStories.value = (relatedResponse.data?.records || []).filter(s => s.id !== story.value?.id)
  } catch (error) {
    console.error('获取故事详情失败:', error)
  }
}

// 更新点赞和收藏状态（仅当登录时）
const updateLikeAndFavoriteStatus = async () => {
  if (!story.value) return
  const storyId = story.value.id!

  if (isLoggedIn.value) {
    try {
      const likedRes = await isStoryLiked(storyId)
      isLiked.value = likedRes.data || false
      const favoritedRes = await isStoryFavorited(storyId)
      isCollected.value = favoritedRes.data || false
    } catch (e) {
      console.error('查询用户状态失败:', e)
      isLiked.value = false
      isCollected.value = false
    }
  } else {
    isLiked.value = false
    isCollected.value = false
  }
}

onMounted(() => {
  fetchPetImages()
  fetchStoryDetail()
  updateLikeAndFavoriteStatus()
})

// 监听路由参数变化，当故事ID变化时重新加载
watch(() => route.params.id, () => {
  // 滚动到页面顶部
  window.scrollTo(0, 0)
  // 重新加载故事详情
  fetchStoryDetail()
  updateLikeAndFavoriteStatus()
})

// 监听登录状态变化，重新查询点赞和收藏状态
watch(() => isLoggedIn.value, (newVal) => {
  if (story.value) {
    updateLikeAndFavoriteStatus()
  }
}, { immediate: false })
</script>

<style scoped>
.story-detail-container {
  padding: 1rem 0;
}

.story-header h1 {
  margin: 0 0 1rem 0;
  color: #333;
}

.story-meta {
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

.story-content {
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

.story-actions {
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

.related-stories h3 {
  margin-bottom: 1rem;
  color: #333;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.related-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.related-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #ff9800;
}

.related-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.related-item h4 {
  padding: 0.75rem;
  margin: 0;
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s;
}

.related-item:hover h4 {
  color: #ff9800;
}

.story-not-found {
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
  .story-actions {
    flex-direction: column;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>