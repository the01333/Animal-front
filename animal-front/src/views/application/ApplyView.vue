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
            <div class="form-step-title">
              <h2>个人信息确认</h2>
            </div>
            <div class="step-header-actions">
              <span class="step-indicator step-indicator--info">Step 1 / 确认信息</span>
              <button v-if="showModifyInfoButton" class="modify-info-btn" @click="goToProfileInfo">
                信息有误？前往修改
              </button>
            </div>
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

          <div v-if="!isPersonalInfoComplete" class="user-info-actions">
            <div class="user-info-actions__card">
              <div class="user-info-actions__icon">📝</div>
              <div class="user-info-actions__text">
                <p class="title">完善个人信息</p>
                <p class="desc">补齐姓名、联系方式与地址后即可继续认证流程</p>
              </div>
              <button class="user-info-actions__btn" @click="goToProfileInfo">
                立即前往
                <span>→</span>
              </button>
            </div>
          </div>

          <div class="certification-status">
            <div class="status-item">
              <label>领养者认证：</label>
              <span :class="certificationStatusClass">{{ certificationStatusText }}</span>
              <div v-if="showStatusActions" class="status-actions">
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
          <div class="form-step-header">
            <div class="form-step-title">
              <h2>居住环境</h2>
            </div>
            <div class="step-header-actions">
              <span class="step-indicator step-indicator--living">Step 2 / 居住环境</span>
            </div>
          </div>
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
                  <div class="member-fields">
                    <input v-model="member.name" type="text" placeholder="姓名" required />
                    <input v-model.number="member.age" type="number" placeholder="年龄" min="0" required />
                  </div>
                  <button v-if="applicationForm.familyMembers.length > 1 && index > 0" type="button" class="btn-remove"
                    @click="removeFamilyMember(index)">
                    删除
                  </button>
                </div>
                <div class="family-members-actions">
                  <button type="button" class="btn-add-member" @click="addFamilyMember">+ 添加家庭成员</button>
                </div>
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
          <div class="experience-header">
            <div>
              <h2>养宠经验</h2>
              <p>告诉我们您对宠物的了解与准备程度，有助于评估是否匹配这只毛孩子。</p>
            </div>
            <span class="step-indicator step-indicator--experience">Step 3 / 养护计划</span>
          </div>
          <form @submit.prevent="nextStep" class="experience-layout">
            <div class="experience-side-card">
              <h3>填写指南</h3>
              <p>建议尽量具体描述，能加分的常见内容：</p>
              <ul>
                <li>过往照料经历与心得</li>
                <li>对饮食、医疗、陪伴的计划</li>
                <li>家庭支持情况与时间安排</li>
              </ul>
            </div>
            <div class="experience-fields">
              <div class="form-group inline">
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
                  placeholder="请描述宠物品种、性格、照料频次等情况"></textarea>
              </div>

              <div class="form-group">
                <label for="petKnowledge">对宠物知识的了解：</label>
                <textarea id="petKnowledge" v-model="applicationForm.petKnowledge" rows="3"
                  placeholder="例如：疫苗驱虫、饮食搭配、行为训练等" required></textarea>
              </div>

              <div class="form-group">
                <label for="reason">申请领养的原因：</label>
                <textarea id="reason" v-model="applicationForm.reason" rows="3" placeholder="分享您选择这只宠物的原因，以及未来生活规划"
                  required></textarea>
              </div>

              <div class="step-actions">
                <button type="button" class="btn-prev" @click="prevStep">上一步</button>
                <button type="submit" class="btn-next">下一步</button>
              </div>
            </div>
          </form>
        </div>

        <!-- 步骤 4 -->
        <div v-if="currentStep === 4" class="form-step agreement-step">
          <div class="agreement-content">
            <div class="agreement-hero">
              <div class="agreement-icon">🤝</div>
              <div>
                <p class="agreement-eyebrow">Step 4 / 守护承诺</p>
                <h2>承诺与协议</h2>
                <p>请认真阅读以下条款，确保您与家人都已做好长期守护这只毛孩子的准备。</p>
              </div>
            </div>
            <div class="agreement-columns">
              <div class="agreement-box">
                <h3>我承诺</h3>
                <ol>
                  <li>我会为宠物提供安全、舒适的生活环境。</li>
                  <li>我会按时为宠物接种疫苗并定期体检。</li>
                  <li>我会善待宠物，绝不虐待或遗弃。</li>
                  <li>如因特殊原因无法继续饲养，我会联系救助站协助处理。</li>
                  <li>我会遵守相关法律法规，文明养宠。</li>
                </ol>
              </div>
              <div class="agreement-box">
                <h3>我理解</h3>
                <ol>
                  <li>领养是严肃的承诺，需要长期责任。</li>
                  <li>救助站有权对领养申请进行审核。</li>
                  <li>如发现违反承诺的行为，救助站有权收回宠物。</li>
                </ol>
              </div>
            </div>
            <div class="commitment-quote">
              “每一次领养，都是对生命的再次托付。感谢你愿意伸出双手给予它新的家。”
            </div>
            <label class="checkbox-label agreement-check">
              <input type="checkbox" v-model="applicationForm.agreeAgreement" required />
              <span>我已阅读并同意以上领养承诺书</span>
            </label>
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

