.pet-details h3 {
  margin: 0 0 0.35rem;
  color: #111827;
  font-size: 1.2rem;
}

.pet-details p {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.pet-details span {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.pet-details .status-available {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.pet-details .status-pending {
  background: rgba(245, 158, 11, 0.16);
  color: #92400e;
}

.pet-details .status-adopted {
  background: rgba(156, 163, 175, 0.22);
  color: #374151;
}

.pet-details .status-unknown {
  background: rgba(148, 163, 184, 0.25);
  color: #475569;
}

<template>
  <div class="apply-container">
    <div class="apply-header">
      <h1>申请领养 - {{ pet?.name || '——' }}</h1>
      <div class="pet-info-summary" v-if="pet">
        <img :src="petImage" :alt="pet.name" />
        <div class="pet-details">
          <h3>{{ pet.name }}</h3>
          <p>{{ pet.breed }} | {{ pet.age }} 岁</p>
          <span :class="statusClass">{{ statusText }}</span>
        </div>
      </div>
    </div>

    <div class="apply-content">
      <div class="apply-steps">
        <div v-for="(step, index) in steps" :key="step.key" class="step-item"
          :class="{ active: currentStep === index + 1, completed: currentStep > index + 1 }">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>

      <div class="apply-form">
        <!-- 步骤 1 -->
        <div v-if="currentStep === 1" class="form-step">
          <div class="form-step-header">
            <h2>个人信息确认</h2>
            <button v-if="showModifyInfoButton" class="modify-info-btn" @click="goToProfileInfo">
              信息有误？前往修改
            </button>
          </div>
          <div class="user-info">
            <div class="info-item">
              <label>姓名：</label>
              <span>{{ adopterInfo.name || '—' }}</span>
            </div>
            <div class="info-item">
              <label>手机号：</label>
              <span>{{ adopterInfo.phone || '—' }}</span>
            </div>
            <div class="info-item">
              <label>邮箱：</label>
              <span>{{ adopterInfo.email || '—' }}</span>
            </div>
            <div class="info-item">
              <label>地址：</label>
              <span>{{ adopterInfo.address || '—' }}</span>
            </div>
          </div>

          <div class="certification-status">
            <div class="status-item">
              <label>领养者认证：</label>
              <span :class="certificationStatusClass">{{ certificationStatusText }}</span>
              <div v-if="showStatusActions" class="status-actions">
                <button v-if="!isPersonalInfoComplete" class="btn-go-profile" @click="goToProfileInfo">
                  去完善
                </button>
                <button v-if="adopterInfo.certificationStatus !== 'approved'" class="btn-go-certification"
                  @click="goToCertification">
                  去认证
                </button>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button class="btn-next" @click="nextStep">下一步</button>
          </div>
        </div>

        <!-- 步骤 2 -->
        <div v-if="currentStep === 2" class="form-step living-step">
          <h2>居住环境</h2>
          <form @submit.prevent="nextStep">
            <div class="form-group living-type-group">
              <label for="livingType">居住类型：</label>
              <div class="living-type-select">
                <select id="livingType" v-model="applicationForm.livingType" required>
                  <option value="">请选择</option>
                  <option v-for="item in livingTypeOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </option>
                </select>
                <button type="button" class="btn-add-type" @click="openAddLivingType">
                  没有目标类型？点此新增
                </button>
              </div>
              <div v-if="showAddLivingTypeInput" class="add-type-inline">
                <input v-model="newLivingTypeName" type="text" maxlength="20" placeholder="请输入新的居住类型"
                  @keyup.enter="confirmAddLivingType" />
                <button type="button" class="btn-confirm" @click="confirmAddLivingType">确定</button>
                <button type="button" class="btn-cancel" @click="cancelAddLivingType">取消</button>
              </div>
              <p v-if="livingTypeError" class="error-text">{{ livingTypeError }}</p>
            </div>

            <div class="form-group">
              <label for="houseSize">住房面积 (㎡)：</label>
              <input id="houseSize" v-model.number="applicationForm.houseSize" type="number" min="0" required />
            </div>

            <div class="form-group">
              <label for="yard">是否有院子：</label>
              <select id="yard" v-model="applicationForm.yard" required>
                <option value="">请选择</option>
                <option value="yes">是</option>
                <option value="no">否</option>
              </select>
            </div>

            <div class="form-group">
              <label>家庭成员：</label>
              <div class="family-members">
                <div v-for="(member, index) in applicationForm.familyMembers" :key="index" class="member-item">
                  <input v-model="member.name" type="text" placeholder="姓名" required />
                  <input v-model.number="member.age" type="number" placeholder="年龄" min="0" required />
                  <button type="button" class="btn-remove" @click="removeFamilyMember(index)"
                    :disabled="applicationForm.familyMembers.length === 1">
                    删除
                  </button>
                </div>
                <button type="button" class="btn-add-member" @click="addFamilyMember">添加家庭成员</button>
              </div>
            </div>

            <div class="step-actions">
              <button type="button" class="btn-prev" @click="prevStep">上一步</button>
              <button type="submit" class="btn-next">下一步</button>
            </div>
          </form>
        </div>

        <!-- 步骤 3 -->
        <div v-if="currentStep === 3" class="form-step experience-step">
          <h2>养宠经验</h2>
          <form @submit.prevent="nextStep">
            <div class="form-group">
              <label for="hasPetExperience">是否有养宠经验：</label>
              <select id="hasPetExperience" v-model="applicationForm.hasPetExperience" required>
                <option value="">请选择</option>
                <option value="yes">是</option>
                <option value="no">否</option>
              </select>
            </div>

            <div v-if="applicationForm.hasPetExperience === 'yes'" class="form-group">
              <label for="currentPets">目前饲养的宠物：</label>
              <textarea id="currentPets" v-model="applicationForm.currentPets" rows="3"
                placeholder="请描述您目前饲养的宠物情况"></textarea>
            </div>

            <div class="form-group">
              <label for="petKnowledge">对宠物知识的了解：</label>
              <textarea id="petKnowledge" v-model="applicationForm.petKnowledge" rows="3"
                placeholder="请描述您对宠物饲养、健康、行为等方面的知识了解" required></textarea>
            </div>

            <div class="form-group">
              <label for="reason">申请领养的原因：</label>
              <textarea id="reason" v-model="applicationForm.reason" rows="3" placeholder="请详细说明您申请领养这只宠物的原因"
                required></textarea>
            </div>

            <div class="step-actions">
              <button type="button" class="btn-prev" @click="prevStep">上一步</button>
              <button type="submit" class="btn-next">下一步</button>
            </div>
          </form>
        </div>

        <!-- 步骤 4 -->
        <div v-if="currentStep === 4" class="form-step">
          <h2>承诺与协议</h2>
          <div class="agreement-content">
            <h3>领养承诺书</h3>
            <div class="agreement-text">
              <p>我承诺：</p>
              <ol>
                <li>我会为宠物提供安全、舒适的生活环境。</li>
                <li>我会按时为宠物接种疫苗并定期体检。</li>
                <li>我会善待宠物，绝不虐待或遗弃。</li>
                <li>如因特殊原因无法继续饲养，我会联系救助站协助处理。</li>
                <li>我会遵守相关法律法规，文明养宠。</li>
              </ol>
              <p>我理解：</p>
              <ol>
                <li>领养是严肃的承诺，需要长期责任。</li>
                <li>救助站有权对领养申请进行审核。</li>
                <li>如发现违反承诺的行为，救助站有权收回宠物。</li>
              </ol>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="applicationForm.agreeAgreement" required />
                我已阅读并同意以上领养承诺书
              </label>
            </div>
          </div>

          <div class="step-actions">
            <button type="button" class="btn-prev" @click="prevStep">上一步</button>
            <button class="btn-submit" @click="submitApplication" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交申请' }}
            </button>
          </div>
        </div>

        <!-- 成功 -->
        <div v-if="currentStep === 5" class="form-step success-step">
          <div class="success-icon">✓</div>
          <h2>申请提交成功</h2>
          <p>您的领养申请已成功提交，申请编号：<strong>{{ applicationId }}</strong></p>
          <p>我们将在 3-5 个工作日内完成审核，请您耐心等待。</p>
          <p>您可以在个人中心查看申请状态。</p>
          <div class="success-actions">
            <router-link class="btn-view-applications" to="/applications">查看我的申请</router-link>
            <router-link class="btn-home" to="/">返回首页</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getPetDetail } from '@/api/pet'
import { submitApplication as submitApplicationApi } from '@/api/application'
import { getCertificationInfo } from '@/api/user'
import { processImageUrl } from '@/utils/image'
import type { Pet } from '@/types'

interface FamilyMember {
  name: string
  age: number | null
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const pet = ref<Pet | null>(null)
const defaultImage = 'http://localhost:9000/animal-adopt/default.jpg'
const currentStep = ref(1)
const submitting = ref(false)
const applicationId = ref('')

const adopterInfo = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  certificationStatus: 'not_submitted' as 'not_submitted' | 'pending' | 'approved' | 'rejected'
})

const applicationForm = ref({
  livingType: '',
  houseSize: null as number | null,
  yard: '',
  familyMembers: [{ name: '', age: null }] as FamilyMember[],
  hasPetExperience: '',
  currentPets: '',
  petKnowledge: '',
  reason: '',
  agreeAgreement: false
})

const steps = [
  { key: 'base', label: '确认信息' },
  { key: 'living', label: '居住环境' },
  { key: 'experience', label: '养宠经验' },
  { key: 'agreement', label: '承诺协议' },
  { key: 'success', label: '提交完成' }
]

const DEFAULT_LIVING_TYPES = [
  { label: '别墅/独栋', value: 'house' },
  { label: '公寓', value: 'apartment' },
  { label: '宿舍', value: 'dormitory' },
  { label: '其他', value: 'other' }
]
const LIVING_TYPE_STORAGE_KEY = 'custom_living_types'
const livingTypeOptions = ref([...DEFAULT_LIVING_TYPES])
const showAddLivingTypeInput = ref(false)
const newLivingTypeName = ref('')
const livingTypeError = ref('')

const petImage = computed(() => {
  if (!pet.value) return defaultImage
  const cover = Array.isArray(pet.value.images) ? pet.value.images[0] : (pet.value.coverImage as string | undefined)
  return processImageUrl(cover) || defaultImage
})

const statusText = computed(() => {
  if (!pet.value) return '—'
  const status = String(pet.value.adoptionStatus || '').toLowerCase()
  switch (status) {
    case 'available':
      return '可领养'
    case 'pending':
      return '审核中'
    case 'adopted':
      return '已领养'
    default:
      return '未知状态'
  }
})

const statusClass = computed(() => {
  const status = String(pet.value?.adoptionStatus || 'unknown').toLowerCase()
  return `status-${status}`
})

const certificationStatusText = computed(() => {
  switch (adopterInfo.value.certificationStatus) {
    case 'approved':
      return '已认证'
    case 'pending':
      return '审核中'
    case 'rejected':
      return '已拒绝'
    default:
      return '未认证'
  }
})

const certificationStatusClass = computed(() => `cert-status ${adopterInfo.value.certificationStatus}`)
const isPersonalInfoComplete = computed(() => !!(adopterInfo.value.name && adopterInfo.value.phone && adopterInfo.value.address))
const showStatusActions = computed(() => !isPersonalInfoComplete.value || adopterInfo.value.certificationStatus !== 'approved')
const showModifyInfoButton = computed(
  () => isPersonalInfoComplete.value && adopterInfo.value.certificationStatus === 'approved'
)

const syncUserFromStore = () => {
  if (!userInfo.value) return
  const info = userInfo.value
  adopterInfo.value.name = info.realName || info.nickname || info.username || info.email || '用户'
  adopterInfo.value.phone = info.phone || ''
  adopterInfo.value.email = info.email || ''
  adopterInfo.value.address = (info as any).address || ''
}

const loadLivingTypeOptions = () => {
  const stored = localStorage.getItem(LIVING_TYPE_STORAGE_KEY)
  if (!stored) return
  try {
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) {
      const merged = [...DEFAULT_LIVING_TYPES]
      parsed.forEach((item) => {
        if (item && typeof item.value === 'string' && !merged.find((opt) => opt.value === item.value)) {
          merged.push(item)
        }
      })
      livingTypeOptions.value = merged
    }
  } catch (error) {
    console.warn('解析居住类型失败', error)
  }
}

