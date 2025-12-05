<template>
  <div class="profile-container">
    <h1>个人中心</h1>

    <div class="profile-content">
      <div class="profile-sidebar">
        <div class="user-info">
          <div class="avatar">
            <img :src="user.avatar ? processImageUrl(user.avatar) : defaultAvatar" :alt="user.name" />
            <button class="btn-edit-avatar" @click="triggerAvatarUpload">编辑头像</button>
            <input ref="avatarInput" type="file" accept="image/*" style="display: none" @change="handleAvatarUpload" />
          </div>
          <h2>{{ user.name }}</h2>
          <p class="user-role">{{ userRole }}</p>
          <button v-if="userStore.isManager" class="btn-admin" @click="goAdmin">进入后台系统</button>
        </div>

        <nav class="profile-nav">
          <ul>
            <li v-for="item in navItems" :key="item.key" :class="{ active: activeTab === item.key }"
              @click="activeTab = item.key">
              {{ item.label }}
            </li>
          </ul>
        </nav>
      </div>

      <div class="profile-main">
        <!-- 基本信息 -->
        <div v-if="activeTab === 'basic'" class="profile-section">
          <h3>基本信息</h3>
          <form @submit.prevent="updateBasicInfo">
            <div class="form-group">
              <label>用户名:</label>
              <input v-model="basicForm.name" type="text" :readonly="!editingBasic" />
            </div>

            <div class="form-group">
              <label>邮箱:</label>
              <input v-model="basicForm.email" type="email" :readonly="!editingBasic" />
            </div>

            <div class="form-group">
              <label for="phone">手机号:</label>
              <input id="phone" v-model="basicForm.phone" type="tel" :readonly="!editingBasic" />
            </div>

            <div class="form-group">
              <label for="address">地址:</label>
              <input id="address" v-model="basicForm.address" type="text" :readonly="!editingBasic" />
            </div>

            <div class="form-actions">
              <button type="button" @click="toggleEditBasic" class="btn-edit">
                {{ editingBasic ? '取消' : '编辑' }}
              </button>
              <button v-if="editingBasic" type="submit" class="btn-save">
                保存
              </button>
            </div>
          </form>

          <div class="password-card">
            <div class="password-card__header">
              <div>
                <h4>密码设置</h4>
                <p>{{ hasPassword ? '定期修改密码可以提升账户安全' : '尚未设置密码，建议立即设置' }}</p>
              </div>
              <button class="btn-inline" @click="openPasswordDialog">
                {{ hasPassword ? '修改密码' : '设置密码' }}
              </button>
            </div>
            <button v-if="!hasPassword" class="btn-link" @click="openPasswordDialog">
              还未设置密码？点此设置
            </button>
          </div>
          <el-dialog v-model="showPasswordDialog" :title="hasPassword ? '修改密码' : '设置密码'" width="460px" class="password-dialog" destroy-on-close>
            <div class="password-form">
              <el-form label-position="top" :model="passwordForm">
                <transition-group name="fade-slide" tag="div">
                  <el-form-item v-if="hasPassword" key="old" label="旧密码" :error="passwordErrors.oldPassword">
                    <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" show-password />
                  </el-form-item>
                  <el-form-item key="new" label="新密码" :error="passwordErrors.newPassword">
                    <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
                  </el-form-item>
                  <el-form-item key="confirm" label="确认新密码" :error="passwordErrors.confirmPassword">
                    <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
                  </el-form-item>
                </transition-group>
              </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="closePasswordDialog">取消</el-button>
                <el-button type="primary" @click="submitPasswordChange">确定</el-button>
              </span>
            </template>
          </el-dialog>
        </div>

        <!-- 领养者认证 -->
        <div v-if="activeTab === 'certification'" class="profile-section">
          <h3>领养者认证</h3>
          <div class="certification-status">
            <div class="status-info">
              <span class="status-label">认证状态:</span>
              <span :class="certificationStatusClass">{{ certificationStatusText }}</span>
            </div>

            <div v-if="user.certificationStatus === 'pending' && !pendingResubmitMode" class="status-message">
              <p>您的认证申请正在审核中，请耐心等待。</p>
              <button class="btn-resubmit" @click="requestResubmitDuringPending">
                信息有误，重新上传
              </button>
            </div>

            <div v-if="user.certificationStatus === 'rejected'" class="status-message status-message-rejected">
              <p><strong>认证被拒绝</strong></p>
              <p class="reject-reason">拒绝原因：{{ user.certificationRejectReason }}</p>
              <button @click="resubmitCertification" class="btn-resubmit">
                重新提交认证
              </button>
            </div>

            <div v-if="user.certificationStatus === 'approved'" class="status-message">
              <p>您已通过领养者认证，可以进行领养申请。</p>
              <button @click="updateCertification" class="btn-update-certification">
                更新认证信息
              </button>
            </div>

            <div v-if="showCertificationForm" class="certification-form">
              <p v-if="pendingResubmitMode" class="notice">* 当前为重新上传模式，提交后将覆盖原申请</p>
              <p>您尚未提交领养者认证申请，请填写以下信息进行认证。</p>

              <form @submit.prevent="submitCertificationHandler">
                <div class="form-group">
                  <label for="idCard">身份证号码:</label>
                  <input id="idCard" v-model="certificationForm.idCard" type="text" required />
                </div>

                <div class="form-group">
                  <label for="idCardFront">身份证正面:</label>
                  <div class="file-upload" @click="triggerFileInput('idCardFront')">
                    <input ref="idCardFrontInput" id="idCardFront" type="file"
                      @change="handleFileUpload('idCardFront', $event)" accept="image/*" />
                    <div v-if="certificationForm.idCardFrontPreview" class="file-preview">
                      <img :src="certificationForm.idCardFrontPreview" alt="身份证正面" />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="idCardBack">身份证反面:</label>
                  <div class="file-upload" @click="triggerFileInput('idCardBack')">
                    <input ref="idCardBackInput" id="idCardBack" type="file"
                      @change="handleFileUpload('idCardBack', $event)" accept="image/*" />
                    <div v-if="certificationForm.idCardBackPreview" class="file-preview">
                      <img :src="certificationForm.idCardBackPreview" alt="身份证反面" />
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn-submit-certification">
                  提交认证
                </button>
              </form>
            </div>

            <!-- 更新认证表单 -->
            <div v-if="user.certificationStatus === 'approved' && showUpdateForm" class="certification-form">
              <p>更新您的认证信息（如身份证已过期或需要更新）</p>

              <form @submit.prevent="submitUpdateCertificationHandler">
                <div class="form-group">
                  <label for="updateIdCard">身份证号码:</label>
                  <input id="updateIdCard" v-model="updateCertificationForm.idCard" type="text" required />
                </div>

                <div class="form-group">
                  <label for="updateIdCardFront">身份证正面:</label>
                  <div class="file-upload" @click="triggerFileInput('updateIdCardFront')">
                    <input ref="updateIdCardFrontInput" id="updateIdCardFront" type="file"
                      @change="handleUpdateFileUpload('idCardFront', $event)" accept="image/*" />
                    <div v-if="updateCertificationForm.idCardFrontPreview" class="file-preview">
                      <img :src="updateCertificationForm.idCardFrontPreview" alt="身份证正面" />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="updateIdCardBack">身份证反面:</label>
                  <div class="file-upload" @click="triggerFileInput('updateIdCardBack')">
                    <input ref="updateIdCardBackInput" id="updateIdCardBack" type="file"
                      @change="handleUpdateFileUpload('idCardBack', $event)" accept="image/*" />
                    <div v-if="updateCertificationForm.idCardBackPreview" class="file-preview">
                      <img :src="updateCertificationForm.idCardBackPreview" alt="身份证反面" />
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn-submit-certification">
                    提交更新
                  </button>
                  <button type="button" @click="cancelUpdateCertification" class="btn-cancel">
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- 我的申请 -->
        <div v-if="activeTab === 'applications'" class="profile-section">
          <div class="section-head">
            <h3>我的领养申请</h3>
            <span v-if="applications.length" class="application-count">共 {{ applications.length }} 条</span>
          </div>

          <div v-if="loadingApplications" class="applications-loading">
            正在加载申请列表，请稍候...
          </div>

          <div v-else-if="applications.length === 0" class="no-applications">
            <p>您还没有提交任何领养申请。</p>
            <router-link to="/pets" class="btn-browse-pets">浏览可领养宠物</router-link>
          </div>

          <div v-else class="applications-list">
            <div v-for="application in applications" :key="application.id" class="application-item">
              <div class="application-pet">
                <img :src="getPetCover(application)" :alt="application.petName || '宠物封面'" />
                <div class="application-pet-meta">
                  <p class="pet-name">{{ application.petName || '未命名宠物' }}</p>
                  <p class="pet-category">{{ formatPetCategory(application.petCategory) }}</p>
                </div>
              </div>

              <div class="application-body">
                <div class="application-header">
                  <div>
                    <p class="application-no">申请编号：{{ application.applicationNo || '—' }}</p>
                    <p class="timeline">
                      <span>申请时间：{{ formatDateTime(application.createTime) }}</span>
                      <span>更新时间：{{ formatDateTime(application.updateTime) }}</span>
                    </p>
                  </div>
                  <span :class="applicationStatusClass(application.status)">
                    {{ applicationStatusText(application.status) }}
                  </span>
                </div>

                <div class="application-snippet">
                  <p><strong>理由：</strong>{{ application.reason || '—' }}</p>
                  <p><strong>家庭信息：</strong>{{ application.familyInfo || '—' }}</p>
                </div>

                <div class="application-actions">
                  <button @click="viewApplication(application.id)" class="btn-view">
                    查看详情
                  </button>
                  <button v-if="normalizeStatus(application.status) === 'pending'"
                    :disabled="cancelingId === application.id" @click="cancelApplication(application.id)"
                    class="btn-cancel">
                    {{ cancelingId === application.id ? '撤销中...' : '撤销申请' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 我的点赞 -->
        <div v-if="activeTab === 'likes'" class="profile-section">
          <div class="section-head">
            <h3>我的点赞</h3>
            <div class="section-actions">
              <div class="category-toggle pill-toggle">
                <button class="pill-option" type="button" :class="{ active: likeCategory === 'pet' }"
                  @click="likeCategory = 'pet'">
                  <svg class="pill-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="6" cy="9" r="2.4" />
                    <circle cx="18" cy="9" r="2.4" />
                    <circle cx="9" cy="4.5" r="2.2" />
                    <circle cx="15" cy="4.5" r="2.2" />
                    <path d="M12 11c-2.7 0-5.2 1.7-5.2 4.6 0 2.4 2 4.4 5.2 4.4s5.2-2 5.2-4.4C17.2 12.7 14.7 11 12 11Z"
                      fill="currentColor" />
                  </svg>
                  <span>宠物</span>
                </button>
                <button class="pill-option" type="button" :class="{ active: likeCategory === 'article' }"
                  @click="likeCategory = 'article'">
                  <svg class="pill-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M9 13h6" />
                    <path d="M9 17h4" />
                  </svg>
                  <span>文章</span>
                </button>
              </div>
              <span v-if="filteredLikedItems.length" class="count-badge">共 {{ filteredLikedItems.length }} 项</span>
            </div>
          </div>

          <div v-if="loadingLikes" class="loading-message">
            正在加载点赞列表，请稍候...
          </div>

          <div v-else-if="filteredLikedItems.length === 0" class="empty-message">
            <p>当前分类下暂无点赞内容。</p>
          </div>

          <div v-else class="likes-grid">
            <div v-for="item in filteredLikedItems" :key="`${item.type}-${item.id}`" class="like-item">
              <div class="item-image">
                <img :src="getItemImage(item)" :alt="item.title" />
              </div>
              <div class="item-info">
                <h4>{{ item.title }}</h4>
                <p class="item-type">{{ getItemTypeLabel(item.type) }}</p>
                <p v-if="item.description" class="item-description">{{ item.description }}</p>
              </div>
              <div class="item-actions">
                <button @click="viewLikedItem(item)" class="btn-view-item">查看</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'favorites'" class="profile-section">
          <div class="section-head">
            <h3>我的收藏</h3>
            <div class="section-actions">
              <div class="category-toggle pill-toggle">
                <button class="pill-option" type="button" :class="{ active: favoriteCategory === 'pet' }"
                  @click="favoriteCategory = 'pet'">
                  <svg class="pill-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="6" cy="9" r="2.4" />
                    <circle cx="18" cy="9" r="2.4" />
                    <circle cx="9" cy="4.5" r="2.2" />
                    <circle cx="15" cy="4.5" r="2.2" />
                    <path d="M12 11c-2.7 0-5.2 1.7-5.2 4.6 0 2.4 2 4.4 5.2 4.4s5.2-2 5.2-4.4C17.2 12.7 14.7 11 12 11Z"
                      fill="currentColor" />
                  </svg>
                  <span>宠物</span>
                </button>
                <button class="pill-option" type="button" :class="{ active: favoriteCategory === 'article' }"
                  @click="favoriteCategory = 'article'">
                  <svg class="pill-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M9 13h6" />
                    <path d="M9 17h4" />
                  </svg>
                  <span>文章</span>
                </button>
              </div>
              <span v-if="filteredFavoriteItems.length" class="count-badge">共 {{ filteredFavoriteItems.length }} 项</span>
            </div>
          </div>

          <div v-if="loadingFavorites" class="loading-message">
            正在加载收藏列表，请稍候...
          </div>

          <div v-else-if="filteredFavoriteItems.length === 0" class="empty-message">
            <p>当前分类下暂无收藏内容。</p>
          </div>

          <div v-else class="favorites-grid">
            <div v-for="item in filteredFavoriteItems" :key="`${item.type}-${item.id}`" class="favorite-item">
              <div class="item-image">
                <img :src="getItemImage(item)" :alt="item.title" />
              </div>
              <div class="item-info">
                <h4>{{ item.title }}</h4>
                <p class="item-type">{{ getItemTypeLabel(item.type) }}</p>
                <p v-if="item.description" class="item-description">{{ item.description }}</p>
              </div>
              <div class="item-actions">
                <button @click="viewFavoriteItem(item)" class="btn-view-item">查看</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getCertificationInfo, submitCertification, updateUserInfo, uploadUserAvatar, changePassword } from '@/api/user'
import { getMyApplications, cancelApplication as cancelApplicationApi } from '@/api/application'
import { getUserLikedPets } from '@/api/like'
import { getUserFavoritePets } from '@/api/favorite'
import { getUserLikedArticles, getUserFavoritedArticles } from '@/api/article'
import type { AdoptionApplication, Pet, Article } from '@/types'

// 获取 userStore
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 用户信息
const idCardFrontInput = ref<HTMLInputElement | null>(null)
const idCardBackInput = ref<HTMLInputElement | null>(null)
const updateIdCardFrontInput = ref<HTMLInputElement | null>(null)
const updateIdCardBackInput = ref<HTMLInputElement | null>(null)

type FileInputField = 'idCardFront' | 'idCardBack' | 'updateIdCardFront' | 'updateIdCardBack'

const fileInputMap: Record<FileInputField, Ref<HTMLInputElement | null>> = {
  idCardFront: idCardFrontInput,
  idCardBack: idCardBackInput,
  updateIdCardFront: updateIdCardFrontInput,
  updateIdCardBack: updateIdCardBackInput
}

const triggerFileInput = (field: FileInputField) => {
  fileInputMap[field]?.value?.click()
}

const user = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  role: 'user',
  certificationStatus: 'not_submitted' as 'not_submitted' | 'pending' | 'approved' | 'rejected',
  certificationRejectReason: '',
  hasPassword: true
})

const basicForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
})

// 认证表单
const certificationForm = reactive({
  idCard: '',
  idCardFront: null as File | null,
  idCardBack: null as File | null,
  idCardFrontPreview: '',
  idCardBackPreview: ''
})

const pendingResubmitMode = ref(false)

const resetCertificationFormState = () => {
  certificationForm.idCard = ''
  certificationForm.idCardFront = null
  certificationForm.idCardBack = null
  certificationForm.idCardFrontPreview = ''
  certificationForm.idCardBackPreview = ''
}

// 默认头像
const defaultAvatar = 'http://localhost:9000/animal-adopt/default.jpg'
const defaultPetCover = 'http://localhost:9000/animal-adopt/default.jpg'

// 处理图片URL（移除@前缀，处理IP地址替换）
function processImageUrl(url: string | undefined): string {
  if (!url) return ''

  // 移除@前缀
  if (url.startsWith('@')) {
    url = url.substring(1)
  }

  // 将IP地址替换为localhost
  url = url.replace(/https?:\/\/\d+\.\d+\.\d+\.\d+:9000/, 'http://localhost:9000')

  // 如果是相对路径，添加MinIO前缀
  if (!url.startsWith('http')) {
    url = `http://localhost:9000/animal-adopt${url.startsWith('/') ? '' : '/'}${url}`
  }

  return url
}