interface LivingTypeOption {
  label: string
  value: string
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

const REMOVED_LIVING_TYPE_VALUES = new Set(['other', 'school', 'kindergarten'])
const REMOVED_LIVING_TYPE_LABELS = new Set(['其他', '学校', '幼儿园'])

const filterLivingTypeItems = (list: LivingTypeOption[]) =>
  list.filter(
    (item) =>
      item &&
      !REMOVED_LIVING_TYPE_VALUES.has(item.value) &&
      !REMOVED_LIVING_TYPE_LABELS.has(item.label)
  )

const DEFAULT_LIVING_TYPES: LivingTypeOption[] = filterLivingTypeItems([
  { label: '别墅/独栋', value: 'house' },
  { label: '公寓', value: 'apartment' },
  { label: '宿舍', value: 'dormitory' }
])
const LIVING_TYPE_STORAGE_KEY = 'custom_living_types'
const livingTypeOptions = ref<LivingTypeOption[]>([...DEFAULT_LIVING_TYPES])
const showAddLivingTypeInput = ref(false)
const newLivingTypeName = ref('')
const livingTypeError = ref('')

const ensureLivingTypeValid = () => {
  if (!applicationForm.value.livingType) return
  const exists = livingTypeOptions.value.some((item) => item.value === applicationForm.value.livingType)
  if (!exists) {
    applicationForm.value.livingType = ''
  }
}

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
      livingTypeOptions.value = filterLivingTypeItems(merged)
      ensureLivingTypeValid()
    }
  } catch (error) {
    console.warn('解析居住类型失败', error)
  }
}

const saveCustomLivingTypes = () => {
  const custom = filterLivingTypeItems(
    livingTypeOptions.value.filter((item) => !DEFAULT_LIVING_TYPES.find((def) => def.value === item.value))
  )
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
  livingTypeOptions.value = filterLivingTypeItems([...livingTypeOptions.value, { label: name, value }])
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
  color: #30a46c;
}

.pet-details .status-unknown {
  background: rgba(148, 163, 184, 0.25);
  color: #475569;
}

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

.btn-confirm {
  padding: 0.1rem 0.5rem;
  border: none;
  border-radius: 12px;
  margin: 5px 3px 0 1px;
  background-color: #a2d6c5;
}

.btn-confirm:hover {
  background-color: #3dae8f;
}

.btn-cancel {
  padding: 0.1rem 0.5rem;
  border: none;
  border-radius: 12px;
  background-color: #ecc4c4;
}

.btn-cancel:hover {
  background-color: #c97878;
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
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px dashed rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 1rem;
  gap: 0.85rem;
}

.living-step .member-item {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  background: #f8fafc;
}

.living-step .member-fields {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.living-step .member-fields input {
  flex: 1 1 150px;
}

.living-step .btn-remove {
  border-radius: 10px;
  font-weight: 500;
  background: #fee2e2;
  color: #b91c1c;
  padding: 0.5rem 1rem;
}

.living-step .family-members-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.25rem;
}

.living-step .btn-add-member {
  border-radius: 999px;
  font-weight: 600;
  padding: 0.55rem 1.3rem;
  background: #ecfdf5;
  color: #059669;
  border: 1px dashed rgba(5, 150, 105, 0.5);
}

.living-step .step-actions {
  margin-top: 0.5rem;
  justify-content: flex-end;
}

