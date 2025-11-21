<template>
  <div class="story-detail-container" v-if="story">
    <div class="story-header">
      <h1>{{ story.title }}</h1>
      <div class="story-meta">
        <span class="meta-item">{{ story.author }}</span>
        <span class="meta-item">{{ story.publishDate }}</span>
        <span class="meta-item">❤ {{ story.likes }}</span>
      </div>
    </div>
    
    <div class="story-content">
      <div class="content-image" v-if="story.image">
        <img :src="story.image" :alt="story.title" />
      </div>
      
      <div class="content-text markdown-body" v-html="renderedContent"></div>
    </div>
    
    <div class="story-actions">
      <button @click="likeStory" class="btn-like" :class="{ liked: isLiked }">
        {{ isLiked ? '已点赞' : '点赞' }} ({{ likeCount }})
      </button>
      <button @click="shareStory" class="btn-share">
        分享
      </button>
      <button @click="collectStory" class="btn-collect" :class="{ collected: isCollected }">
        {{ isCollected ? '已收藏' : '收藏' }}
      </button>
    </div>
    
    <div class="related-stories">
      <h3>相关故事</h3>
      <div class="related-grid">
        <div 
          v-for="related in relatedStories" 
          :key="related.id" 
          class="related-item"
          @click="viewRelatedStory(related.id)"
        >
          <img :src="related.image || defaultImage" :alt="related.title" />
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStoryDetail, getAllStories, likeStory as likeStoryAPI, unlikeStory as unlikeStoryAPI, favoriteStory as favoriteStoryAPI, unfavoriteStory as unfavoriteStoryAPI, type StoryVO } from '@/api/story'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'

// 路由相关
const route = useRoute()
const router = useRouter()

// 故事数据
const story = ref<StoryVO | null>(null)

// 当前用户ID
const currentUserId = ref<number | null>(null)

// 点赞状态
const isLiked = ref(false)
const likeCount = ref(0)

// 收藏状态
const isCollected = ref(false)

// 默认图片
const defaultImage = 'https://via.placeholder.com/100x100?text=故事'

// 相关故事
const relatedStories = ref<StoryVO[]>([])

// 渲染后的Markdown内容
const renderedContent = computed(() => {
  if (!story.value) return ''
  return marked(story.value.content)
})

// 点赞故事
const likeStory = async () => {
  if (!currentUserId.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  if (!story.value) return
  
  try {
    if (isLiked.value) {
      await unlikeStoryAPI(story.value.id, currentUserId.value)
      isLiked.value = false
      likeCount.value--
    } else {
      await likeStoryAPI(story.value.id, currentUserId.value)
      isLiked.value = true
      likeCount.value++
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
  if (!currentUserId.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  if (!story.value) return
  
  try {
    if (isCollected.value) {
      await unfavoriteStoryAPI(story.value.id, currentUserId.value)
      isCollected.value = false
      ElMessage.success('已取消收藏')
    } else {
      await favoriteStoryAPI(story.value.id, currentUserId.value)
      isCollected.value = true
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

// 获取故事详情
const fetchStoryDetail = async () => {
  try {
    const storyId = parseInt(route.params.id as string)
    const response = await getStoryDetail(storyId, currentUserId.value || undefined)
    story.value = response.data as StoryVO
    
    if (story.value) {
      // 从响应中获取点赞状态和点赞数
      isLiked.value = story.value.liked || false
      likeCount.value = story.value.likes
      
      // 从响应中获取收藏状态
      isCollected.value = story.value.favorited || false
      
      // 获取所有故事用于显示相关故事
      const allStoriesResponse = await getAllStories()
      const allStories = allStoriesResponse.data as StoryVO[]
      // 获取其他故事作为相关故事
      relatedStories.value = allStories
        .filter(s => s.id !== story.value?.id)
        .slice(0, 2)
    }
  } catch (error) {
    console.error('获取故事详情失败:', error)
  }
}

onMounted(() => {
  // 从localStorage获取当前用户ID
  const userInfo = localStorage.getItem('userInfo')
  console.log('localStorage userInfo:', userInfo)
  
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      console.log('解析后的用户信息:', user)
      currentUserId.value = user.id || user.userId
      console.log('当前用户ID:', currentUserId.value)
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  } else {
    console.warn('localStorage中没有userInfo')
  }
  
  fetchStoryDetail()
})
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

.btn-like, .btn-share, .btn-collect {
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