// 用户角色
const userRole = computed(() => {
  const role = String(user.value.role || '').toLowerCase()
  const roleMap: Record<string, string> = {
    'admin': '管理员',
    'super_admin': '超级管理员',
    'application_auditor': '审核员',
    'user': '普通用户'
  }
  return roleMap[role] || '普通用户'
})

// 激活的标签页
const route = useRoute()
const resolveTab = (tab?: string | string[]) => {
  if (tab === 'certification' || tab === 'applications' || tab === 'basic' || tab === 'likes' || tab === 'favorites') return tab
  return 'basic'
}
const activeTab = ref(resolveTab(route.query.tab as string | undefined))

// 点赞 / 收藏列表与分类状态
const likedItems = ref<LikeItem[]>([])
const favoriteItems = ref<LikeItem[]>([])
const likeCategory = ref<'pet' | 'article'>('pet')
const favoriteCategory = ref<'pet' | 'article'>('pet')
const loadingLikes = ref(false)
const loadingFavorites = ref(false)

const resolveCategoryFilter = (category?: string | string[]): 'pet' | 'article' => {
  if (category === 'article') return 'article'
  return 'pet'
}

const applyCategoryFromRoute = () => {
  const category = resolveCategoryFilter(route.query.category as string | undefined)
  if (activeTab.value === 'likes') {
    likeCategory.value = category
  } else if (activeTab.value === 'favorites') {
    favoriteCategory.value = category
  }
}

