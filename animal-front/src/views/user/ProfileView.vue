<template>
  <div class="profile-container">
    <h1>个人中心</h1>

    <div class="profile-content">
      <div class="profile-sidebar">
        <div class="user-info">
          <div class="avatar">
            <img :src="user.avatar ? processImageUrl(user.avatar) : defaultAvatar" :alt="user.name" />
            <button class="btn-edit-avatar" @click="editAvatar">编辑头像</button>
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
              <input v-model="user.name" type="text" :readonly="!editingBasic" />
            </div>

            <div class="form-group">
              <label>邮箱:</label>
              <input v-model="user.email" type="email" :readonly="!editingBasic" />
            </div>

            <div class="form-group">
              <label for="phone">手机号:</label>
              <input id="phone" v-model="user.phone" type="tel" :readonly="!editingBasic" />
            </div>

            <div class="form-group">
              <label for="address">地址:</label>
              <input id="address" v-model="user.address" type="text" :readonly="!editingBasic" />
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
        </div>

        <!-- 领养者认证 -->
        <div v-if="activeTab === 'certification'" class="profile-section">
          <h3>领养者认证</h3>
          <div class="certification-status">
            <div class="status-info">
              <span class="status-label">认证状态:</span>
              <span :class="certificationStatusClass">{{ certificationStatusText }}</span>
            </div>

            <div v-if="user.certificationStatus === 'pending'" class="status-message">
              <p>您的认证申请正在审核中，请耐心等待。</p>
            </div>

            <div v-if="user.certificationStatus === 'rejected'" class="status-message">
              <p>您的认证申请被拒绝，原因：{{ user.certificationRejectReason }}</p>
              <button @click="resubmitCertification" class="btn-resubmit">
                重新提交认证
              </button>
            </div>

            <div v-if="user.certificationStatus === 'not_submitted'" class="certification-form">
              <p>您尚未提交领养者认证申请，请填写以下信息进行认证。</p>

              <form @submit.prevent="submitCertificationHandler">
                <div class="form-group">
                  <label for="idCard">身份证号码:</label>
                  <input id="idCard" v-model="certificationForm.idCard" type="text" required />
                </div>

                <div class="form-group">
                  <label for="idCardFront">身份证正面:</label>
                  <div class="file-upload">
                    <input id="idCardFront" type="file" @change="handleFileUpload('idCardFront', $event)"
                      accept="image/*" />
                    <div v-if="certificationForm.idCardFrontPreview" class="file-preview">
                      <img :src="certificationForm.idCardFrontPreview" alt="身份证正面" />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="idCardBack">身份证反面:</label>
                  <div class="file-upload">
                    <input id="idCardBack" type="file" @change="handleFileUpload('idCardBack', $event)"
                      accept="image/*" />
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

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getCertificationInfo, submitCertification, updateUserInfo } from '@/api/user'
import { getMyApplications, cancelApplication as cancelApplicationApi } from '@/api/application'
import type { AdoptionApplication } from '@/types'

// 获取 userStore
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 用户信息
const user = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  role: 'user',
  certificationStatus: 'not_submitted' as 'not_submitted' | 'pending' | 'approved' | 'rejected',
  certificationRejectReason: ''
})

// 认证表单
const certificationForm = reactive({
  idCard: '',
  idCardFront: null as File | null,
  idCardBack: null as File | null,
  idCardFrontPreview: '',
  idCardBackPreview: ''
})

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
  if (tab === 'certification' || tab === 'applications' || tab === 'basic') return tab
  return 'basic'
}
const activeTab = ref(resolveTab(route.query.tab as string | undefined))

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
    if (tab === 'certification' || tab === 'basic' || tab === 'applications') {
      activeTab.value = tab
    } else {
      activeTab.value = 'basic'
    }
  }
)

// 导航项
const navItems = [
  { key: 'basic', label: '基本信息' },
  { key: 'certification', label: '领养者认证' },
  { key: 'applications', label: '我的申请' }
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
const toggleEditBasic = () => {
  if (editingBasic.value) {
    syncUserFromStore()
    editingBasic.value = false
  } else {
    editingBasic.value = true
  }
}

// 更新基本信息
const updateBasicInfo = async () => {
  if (!editingBasic.value) return
  try {
    await updateUserInfo({
      username: user.value.name,
      email: user.value.email,
      phone: user.value.phone,
      address: user.value.address,
      nickname: user.value.nickname,
      realName: user.value.realName,
      gender: user.value.gender,
      age: user.value.age,
      occupation: user.value.occupation,
      housing: user.value.housing,
      hasExperience: user.value.hasExperience,
      avatar: user.value.avatar
    })
    ElMessage.success('基本信息更新成功')
    await userStore.getUserInfo()
    syncUserFromStore()
    editingBasic.value = false
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新失败，请稍后重试')
  }
}

// 编辑头像
const editAvatar = () => {
  alert('编辑头像功能')
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
const resubmitCertification = () => {
  user.value.certificationStatus = 'not_submitted'
  certificationForm.idCard = ''
  certificationForm.idCardFront = null
  certificationForm.idCardBack = null
  certificationForm.idCardFrontPreview = ''
  certificationForm.idCardBackPreview = ''
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

watch(activeTab, (tab) => {
  if (tab === 'applications' && applications.value.length === 0 && !loadingApplications.value) {
    loadApplications()
  }
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

  if (activeTab.value === 'applications') {
    await loadApplications()
  }
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

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #666;
}

.form-group input:not([readonly]) {
  background-color: #fff;
  border-color: #409eff;
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
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-edit {
  background-color: #ff9800;
  color: white;
}

.btn-save {
  background-color: #42b983;
  color: white;
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
  background-color: #fff8e1;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.btn-resubmit {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.certification-form {
  margin-top: 1rem;
}

.file-upload {
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
}

.file-upload input {
  margin-bottom: 1rem;
}

.file-preview {
  max-width: 200px;
  margin: 0 auto;
}

.file-preview img {
  width: 100%;
  border-radius: 4px;
}

.btn-submit-certification {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
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

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }

  .profile-sidebar {
    flex: none;
  }
}
</style>