const saveCustomLivingTypes = () => {
  const custom = livingTypeOptions.value.filter((item) => !DEFAULT_LIVING_TYPES.find((def) => def.value === item.value))
  localStorage.setItem(LIVING_TYPE_STORAGE_KEY, JSON.stringify(custom))
}

const openAddLivingType = () => {
  newLivingTypeName.value = ''
  livingTypeError.value = ''
  showAddLivingTypeInput.value = true
}

const cancelAddLivingType = () => {
  showAddLivingTypeInput.value = false
  newLivingTypeName.value = ''
  livingTypeError.value = ''
}

const confirmAddLivingType = () => {
  const name = newLivingTypeName.value.trim()
  if (!name) {
    livingTypeError.value = '请输入居住类型'
    return
  }
  const value = name.toLowerCase().replace(/\s+/g, '_')
  if (livingTypeOptions.value.some((item) => item.value === value || item.label === name)) {
    livingTypeError.value = '该类型已存在'
    return
  }
  livingTypeOptions.value.push({ label: name, value })
  applicationForm.value.livingType = value
  saveCustomLivingTypes()
  cancelAddLivingType()
  ElMessage.success('已新增居住类型')
}

const addFamilyMember = () => {
  applicationForm.value.familyMembers.push({ name: '', age: null })
}