.experience-step {
  background: linear-gradient(180deg, #fffdf9 0%, #fff7ed 65%, #fff 100%);
  border: 1px solid rgba(253, 230, 138, 0.55);
  border-radius: 20px;
  padding: 2.25rem;
  box-shadow: 0 22px 50px rgba(217, 119, 6, 0.08);
}

.experience-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.experience-header h2 {
  margin: 0 0 0.4rem;
  font-size: 1.5rem;
  color: #b45309;
}

.experience-header p {
  margin: 0;
  color: #b45309;
  font-size: 0.95rem;
}

.experience-badge {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #b45309;
  background: #fef3c7;
  border: 1px solid rgba(251, 191, 36, 0.5);
  font-weight: 600;
}

.experience-layout {
  display: grid;
  grid-template-columns: minmax(220px, 260px) 1fr;
  gap: 1.5rem;
}

.experience-side-card {
  background: #fffbeb;
  border-radius: 18px;
  padding: 1.25rem;
  border: 1px solid rgba(251, 191, 36, 0.35);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.experience-side-card h3 {
  margin: 0 0 0.6rem;
  font-size: 1.1rem;
  color: #d97706;
}

.experience-side-card p {
  margin: 0 0 0.85rem;
  font-size: 0.92rem;
  color: #b45309;
}

.experience-side-card ul {
  margin: 0;
  padding-left: 1.1rem;
  color: #a16207;
  line-height: 1.5;
  font-size: 0.9rem;
}

.experience-fields .form-group {
  background: #fff;
  border-radius: 16px;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(251, 191, 36, 0.25);
}

.experience-fields .form-group+.form-group {
  margin-top: 1rem;
}

.experience-fields .form-group label {
  display: block;
  margin-bottom: 0.45rem;
  color: #b45309;
  font-weight: 600;
}

.experience-fields select,
.experience-fields textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #fde68a;
  padding: 0.75rem 0.85rem;
  background: #fffdfa;
  color: #78350f;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.experience-fields select:focus,
.experience-fields textarea:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
  background: #fff;
}

.experience-fields textarea {
  min-height: 120px;
  resize: vertical;
}

.experience-fields .form-group.inline {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.experience-fields .form-group.inline label {
  margin-bottom: 0;
  white-space: nowrap;
}

.experience-fields .form-group.inline select {
  flex: 1;
}

.experience-step .step-actions {
  margin-top: 0.5rem;
  justify-content: flex-end;
}

.agreement-step .agreement-content {
  background: linear-gradient(180deg, #ffffff 0%, #eef2ff 90%);
  border-radius: 20px;
  padding: 2.25rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 18px 40px rgba(79, 70, 229, 0.08);
}

.agreement-hero {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  padding-bottom: 1.25rem;
  border-bottom: 1px dashed rgba(99, 102, 241, 0.25);
  margin-bottom: 1.5rem;
}

.agreement-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.agreement-eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
  color: #6366f1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.agreement-hero h2 {
  margin: 0 0 0.35rem;
  font-size: 1.6rem;
  color: #312e81;
}

.agreement-hero p {
  margin: 0;
  color: #4338ca;
  font-size: 0.95rem;
}

.agreement-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
}

.agreement-box {
  background: #fff;
  border-radius: 16px;
  padding: 1.25rem 1.4rem;
  border: 1px solid rgba(99, 102, 241, 0.15);
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.05);
}

.agreement-box h3 {
  margin: 0 0 0.6rem;
  font-size: 1.1rem;
  color: #3730a3;
}

.agreement-box ol {
  margin: 0;
  padding-left: 1.15rem;
  color: #4c1d95;
  line-height: 1.6;
}

.commitment-quote {
  margin: 1.5rem 0 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.08);
  color: #1d4ed8;
  font-style: italic;
  text-align: center;
}

.agreement-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-weight: 600;
  color: #312e81;
}

.agreement-check input[type='checkbox'] {
  width: 18px;
  height: 18px;
}

.agreement-step .step-actions {
  margin-top: 1.25rem;
  padding-top: 0.5rem;
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

.step-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: rgba(229, 231, 235, 0.35);
  color: #374151;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(209, 213, 219, 0.65);
  box-shadow: 0 8px 18px rgba(55, 65, 81, 0.08);
}

.experience-header .step-indicator {
  margin-left: auto;
}

.step-indicator--info {
  background: rgba(125, 211, 252, 0.2);
  color: #0369a1;
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.2);
}

.step-indicator--living {
  background: rgba(134, 239, 172, 0.25);
  color: #047857;
  border-color: rgba(74, 222, 128, 0.45);
  box-shadow: 0 8px 18px rgba(16, 185, 129, 0.22);
}

.step-indicator--experience {
  background: rgba(251, 191, 36, 0.2);
  color: #b45309;
  border-color: rgba(251, 191, 36, 0.45);
  box-shadow: 0 8px 18px rgba(251, 191, 36, 0.25);
}

.step-indicator--exp.user-info-actions {
  margin: 1rem 0 1.5rem;
}

.user-info-actions__card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 1.1rem;
  background: linear-gradient(120deg, rgba(252, 231, 243, 0.9), rgba(255, 247, 237, 0.85));
  border: 1px solid rgba(251, 191, 36, 0.25);
  box-shadow: 0 15px 35px rgba(249, 168, 212, 0.25);
}

.user-info-actions__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #fff5f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
}

.user-info-actions__text {
  flex: 1;
}

.user-info-actions__text .title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #7c2d12;
}

.user-info-actions__text .desc {
  margin: 0.15rem 0 0;
  color: #9a3412;
  font-size: 0.9rem;
}

.user-info-actions__btn {
  border: none;
  background: #f97316;
  color: #fff;
  padding: 0.55rem 1.3rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  box-shadow: 0 10px 20px rgba(249, 115, 22, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-info-actions__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 24px rgba(249, 115, 22, 0.35);
}

.modify-info-btn {
  background: linear-gradient(120deg, #ff9a62, #ff5aa5 60%, #f43f5e);
  color: #fff;
  border: none;
  padding: 0.65rem 1.5rem;
  border-radius: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 12px 25px rgba(244, 63, 94, 0.3);
  margin-left: 5px;
}

.modify-info-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(244, 63, 94, 0.35);
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
  margin-left: 3px;
}

.btn-prev {
  background: #f3f4f6;
  color: #1f2937;
  border: 1px solid #e2e8f0;
}

.btn-next {
  background: linear-gradient(135deg, #34d399, #059669);
  color: #fff;
  box-shadow: 0 12px 30px rgba(5, 150, 105, 0.35);
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