const loadingProfile = ref(false)

const syncUserFromStore = () => {
  if (!userInfo.value) return
  const info = userInfo.value
  user.value.name = info.username || info.email || '用户'
  user.value.email = info.email || ''
  user.value.phone = info.phone || ''
  user.value.address = (info as any).address || ''
  user.value.avatar = info.avatar ? processImageUrl(info.avatar) : ''
  user.value.role = info.role || 'user'
  user.value.hasPassword = Object.prototype.hasOwnProperty.call(info, 'hasPassword') ? Boolean((info as any).hasPassword) : true
  if (!editingBasic.value) {
    basicForm.name = user.value.name
    basicForm.email = user.value.email
    basicForm.phone = user.value.phone
    basicForm.address = user.value.address
  }
}

const loadUserProfile = async () => {
  loadingProfile.value = true
  try {
    await userStore.getUserInfo()
    syncUserFromStore()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    loadingProfile.value = false
  }
}

watch(userInfo, () => {
  syncUserFromStore()
})

watch(
  () => route.query.tab,
  (tab) => {
    if (tab === 'certification' || tab === 'basic' || tab === 'applications' || tab === 'likes' || tab === 'favorites') {
      activeTab.value = tab
    } else {
      activeTab.value = 'basic'
    }
    applyCategoryFromRoute()
    ensureTabDataLoaded(activeTab.value)
  }
)

watch(
  () => route.query.category,
  () => {
    applyCategoryFromRoute()
  }
)

onMounted(() => {
  applyCategoryFromRoute()
})

watch(activeTab, (tab, prev) => {
  if (prev === 'certification' && tab !== 'certification' && pendingResubmitMode.value) {
    pendingResubmitMode.value = false
    resetCertificationFormState()
  }
})

// 导航项
const navItems = [
  { key: 'basic', label: '基本信息' },
  { key: 'certification', label: '领养者认证' },
  { key: 'applications', label: '我的申请' },
  { key: 'likes', label: '我的点赞' },
  { key: 'favorites', label: '我的收藏' }
]

// 编辑基本信息状态
const editingBasic = ref(false)

// 领养申请列表
const applications = ref<AdoptionApplication[]>([])
const loadingApplications = ref(false)
const cancelingId = ref<number | null>(null)

// 路由
const router = useRouter()
const goAdmin = () => { router.push('/admin') }

// 认证状态文本
const certificationStatusText = computed(() => {
  switch (user.value.certificationStatus) {
    case 'not_submitted': return '未提交'
    case 'pending': return '审核中'
    case 'approved': return '已认证'
    case 'rejected': return '已拒绝'
    default: return '未知'
  }
})

// 认证状态样式
const certificationStatusClass = computed(() => {
  return {
    'status-not-submitted': user.value.certificationStatus === 'not_submitted',
    'status-pending': user.value.certificationStatus === 'pending',
    'status-approved': user.value.certificationStatus === 'approved',
    'status-rejected': user.value.certificationStatus === 'rejected'
  }
})

const showCertificationForm = computed(() => user.value.certificationStatus === 'not_submitted' || pendingResubmitMode.value)

// 申请状态文本
const normalizeStatus = (status?: string) => String(status || '').toLowerCase()

const applicationStatusText = (status?: string) => {
  switch (normalizeStatus(status)) {
    case 'pending': return '审核中'
    case 'approved': return '已通过'
    case 'rejected': return '已拒绝'
    case 'cancelled': return '已撤销'
    default: return '未知'
  }
}

// 申请状态样式
const applicationStatusClass = (status?: string) => {
  const normalized = normalizeStatus(status)
  return {
    'status-pending': normalized === 'pending',
    'status-approved': normalized === 'approved',
    'status-rejected': normalized === 'rejected',
    'status-cancelled': normalized === 'cancelled'
  }
}

// 切换编辑基本信息状态
const resetBasicForm = () => {
  basicForm.name = user.value.name
  basicForm.email = user.value.email
  basicForm.phone = user.value.phone
  basicForm.address = user.value.address
}

const toggleEditBasic = () => {
  if (editingBasic.value) {
    resetBasicForm()
    editingBasic.value = false
  } else {
    resetBasicForm()
    editingBasic.value = true
  }
}

// 更新基本信息
const updateBasicInfo = async () => {
  if (!editingBasic.value) return
  try {
    await updateUserInfo({
      username: basicForm.name,
      email: basicForm.email,
      phone: basicForm.phone,
      address: basicForm.address
    })
    ElMessage.success('基本信息更新成功')
    await userStore.getUserInfo()
    syncUserFromStore()
    user.value.name = basicForm.name
    user.value.email = basicForm.email
    user.value.phone = basicForm.phone
    user.value.address = basicForm.address
    editingBasic.value = false
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新失败，请稍后重试')
  }
}

// 头像输入框引用
const avatarInput = ref<HTMLInputElement>()

