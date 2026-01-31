<template>
  <el-dialog v-model="dialogVisible" :title="null" width="400" :close-on-click-modal="true" align-center
    destroy-on-close append-to-body :show-close="false" class="share-dialog">
    <div class="share-dialog-content">
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="dialogVisible = false">
        <el-icon><Close /></el-icon>
      </button>

      <!-- 头部 -->
      <div class="dialog-header">
        <h2 class="dialog-title">分享给好友</h2>
        <p class="dialog-subtitle">点击下方按钮复制图片</p>
      </div>

      <!-- 图片预览区域 -->
      <div class="image-preview" ref="imagePreviewRef">
        <img 
          v-if="imageUrl" 
          :src="processedImageUrl" 
          :alt="title"
          class="share-image"
          @load="onImageLoad"
          @error="onImageError"
        />
        <div v-else class="image-placeholder">
          <el-icon :size="48"><Picture /></el-icon>
          <span>暂无图片</span>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="imageLoading" class="image-loading">
          <el-icon class="loading-icon"><Loading /></el-icon>
        </div>
      </div>

      <!-- 标题信息 -->
      <div class="share-info" v-if="title">
        <p class="share-title">{{ title }}</p>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button 
          type="primary" 
          :loading="copying" 
          class="copy-btn"
          @click="copyImage"
        >
          <el-icon v-if="!copying"><DocumentCopy /></el-icon>
          {{ copying ? '复制中...' : '复制图片' }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Picture, Loading, DocumentCopy } from '@element-plus/icons-vue'
import { processImageUrl } from '@/utils/image'

defineOptions({
  name: 'ShareDialog'
})

const props = defineProps<{
  modelValue: boolean
  imageUrl?: string
  title?: string
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const imagePreviewRef = ref<HTMLElement>()
const imageLoading = ref(true)
const copying = ref(false)

// 处理图片 URL
const processedImageUrl = computed(() => {
  return props.imageUrl ? processImageUrl(props.imageUrl) : ''
})

// 图片加载完成
const onImageLoad = () => {
  imageLoading.value = false
}

// 图片加载失败
const onImageError = () => {
  imageLoading.value = false
  ElMessage.warning('图片加载失败')
}

// 复制图片到剪贴板
const copyImage = async () => {
  if (!props.imageUrl) {
    ElMessage.warning('暂无图片可复制')
    return
  }

  copying.value = true
  
  try {
    // 获取图片元素
    const imgElement = imagePreviewRef.value?.querySelector('img')
    if (!imgElement) {
      throw new Error('图片元素不存在')
    }

    // 创建 canvas 绘制图片
    const canvas = document.createElement('canvas')
    canvas.width = imgElement.naturalWidth
    canvas.height = imgElement.naturalHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('无法创建 canvas 上下文')
    }
    
    ctx.drawImage(imgElement, 0, 0)
    
    // 转换为 blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('无法生成图片'))
        }
      }, 'image/png')
    })

    // 复制到剪贴板
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ])

    ElMessage.success('图片已复制到剪贴板')
  } catch (error: any) {
    console.error('复制图片失败:', error)
    
    // 如果复制图片失败，尝试复制链接
    try {
      await navigator.clipboard.writeText(processedImageUrl.value)
      ElMessage.success('已复制图片链接')
    } catch {
      ElMessage.error('复制失败，请手动保存图片')
    }
  } finally {
    copying.value = false
  }
}

// 监听弹窗打开，重置状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    imageLoading.value = true
  }
})
</script>

<style>
/* 全局样式 - 确保所有页面生效 */
.share-dialog.el-dialog {
  max-width: 400px;
  width: 90%;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.share-dialog .el-dialog__header {
  display: none !important;
  padding: 0 !important;
  margin: 0 !important;
  height: 0 !important;
}

.share-dialog .el-dialog__headerbtn {
  display: none !important;
}

.share-dialog .el-dialog__body {
  padding: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 24px;
}
</style>

<style scoped>
/* 背景模糊与遮罩 */
:deep(.el-overlay) {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.25);
}

/* 内容容器 */
.share-dialog-content {
  padding: 12px 24px 24px;
  position: relative;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 8px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
}

.close-btn .el-icon {
  font-size: 16px;
  color: #666;
}

/* 头部 */
.dialog-header {
  text-align: center;
  margin-bottom: 12px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.dialog-subtitle {
  font-size: 13px;
  color: #7c8fa3;
  margin: 0;
}

/* 图片预览区域 */
.image-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #c0c4cc;
}

.image-placeholder span {
  font-size: 14px;
}

.image-loading {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-icon {
  font-size: 32px;
  color: #ff8c42;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 分享信息 */
.share-info {
  margin-top: 16px;
  text-align: center;
}

.share-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 操作按钮 */
.action-buttons {
  margin-top: 20px;
}

.copy-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  border: none;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(255, 140, 66, 0.3);
  transition: all 0.3s ease;
}

.copy-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff7a1f 0%, #ff5a1f 100%);
  box-shadow: 0 12px 32px rgba(255, 120, 54, 0.4);
  transform: translateY(-2px);
}

.copy-btn:active:not(:disabled) {
  transform: translateY(0);
}

.copy-btn .el-icon {
  margin-right: 6px;
}

/* 响应式 */
@media (max-width: 480px) {
  :deep(.share-dialog.el-dialog) {
    width: 95%;
    border-radius: 20px;
  }
  
  .share-dialog-content {
    padding: 20px;
  }
  
  .dialog-title {
    font-size: 18px;
  }
}
</style>