const removeFamilyMember = (index: number) => {
  if (applicationForm.value.familyMembers.length === 1) return
  applicationForm.value.familyMembers.splice(index, 1)
}

const goToProfileInfo = () => {
  router.push('/profile')
}

const goToCertification = () => {
  router.push({ name: 'profile', query: { tab: 'certification' } })
}

const validateStep = (step: number) => {
  switch (step) {
    case 1:
      if (!isPersonalInfoComplete.value) {
        ElMessage.warning('请先完善个人信息')
        return false
      }
      if (adopterInfo.value.certificationStatus !== 'approved') {
        ElMessage.warning('请先完成领养者认证')
        return false
      }
      return true
    case 2:
      if (!applicationForm.value.livingType) {
        ElMessage.warning('请选择居住类型')
        return false
      }
      if (!applicationForm.value.houseSize || applicationForm.value.houseSize <= 0) {
        ElMessage.warning('请填写正确的住房面积')
        return false
      }
      if (!applicationForm.value.yard) {
        ElMessage.warning('请选择是否有院子')
        return false
      }
      if (!applicationForm.value.familyMembers.every((m) => m.name && m.age !== null)) {
        ElMessage.warning('请完整填写家庭成员信息')
        return false
      }
      return true
    case 3:
      if (!applicationForm.value.hasPetExperience) {
        ElMessage.warning('请选择是否有养宠经验')
        return false
      }
      if (!applicationForm.value.petKnowledge.trim()) {
        ElMessage.warning('请描述您对宠物知识的了解')
        return false
      }
      if (!applicationForm.value.reason.trim()) {
        ElMessage.warning('请填写申请原因')
        return false
      }
      return true
    case 4:
      if (!applicationForm.value.agreeAgreement) {
        ElMessage.warning('请勾选领养承诺书')
        return false
      }
      return true
    default:
      return true
  }
}