// 触发头像上传
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

// 处理头像上传
const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 验证文件大小（限制为 5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB')
    return
  }

  let loadingInstance: ReturnType<typeof ElLoading.service> | null = null
  try {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '正在上传头像...',
      background: 'rgba(0, 0, 0, 0.35)'
    })

    // 调用后端 API 上传头像
    const res = await uploadUserAvatar(file)

    // 更新本地用户信息
    if (res.data?.avatar) {
      user.value.avatar = processImageUrl(res.data.avatar)
    }

    // 刷新用户信息
    await userStore.getUserInfo()
    syncUserFromStore()

    ElMessage.success('头像更新成功')

  } catch (error) {
    console.error('上传头像失败:', error)
    ElMessage.error('上传头像失败，请稍后重试')
  } finally {
    loadingInstance?.close()
    // 清空输入框
    if (avatarInput.value) {
      avatarInput.value.value = ''
    }
  }
}

// 处理文件上传
const handleFileUpload = (field: 'idCardFront' | 'idCardBack', event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // 保存文件
    if (field === 'idCardFront') {
      certificationForm.idCardFront = file
    } else {
      certificationForm.idCardBack = file
    }

    // 生成预览
    const reader = new FileReader()
    reader.onload = (e) => {
      if (field === 'idCardFront') {
        certificationForm.idCardFrontPreview = e.target?.result as string
      } else {
        certificationForm.idCardBackPreview = e.target?.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

// 提交认证
const submitCertificationHandler = async () => {
  if (!certificationForm.idCard) {
    ElMessage.error('请输入身份证号码')
    return
  }

  if (!certificationForm.idCardFront) {
    ElMessage.error('请上传身份证正面照片')
    return
  }

  if (!certificationForm.idCardBack) {
    ElMessage.error('请上传身份证反面照片')
    return
  }

  try {
    await ElMessageBox.confirm(
      '请确认您填写的信息和上传的证件照片均准确无误，\n是否确认提交？',
      '确认提交',
      {
        confirmButtonText: '确认提交',
        cancelButtonText: '重新检查',
        type: 'warning'
      }
    )
  } catch {
    return
  }

  try {
    const formData = new FormData()
    formData.append('idCard', certificationForm.idCard)
    formData.append('idCardFront', certificationForm.idCardFront)
    formData.append('idCardBack', certificationForm.idCardBack)

    await submitCertification(formData)

    // 提交成功后更新状态
    user.value.certificationStatus = 'pending'

    // 清空表单
    certificationForm.idCard = ''
    certificationForm.idCardFront = null
    certificationForm.idCardBack = null
    certificationForm.idCardFrontPreview = ''
    certificationForm.idCardBackPreview = ''

    ElMessage.success('认证申请提交成功，请等待审核')
  } catch (error) {
    ElMessage.error('提交认证失败，请重试')
    console.error('提交认证失败:', error)
  }
}

// 重新提交认证
const resubmitCertification = (options?: { preserveForm?: boolean }) => {
  user.value.certificationStatus = 'not_submitted'
  if (options?.preserveForm) return
  resetCertificationFormState()
}

// 更新认证表单数据
const showPasswordDialog = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const openPasswordDialog = () => {
  resetPasswordForm()
  showPasswordDialog.value = true
}

const closePasswordDialog = () => {
  showPasswordDialog.value = false
}

const resetPasswordForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordErrors.oldPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''
}

const hasPassword = computed(() => user.value.hasPassword !== false)

const validatePasswordForm = () => {
  let valid = true
  passwordErrors.oldPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''

  if (hasPassword.value && !passwordForm.oldPassword) {
    passwordErrors.oldPassword = '请输入旧密码'
    valid = false
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = '请输入新密码'
    valid = false
  } else if (passwordForm.newPassword.length < 6) {
    passwordErrors.newPassword = '密码长度至少 6 位'
    valid = false
  }

  if (!passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = '请再次输入新密码'
    valid = false
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = '两次输入的新密码不一致'
    valid = false
  }

  return valid
}

const submitPasswordChange = async () => {
  if (!validatePasswordForm()) return

  try {
    await changePassword({
      oldPassword: hasPassword.value ? passwordForm.oldPassword : '',
      newPassword: passwordForm.newPassword
    })
    ElMessage.success(hasPassword.value ? '密码修改成功' : '密码设置成功')
    resetPasswordForm()
    closePasswordDialog()
    await userStore.getUserInfo()
    user.value.hasPassword = true
  } catch (error) {
    console.error('修改密码失败:', error)
  }
}

const showUpdateForm = ref(false)
const updateCertificationForm = reactive({
  idCard: '',
  idCardFront: null as File | null,
  idCardBack: null as File | null,
  idCardFrontPreview: '',
  idCardBackPreview: ''
})

// 打开更新认证表单
const updateCertification = () => {
  showUpdateForm.value = true
  // 可选：预填当前的身份证号码
  updateCertificationForm.idCard = ''
  updateCertificationForm.idCardFront = null
  updateCertificationForm.idCardBack = null
  updateCertificationForm.idCardFrontPreview = ''
  updateCertificationForm.idCardBackPreview = ''
}

// 处理更新认证文件上传
const handleUpdateFileUpload = (field: 'idCardFront' | 'idCardBack', event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // 保存文件
    if (field === 'idCardFront') {
      updateCertificationForm.idCardFront = file
    } else {
      updateCertificationForm.idCardBack = file
    }

    // 生成预览
    const reader = new FileReader()
    reader.onload = (e) => {
      if (field === 'idCardFront') {
        updateCertificationForm.idCardFrontPreview = e.target?.result as string
      } else {
        updateCertificationForm.idCardBackPreview = e.target?.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

// 提交更新认证
const submitUpdateCertificationHandler = async () => {
  if (!updateCertificationForm.idCard) {
    ElMessage.error('请输入身份证号码')
    return
  }

  if (!updateCertificationForm.idCardFront) {
    ElMessage.error('请上传身份证正面照片')
    return
  }

  if (!updateCertificationForm.idCardBack) {
    ElMessage.error('请上传身份证反面照片')
    return
  }

  try {
    await ElMessageBox.confirm(
      '请再次核对更新后的信息与证件照片，确认提交审核？',
      '确认更新',
      {
        confirmButtonText: '确认提交',
        cancelButtonText: '再检查一下',
        type: 'warning'
      }
    )
  } catch {
    return
  }

  try {
    const formData = new FormData()
    formData.append('idCard', updateCertificationForm.idCard)
    formData.append('idCardFront', updateCertificationForm.idCardFront)
    formData.append('idCardBack', updateCertificationForm.idCardBack)

    // 调用更新认证 API
    await submitCertification(formData)

    // 更新成功后状态变为待审核
    user.value.certificationStatus = 'pending'
    showUpdateForm.value = false

    // 清空表单
    updateCertificationForm.idCard = ''
    updateCertificationForm.idCardFront = null
    updateCertificationForm.idCardBack = null
    updateCertificationForm.idCardFrontPreview = ''
    updateCertificationForm.idCardBackPreview = ''

    ElMessage.success('认证信息更新成功，请等待审核')
  } catch (error) {
    ElMessage.error('更新认证失败，请重试')
    console.error('更新认证失败:', error)
  }
}

// 取消更新认证
const cancelUpdateCertification = () => {
  showUpdateForm.value = false
  updateCertificationForm.idCard = ''
  updateCertificationForm.idCardFront = null
  updateCertificationForm.idCardBack = null
  updateCertificationForm.idCardFrontPreview = ''
  updateCertificationForm.idCardBackPreview = ''
}

const requestResubmitDuringPending = async () => {
  try {
    await ElMessageBox.confirm(
      '当前认证正在审核中，确认撤回并重新上传吗？',
      '重新上传确认',
      {
        confirmButtonText: '重新上传',
        cancelButtonText: '再等等',
        type: 'warning'
      }
    )
  } catch {
    return
  }

  pendingResubmitMode.value = true
  resetCertificationFormState()
  ElMessage.info('请重新填写认证信息并再次提交。')
}

// 申请时间格式化
const formatDateTime = (value?: string) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

const getPetCover = (application: AdoptionApplication) => {
  return processImageUrl(application.petCoverImage) || defaultPetCover
}

const formatPetCategory = (category?: string) => {
  if (!category) return '宠物'
  const map: Record<string, string> = {
    dog: '狗狗',
    cat: '猫咪'
  }
  return map[category.toLowerCase()] || category
}

const loadApplications = async () => {
  if (loadingApplications.value) return
  loadingApplications.value = true
  try {
    const res = await getMyApplications({ current: 1, size: 50 })
    applications.value = res.data?.records || []
  } catch (error) {
    console.error('获取申请列表失败:', error)
    ElMessage.error('加载申请列表失败，请稍后重试')
  } finally {
    loadingApplications.value = false
  }
}

// 查看申请详情
const viewApplication = (id: number) => {
  router.push(`/application/${id}`)
}

// 撤销申请
const cancelApplication = async (id: number) => {
  if (cancelingId.value) return
  try {
    await ElMessageBox.confirm('确定要撤销此领养申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  cancelingId.value = id
  try {
    await cancelApplicationApi(id)
    ElMessage.success('申请已撤销')
    await loadApplications()
  } catch (error) {
    console.error('撤销申请失败:', error)
    ElMessage.error('撤销失败，请稍后再试')
  } finally {
    cancelingId.value = null
  }
}

// 点赞和收藏数据
interface LikeItem {
  id: number
  type: 'pet' | 'guide' | 'story'
  title: string
  description?: string
  image?: string
  relationTime?: string
}

// 获取项目图片
const getItemImage = (item: LikeItem): string => {
  if (item.image) {
    return processImageUrl(item.image)
  }
  return defaultPetCover
}

// 获取项目类型标签
const getItemTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    pet: '宠物',
    guide: '领养指南',
    story: '领养故事'
  }
  return typeMap[type] || type
}

const filteredLikedItems = computed(() =>
  likedItems.value.filter((item) =>
    likeCategory.value === 'pet' ? item.type === 'pet' : item.type !== 'pet'
  )
)

const filteredFavoriteItems = computed(() =>
  favoriteItems.value.filter((item) =>
    favoriteCategory.value === 'pet' ? item.type === 'pet' : item.type !== 'pet'
  )
)

const buildProfileReturnQuery = (tab: string, category: 'pet' | 'article') => ({
  from: 'profile',
  tab,
  category
})

// 查看点赞项目
const viewLikedItem = (item: LikeItem) => {
  if (item.type === 'pet') {
    router.push({ path: `/pet/${item.id}`, query: buildProfileReturnQuery('likes', likeCategory.value) })
  } else if (item.type === 'guide') {
    router.push({ path: `/guide/${item.id}`, query: buildProfileReturnQuery('likes', 'article') })
  } else if (item.type === 'story') {
    router.push({ path: `/story/${item.id}`, query: buildProfileReturnQuery('likes', 'article') })
  }
}

const viewFavoriteItem = (item: LikeItem) => {
  if (item.type === 'pet') {
    router.push({ path: `/pet/${item.id}`, query: buildProfileReturnQuery('favorites', favoriteCategory.value) })
  } else if (item.type === 'guide') {
    router.push({ path: `/guide/${item.id}`, query: buildProfileReturnQuery('favorites', 'article') })
  } else if (item.type === 'story') {
    router.push({ path: `/story/${item.id}`, query: buildProfileReturnQuery('favorites', 'article') })
  }
}

// 加载点赞列表
const mapPetToItem = (pet: Pet): LikeItem => ({
  id: pet.id,
  type: 'pet',
  title: pet.name,
  description: pet.breed,
  image: pet.coverImage
})

const mapArticleToItem = (article: Article): LikeItem => ({
  id: article.id!,
  type: article.category === 'GUIDE' ? 'guide' : 'story',
  title: article.title,
  description: article.summary || (article.author ? `作者：${article.author}` : undefined),
  image: article.coverImage,
  relationTime: article.relationTime
})

const sortByRelationTime = (items: LikeItem[]) => {
  return items.sort((a, b) => {
    const t1 = a.relationTime ? new Date(a.relationTime).getTime() : 0
    const t2 = b.relationTime ? new Date(b.relationTime).getTime() : 0
    return t2 - t1
  })
}

const loadLikes = async () => {
  if (loadingLikes.value) return
  loadingLikes.value = true
  try {
    const [petRes, articleRes] = await Promise.all([
      getUserLikedPets({ current: 1, size: 50 }),
      getUserLikedArticles({ current: 1, size: 50 })
    ])
    const pets = (petRes.data?.records || []).map(mapPetToItem)
    const articles = (articleRes.data?.records || []).map(mapArticleToItem)
    likedItems.value = sortByRelationTime([...pets, ...articles])
  } catch (error) {
    console.error('获取点赞列表失败:', error)
    ElMessage.error('加载点赞列表失败，请稍后重试')
    likedItems.value = []
  } finally {
    loadingLikes.value = false
  }
}

const loadFavorites = async () => {
  if (loadingFavorites.value) return
  loadingFavorites.value = true
  try {
    const [petRes, articleRes] = await Promise.all([
      getUserFavoritePets({ current: 1, size: 50 }),
      getUserFavoritedArticles({ current: 1, size: 50 })
    ])
    const pets = (petRes.data?.records || []).map(mapPetToItem)
    const articles = (articleRes.data?.records || []).map(mapArticleToItem)
    favoriteItems.value = sortByRelationTime([...pets, ...articles])
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    ElMessage.error('加载收藏列表失败，请稍后重试')
    favoriteItems.value = []
  } finally {
    loadingFavorites.value = false
  }
}

const ensureTabDataLoaded = (tab?: string) => {
  if (tab === 'applications' && applications.value.length === 0 && !loadingApplications.value) {
    loadApplications()
  } else if (tab === 'likes' && likedItems.value.length === 0 && !loadingLikes.value) {
    loadLikes()
  } else if (tab === 'favorites' && favoriteItems.value.length === 0 && !loadingFavorites.value) {
    loadFavorites()
  }
}

watch(activeTab, (tab) => {
  ensureTabDataLoaded(tab)
})

onMounted(async () => {
  await loadUserProfile()

  try {
    const res = await getCertificationInfo()
    if (res.data) {
      user.value.certificationStatus = res.data.status
      user.value.certificationRejectReason = res.data.rejectReason || ''
    }
  } catch (error) {
    console.error('获取认证信息失败:', error)
  }

  ensureTabDataLoaded(activeTab.value)
})

</script>

<style scoped>
.profile-container {
  padding: 1rem 0;
}

.profile-container h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.profile-content {
  display: flex;
  gap: 2rem;
}

.profile-sidebar {
  flex: 0 0 250px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.user-info {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.btn-edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.user-info h2 {
  margin: 0.5rem 0;
  color: #333;
}

.user-role {
  color: #42b983;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.btn-admin {
  display: inline-block;
  background-color: #409eff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;
}

.profile-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-nav li {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.profile-nav li:hover {
  background-color: #e0e0e0;
}

.profile-nav li.active {
  background-color: #42b983;
  color: white;
}

.profile-main {
  flex: 1;
}

.profile-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.password-card {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #fdf2f8 0%, #fefce8 100%);
  box-shadow: 0 18px 35px rgba(244, 114, 182, 0.2);
  border: 1px solid rgba(251, 191, 36, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.password-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.password-card__header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #7c2d12;
}

.password-card__header p {
  margin: 0.2rem 0 0;
  color: #9a3412;
  font-size: 0.92rem;
}

.password-form {
  display: grid;
  gap: 1rem;
}

:deep(.password-dialog .el-dialog) {
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

:deep(.password-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.password-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

:deep(.password-dialog .el-dialog__headerbtn) {
  top: 1rem;
  right: 1rem;
}

:deep(.password-dialog .el-dialog__close) {
  color: white;
  font-size: 1.2rem;
  z-index: 10;
}

:deep(.password-dialog .el-dialog__close:hover) {
  color: #f0f0f0;
}

:deep(.password-dialog .el-dialog__body) {
  padding: 2rem;
  background: linear-gradient(180deg, #f8f9fc 0%, #f0f2f8 100%);
}

:deep(.password-dialog .el-form-item) {
  margin-bottom: 1.5rem;
}

:deep(.password-dialog .el-form-item__label) {
  color: #333;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

:deep(.password-dialog .el-input__wrapper) {
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.password-dialog .el-input__wrapper:hover) {
  border-color: #667eea;
}

:deep(.password-dialog .el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

:deep(.password-dialog .el-input.is-error .el-input__wrapper) {
  border-color: #f56c6c;
}

:deep(.password-dialog .el-form-item__error) {
  color: #f56c6c;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

:deep(.password-dialog .dialog-footer) {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1.5rem;
}

:deep(.password-dialog .el-button) {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

:deep(.password-dialog .el-button--default) {
  border: 2px solid #e5e7eb;
  color: #666;
}

:deep(.password-dialog .el-button--default:hover) {
  border-color: #667eea;
  color: #667eea;
  background: #f8f9ff;
}

:deep(.password-dialog .el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

:deep(.password-dialog .el-button--primary:hover) {
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.btn-inline {
  border: none;
  background: #f97316;
  color: #fff;
  padding: 0.45rem 1.1rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(249, 115, 22, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-inline:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(249, 115, 22, 0.45);
}

.btn-link {
  border: none;
  background: transparent;
  color: #d946ef;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.section-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.category-toggle {
  display: inline-flex;
}

.pill-toggle {
  background: #f5f7fb;
  padding: 0.25rem;
  border-radius: 999px;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  gap: 0.25rem;
}

.pill-option {
  border: none;
  background: transparent;
  border-radius: 999px;
  padding: 0.35rem 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #556070;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.pill-option .pill-icon {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}

.pill-option.active {
  background: linear-gradient(120deg, #ffb347, #ff6bb5 60%, #f87171);
  color: #fff;
  box-shadow: 0 10px 25px rgba(255, 107, 181, 0.35);
}

.pill-option.active .pill-icon {
  stroke: #fff;
  fill: rgba(255, 255, 255, 0.3);
}

.application-count {
  font-size: 0.9rem;
  color: #666;
}

.profile-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #666;
}

.form-group input:not([readonly]) {
  background-color: #fff;
  border-color: #d9d9d9;
  cursor: text;
}

.form-group input:not([readonly]):focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-edit,
.btn-save {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-block;
  width: 250px;
}

.btn-edit {
  background-color: #409eff;
  color: white;
}

.btn-edit:hover {
  background-color: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-save {
  background-color: #42b983;
  color: white;
}

.btn-save:hover {
  background-color: #359970;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.certification-status {
  padding: 1rem 0;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.status-label {
  font-weight: bold;
}

.status-not-submitted {
  background-color: #999;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-pending {
  background-color: #ff9800;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-approved {
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-rejected {
  background-color: #ff6b6b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-message {
  background-color: #f5f7fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #409eff;
}

.status-message p {
  margin: 0 0 1rem 0;
  color: #333;
  line-height: 1.6;
}

.status-message:last-child p {
  margin-bottom: 0;
}

.status-message-rejected {
  border-left-color: #ff6b6b;
  background-color: #fef2f2;
}

.status-message-rejected p:first-child {
  color: #b91c1c;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.reject-reason {
  color: #7f1d1d;
  font-size: 0.9rem;
  margin-bottom: 1rem !important;
}

.certification-form {
  background-color: #f5f7fa;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid #e0e6f2;
}

.certification-form>p {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
}

.file-upload {
  border: 2px dashed #d9d9d9;
  padding: 2rem 1rem;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafbfc;
}

.file-upload:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.file-upload input[type='file'] {
  display: none;
}

.file-upload::before {
  content: '📁 点击或拖拽上传图片';
  display: block;
  color: #909399;
  font-size: 0.9rem;
}

.file-preview {
  margin-top: 1rem;
}

.file-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-submit-certification {
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-submit-certification:hover {
  background-color: #359970;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.applications-loading,
.no-applications {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.btn-browse-pets {
  display: inline-block;
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 1rem;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.application-item {
  display: flex;
  gap: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem;
  background: #f9fafb;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.application-pet img {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
}

.application-pet-meta {
  margin-top: 0.5rem;
}

.application-pet .pet-name {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
}

.application-pet .pet-category {
  margin: 0.15rem 0 0;
  color: #64748b;
  font-size: 0.85rem;
}

.application-body {
  flex: 1;
  background: #fff;
  border-radius: 14px;
  padding: 1rem 1.25rem;
  border: 1px solid #e5e7eb;
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.application-no {
  margin: 0;
  font-weight: 600;
  color: #111827;
}

.timeline {
  margin: 0.4rem 0 0;
  color: #6b7280;
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
}

.timeline span {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.application-details p {
  margin: 0.25rem 0;
  color: #666;
}

.application-snippet {
  margin-top: 0.75rem;
  color: #4b5563;
  font-size: 0.95rem;
}

.application-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-view,
.btn-cancel {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1.5rem;
}

.btn-view {
  background-color: #2196f3;
  color: white;
}

.btn-cancel {
  background-color: #ff6b6b;
  color: white;
}

.status-pending,
.status-approved,
.status-rejected,
.status-cancelled {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-pending {
  background: #fff7ed;
  color: #c2410c;
}

.status-approved {
  background: #ecfdf5;
  color: #047857;
}

.status-rejected {
  background: #fef2f2;
  color: #b91c1c;
}

.status-cancelled {
  background: #f3f4f6;
  color: #374151;
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.count-badge {
  background-color: #eef2ff;
  color: #4c1d95;
  padding: 0.2rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: inset 0 1px 2px rgba(79, 70, 229, 0.2);
}

.likes-grid,
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.like-item,
.favorite-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.like-item:hover,
.favorite-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #d1d5db;
}

.item-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f3f4f6;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.like-item:hover .item-image img,
.favorite-item:hover .item-image img {
  transform: scale(1.05);
}

.item-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-type {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.item-description {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.item-actions {
  padding: 0 1rem 1rem 1rem;
  display: flex;
  gap: 0.5rem;
}

.btn-view-item {
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.btn-view-item:hover {
  background-color: #1976d2;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.section-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.section-head h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.btn-resubmit,
.btn-update-certification {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.btn-resubmit {
  background-color: #ff9800;
  color: white;
}

.btn-resubmit:hover {
  background-color: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.btn-update-certification {
  background-color: #2196f3;
  color: white;
}

.btn-update-certification:hover {
  background-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-actions .btn-submit-certification {
  background-color: #42b983;
  color: white;
  grid-column: 1;
}

.form-actions .btn-submit-certification:hover {
  background-color: #359970;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.form-actions .btn-cancel {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #d9d9d9;
  grid-column: 2;
}

.form-actions .btn-cancel:hover {
  background-color: #e8e8e8;
  border-color: #b3b3b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@media (max-width: 600px) {
  .form-actions {
    grid-template-columns: 1fr;
  }

  .form-actions .btn-submit-certification,
  .form-actions .btn-cancel {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }

  .profile-sidebar {
    flex: none;
  }

  .likes-grid,
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>