const nextStep = () => {
  if (!validateStep(currentStep.value)) return
  currentStep.value += 1
}

const prevStep = () => {
  if (currentStep.value === 1) return
  currentStep.value -= 1
}

const buildFamilyInfo = () =>
  applicationForm.value.familyMembers
    .map((member, index) => `${index + 1}. ${member.name} (${member.age ?? '-'}岁)`)
    .join('；')

const getLivingTypeLabel = (value: string) => livingTypeOptions.value.find((item) => item.value === value)?.label || value

const buildCarePlan = () => {
  const yardText = applicationForm.value.yard === 'yes' ? '有院子' : '无院子'
  const experienceText = applicationForm.value.hasPetExperience === 'yes' ? '有养宠经验' : '暂无养宠经验'
  return `居住类型：${getLivingTypeLabel(applicationForm.value.livingType)}；住房面积：${applicationForm.value.houseSize}㎡；${yardText}；${experienceText}；宠物知识：${applicationForm.value.petKnowledge}`
}

const buildAdditionalInfo = () => applicationForm.value.currentPets?.trim() || ''

const submitApplication = async () => {
  if (!pet.value) {
    ElMessage.error('未找到宠物信息，无法提交')
    return
  }
  if (!validateStep(4)) return

  submitting.value = true
  try {
    const payload = {
      petId: pet.value.id,
      reason: applicationForm.value.reason.trim(),
      familyInfo: buildFamilyInfo(),
      careplan: buildCarePlan(),
      additionalInfo: buildAdditionalInfo(),
      contactPhone: adopterInfo.value.phone,
      contactAddress: adopterInfo.value.address
    }

    const res = await submitApplicationApi(payload as any)
    applicationId.value = String(res.data || '')
    currentStep.value = 5
    ElMessage.success('申请提交成功')
  } catch (error) {
    console.error('提交申请失败', error)
    ElMessage.error('提交失败，请稍后再试')
  } finally {
    submitting.value = false
  }
}

const loadPet = async () => {
  const petId = Number(route.params.petId)
  if (!petId) return
  try {
    const res = await getPetDetail(petId)
    const detail = res.data as Pet & { images?: string | string[] }
    if (typeof detail.images === 'string') {
      try {
        detail.images = JSON.parse(detail.images)
      } catch {
        detail.images = []
      }
    }
    pet.value = detail
  } catch (error) {
    console.error('加载宠物信息失败', error)
    ElMessage.error('加载宠物信息失败')
  }
}

const fetchCertificationInfo = async () => {
  try {
    const res = await getCertificationInfo()
    adopterInfo.value.certificationStatus = (res.data?.status || 'not_submitted') as any
  } catch (error) {
    console.warn('获取认证状态失败', error)
  }
}

watch(userInfo, () => syncUserFromStore(), { immediate: true })
watch(
  () => route.params.petId,
  () => {
    loadPet()
  }
)

onMounted(() => {
  syncUserFromStore()
  loadPet()
  loadLivingTypeOptions()
  fetchCertificationInfo()
})
</script>

<style scoped>
.apply-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.apply-header {
  margin-bottom: 1.5rem;
}

.apply-header h1 {
  margin-bottom: 1rem;
  color: #0f172a;
  font-size: 1.9rem;
  font-weight: 600;
}

.pet-info-summary {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #fdf2f8, #eff6ff);
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.pet-info-summary img {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  object-fit: cover;
}

.certification-status {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.status-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.cert-status {
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
}

.cert-status.approved {
  background: #ecfdf5;
  color: #059669;
}

.cert-status.pending {
  background: #fffbeb;
  color: #d97706;
}

.cert-status.rejected {
  background: #fef2f2;
  color: #b91c1c;
}

.cert-status.not_submitted {
  background: #eef2ff;
  color: #4338ca;
}

.apply-steps {
  display: flex;
  justify-content: space-between;
  gap: 1.25rem;
  margin: 2.25rem 0 2.5rem;
  padding: 0 0.5rem;
  position: relative;
}

.apply-steps::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.35), rgba(148, 163, 184, 0.15));
  z-index: 1;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 0.35rem;
  z-index: 2;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 3px solid #e2e8f0;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.step-item.active .step-number {
  background: #42b983;
  color: #fff;
  border-color: #42b983;
}

.step-item.completed .step-number {
  background: #10b981;
  color: #fff;
  border-color: #10b981;
}

.step-label {
  font-size: 0.95rem;
  color: #94a3b8;
  font-weight: 500;
}

.step-item.active .step-label {
  color: #059669;
}

.step-item.completed .step-label {
  color: #047857;
}

.form-step {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgb(15 23 42 / 6%);
}

.living-step {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2.25rem;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
}

.living-step h2 {
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
  color: #0f172a;
  font-weight: 600;
}

.living-step form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.living-step .form-group label {
  display: block;
  margin-bottom: 0.4rem;
  color: #475569;
  font-weight: 500;
}

.living-step .form-group input,
.living-step .form-group select,
.living-step .form-group textarea {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid #dfe7f2;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.living-step .form-group input:focus,
.living-step .form-group select:focus,
.living-step .form-group textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
  background: #fff;
}

.living-step .living-type-select {
  background: #fff;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.living-step .btn-add-type {
  margin-left: auto;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px dashed rgba(66, 185, 131, 0.55);
  background: #f0fdf4;
  color: #047857;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.living-step .btn-add-type:hover {
  background: #dcfce7;
  border-color: #34d399;
  color: #065f46;
  transform: translateY(-1px);
}

.living-step .family-members {
  background: #fff;
  border: 1px dashed rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 1rem;
  gap: 1rem;
}

.living-step .member-item {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.living-step .btn-add-member,
.living-step .btn-remove {
  border-radius: 10px;
  font-weight: 500;
}

.living-step .btn-add-member {
  background: #ecfdf5;
  color: #059669;
}

.living-step .btn-remove {
  background: #fee2e2;
  color: #b91c1c;
}

.living-step .step-actions {
  margin-top: 0.5rem;
  justify-content: flex-end;
}

.living-step .btn-prev {
  background: #f3f4f6;
  color: #1f2937;
}

.living-step .btn-next {
  background: linear-gradient(135deg, #34d399, #059669);
  box-shadow: 0 12px 30px rgba(5, 150, 105, 0.35);
}

.form-step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.form-step-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.modify-info-btn {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(66, 185, 131, 0.35);
  background: #f0fdf4;
  color: #059669;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.modify-info-btn:hover {
  background: #dcfce7;
  border-color: #34d399;
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.18);
  transform: translateY(-1px);
}

.modify-info-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.user-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
}

.status-actions {
  display: flex;
  gap: 0.5rem;
}

.status-actions button {
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-actions button:hover {
  border-color: #42b983;
  color: #059669;
  transform: translateY(-1px);
}

.status-actions .btn-go-modify {
  margin-left: auto;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(66, 185, 131, 0.4);
  background: #ecfdf5;
  color: #047857;
  transition: all 0.2s ease;
}

.status-actions .btn-go-modify:hover {
  border-color: #42b983;
  color: #059669;
  transform: translateY(-1px);
}

.btn-prev,
.btn-next,
.btn-submit {
  min-width: 140px;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-prev {
  background: #e5e7eb;
  color: #374151;
}

.btn-next {
  background: #42b983;
  color: #fff;
}

.btn-submit {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
}

.btn-prev:hover,
.btn-next:hover,
.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(66, 185, 131, 0.22);
}

.agreement-text ol {
  padding-left: 1.1rem;
  color: #4b5563;
}

.success-step {
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ecfdf5;
  color: #059669;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.success-actions a {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

.btn-view-applications {
  background: #eff6ff;
  color: #1d4ed8;
}

.btn-home {
  background: #ecfdf5;
  color: #047857;
}

@media (max-width: 640px) {
  .form-step {
    padding: 1.25rem;
  }

  .step-actions {
    flex-direction: column;
  }

  .member-item {
    flex-direction: column;
  }
}
</style>