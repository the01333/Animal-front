<template>
  <div class="apply-container">
    <div class="apply-header">
      <h1>申请领养 - {{ pet?.name }}</h1>
      <div class="pet-info-summary" v-if="pet">
        <img :src="pet.image || defaultImage" :alt="pet.name" />
        <div class="pet-details">
          <h3>{{ pet.name }}</h3>
          <p>{{ pet.breed }} | {{ pet.age }}岁</p>
          <span :class="statusClass">{{ statusText }}</span>
        </div>
      </div>
    </div>
    
    <div class="apply-content">
      <div class="apply-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="step.key"
          class="step-item"
          :class="{ active: currentStep === index + 1, completed: currentStep > index + 1 }"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>
      
      <div class="apply-form">
        <!-- 第一步：个人信息确认 -->
        <div v-if="currentStep === 1" class="form-step">
          <h2>个人信息确认</h2>
          <div class="user-info">
            <div class="info-item">
              <label>姓名:</label>
              <span>{{ userInfo.name }}</span>
            </div>
            <div class="info-item">
              <label>手机号:</label>
              <span>{{ userInfo.phone }}</span>
            </div>
            <div class="info-item">
              <label>邮箱:</label>
              <span>{{ userInfo.email }}</span>
            </div>
            <div class="info-item">
              <label>地址:</label>
              <span>{{ userInfo.address }}</span>
            </div>
          </div>
          
          <div class="certification-status">
            <div class="status-item">
              <label>领养者认证:</label>
              <span :class="certificationStatusClass">{{ certificationStatusText }}</span>
            </div>
          </div>
          
          <div class="step-actions">
            <button @click="nextStep" class="btn-next">下一步</button>
          </div>
        </div>
        
        <!-- 第二步：居住环境 -->
        <div v-if="currentStep === 2" class="form-step">
          <h2>居住环境</h2>
          <form @submit.prevent="nextStep">
            <div class="form-group">
              <label for="livingType">居住类型:</label>
              <select id="livingType" v-model="applicationForm.livingType" required>
                <option value="">请选择</option>
                <option value="house"> house</option>
                <option value="apartment">公寓</option>
                <option value="dormitory">宿舍</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="houseSize">住房面积(平方米):</label>
              <input 
                id="houseSize" 
                v-model.number="applicationForm.houseSize" 
                type="number" 
                min="0" 
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="yard">是否有院子:</label>
              <select id="yard" v-model="applicationForm.yard" required>
                <option value="">请选择</option>
                <option value="yes">是</option>
                <option value="no">否</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>家庭成员:</label>
              <div class="family-members">
                <div 
                  v-for="(member, index) in applicationForm.familyMembers" 
                  :key="index" 
                  class="member-item"
                >
                  <input 
                    v-model="member.name" 
                    type="text" 
                    placeholder="姓名" 
                    required 
                  />
                  <input 
                    v-model.number="member.age" 
                    type="number" 
                    placeholder="年龄" 
                    min="0" 
                    required 
                  />
                  <button 
                    type="button" 
                    @click="removeFamilyMember(index)" 
                    class="btn-remove"
                  >
                    删除
                  </button>
                </div>
                <button 
                  type="button" 
                  @click="addFamilyMember" 
                  class="btn-add-member"
                >
                  添加家庭成员
                </button>
              </div>
            </div>
            
            <div class="step-actions">
              <button type="button" @click="prevStep" class="btn-prev">上一步</button>
              <button type="submit" class="btn-next">下一步</button>
            </div>
          </form>
        </div>
        
        <!-- 第三步：养宠经验 -->
        <div v-if="currentStep === 3" class="form-step">
          <h2>养宠经验</h2>
          <form @submit.prevent="nextStep">
            <div class="form-group">
              <label for="hasPetExperience">是否有养宠经验:</label>
              <select id="hasPetExperience" v-model="applicationForm.hasPetExperience" required>
                <option value="">请选择</option>
                <option value="yes">是</option>
                <option value="no">否</option>
              </select>
            </div>
            
            <div v-if="applicationForm.hasPetExperience === 'yes'" class="form-group">
              <label for="currentPets">目前饲养的宠物:</label>
              <textarea 
                id="currentPets" 
                v-model="applicationForm.currentPets" 
                rows="3" 
                placeholder="请描述您目前饲养的宠物情况"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="petKnowledge">对宠物知识的了解:</label>
              <textarea 
                id="petKnowledge" 
                v-model="applicationForm.petKnowledge" 
                rows="3" 
                placeholder="请描述您对宠物饲养、健康、行为等方面的知识了解"
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="reason">申请领养的原因:</label>
              <textarea 
                id="reason" 
                v-model="applicationForm.reason" 
                rows="3" 
                placeholder="请详细说明您申请领养这只宠物的原因"
                required
              ></textarea>
            </div>
            
            <div class="step-actions">
              <button type="button" @click="prevStep" class="btn-prev">上一步</button>
              <button type="submit" class="btn-next">下一步</button>
            </div>
          </form>
        </div>
        
        <!-- 第四步：承诺与协议 -->
        <div v-if="currentStep === 4" class="form-step">
          <h2>承诺与协议</h2>
          <div class="agreement-content">
            <h3>领养承诺书</h3>
            <div class="agreement-text">
              <p>我承诺：</p>
              <ol>
                <li>我会为宠物提供安全、舒适的生活环境。</li>
                <li>我会按时为宠物接种疫苗，定期体检。</li>
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
                <input 
                  type="checkbox" 
                  v-model="applicationForm.agreeAgreement" 
                  required 
                />
                我已阅读并同意以上领养承诺书
              </label>
            </div>
          </div>
          
          <div class="step-actions">
            <button type="button" @click="prevStep" class="btn-prev">上一步</button>
            <button @click="submitApplication" class="btn-submit" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交申请' }}
            </button>
          </div>
        </div>
        
        <!-- 提交成功 -->
        <div v-if="currentStep === 5" class="form-step success-step">
          <div class="success-icon">✓</div>
          <h2>申请提交成功</h2>
          <p>您的领养申请已成功提交，申请编号为: <strong>{{ applicationId }}</strong></p>
          <p>我们将在3-5个工作日内完成审核，请您耐心等待。</p>
          <p>您可以在个人中心查看申请状态。</p>
          <div class="success-actions">
            <router-link to="/applications" class="btn-view-applications">查看我的申请</router-link>
            <router-link to="/" class="btn-home">返回首页</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义宠物对象的接口
interface Pet {
  id: number
  name: string
  breed: string
  age: number
  image?: string
  status: 'available' | 'adopted' | 'pending'
}

// 用户信息
const userInfo = ref({
  name: '张三',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  address: '北京市朝阳区某某街道',
  certificationStatus: 'approved' as 'not_submitted' | 'pending' | 'approved' | 'rejected'
})

// 申请表单
const applicationForm = ref({
  livingType: '',
  houseSize: null as number | null,
  yard: '',
  familyMembers: [{ name: '', age: null as number | null }],
  hasPetExperience: '',
  currentPets: '',
  petKnowledge: '',
  reason: '',
  agreeAgreement: false
})

// 路由相关
const route = useRoute()
const router = useRouter()

// 宠物数据
const pet = ref<Pet | null>(null)

// 默认图片
const defaultImage = 'https://via.placeholder.com/100x100?text=宠物'

// 申请步骤
const steps = [
  { key: 'info', label: '信息确认' },
  { key: 'living', label: '居住环境' },
  { key: 'experience', label: '养宠经验' },
  { key: 'agreement', label: '承诺协议' }
]

// 当前步骤
const currentStep = ref(1)

// 提交状态
const submitting = ref(false)

// 申请ID
const applicationId = ref('')

// 认证状态文本
const certificationStatusText = computed(() => {
  switch (userInfo.value.certificationStatus) {
    case 'not_submitted': return '未提交认证'
    case 'pending': return '认证审核中'
    case 'approved': return '已认证'
    case 'rejected': return '认证被拒绝'
    default: return '未知'
  }
})

// 认证状态样式
const certificationStatusClass = computed(() => {
  return {
    'status-not-certified': userInfo.value.certificationStatus !== 'approved',
    'status-certified': userInfo.value.certificationStatus === 'approved'
  }
})

// 宠物状态文本
const statusText = computed(() => {
  if (!pet.value) return ''
  switch (pet.value.status) {
    case 'available': return '可领养'
    case 'adopted': return '已领养'
    case 'pending': return '领养中'
    default: return '未知'
  }
})

// 宠物状态样式
const statusClass = computed(() => {
  if (!pet.value) return ''
  return {
    'status-available': pet.value.status === 'available',
    'status-adopted': pet.value.status === 'adopted',
    'status-pending': pet.value.status === 'pending'
  }
})

// 添加家庭成员
const addFamilyMember = () => {
  applicationForm.value.familyMembers.push({ name: '', age: null })
}

// 删除家庭成员
const removeFamilyMember = (index: number) => {
  if (applicationForm.value.familyMembers.length > 1) {
    applicationForm.value.familyMembers.splice(index, 1)
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 下一步
const nextStep = () => {
  // 验证当前步骤的表单
  if (currentStep.value === 2) {
    // 居住环境步骤验证
    if (!applicationForm.value.livingType || 
        !applicationForm.value.houseSize || 
        !applicationForm.value.yard) {
      alert('请填写完整的居住环境信息')
      return
    }
  } else if (currentStep.value === 3) {
    // 养宠经验步骤验证
    if (!applicationForm.value.hasPetExperience || 
        !applicationForm.value.petKnowledge || 
        !applicationForm.value.reason) {
      alert('请填写完整的养宠经验信息')
      return
    }
  }
  
  if (currentStep.value < 5) {
    currentStep.value++
  }
}

// 提交申请
const submitApplication = async () => {
  if (!applicationForm.value.agreeAgreement) {
    alert('请同意领养承诺书')
    return
  }
  
  submitting.value = true
  
  try {
    // 模拟提交申请
    // 在实际应用中，这里会调用后端API提交申请
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟生成申请ID
    applicationId.value = 'APP' + Date.now()
    
    // 跳转到成功页面
    currentStep.value = 5
  } catch (error) {
    alert('申请提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 模拟获取宠物详情
const fetchPetDetail = () => {
  // 从路由参数获取宠物ID
  const petId = parseInt(route.params.petId as string)
  
  // 模拟宠物数据
  const mockPets: Pet[] = [
    {
      id: 1,
      name: '小花',
      breed: '中华田园猫',
      age: 2,
      image: 'https://via.placeholder.com/100x100?text=小花',
      status: 'available'
    },
    {
      id: 2,
      name: '旺财',
      breed: '金毛犬',
      age: 1,
      image: 'https://via.placeholder.com/100x100?text=旺财',
      status: 'available'
    }
  ]
  
  // 查找对应ID的宠物
  pet.value = mockPets.find(p => p.id === petId) || null
}

onMounted(() => {
  fetchPetDetail()
})
</script>

<style scoped>
.apply-container {
  padding: 1rem 0;
}

.apply-header h1 {
  margin-bottom: 1rem;
  color: #333;
}

.pet-info-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.pet-info-summary img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.pet-details h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.pet-details p {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.status-available {
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.apply-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.apply-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ddd;
  z-index: 1;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.step-label {
  color: #999;
  font-size: 0.9rem;
}

.step-item.active .step-number {
  background-color: #42b983;
  color: white;
}

.step-item.active .step-label {
  color: #42b983;
  font-weight: bold;
}

.step-item.completed .step-number {
  background-color: #42b983;
  color: white;
}

.step-item.completed .step-label {
  color: #42b983;
}

.apply-form {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-step h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.user-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

.info-item span {
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.certification-status {
  margin-bottom: 1.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-item label {
  font-weight: bold;
  color: #333;
}

.status-not-certified {
  background-color: #ff9800;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status-certified {
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.family-members {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.member-item input {
  flex: 1;
}

.btn-remove {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-add-member {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 0.5rem;
  margin-top: 0.25rem;
}

.agreement-content {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.agreement-text ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.agreement-text li {
  margin-bottom: 0.5rem;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn-prev, .btn-next, .btn-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-prev {
  background-color: #999;
  color: white;
}

.btn-next {
  background-color: #42b983;
  color: white;
}

.btn-submit {
  background-color: #42b983;
  color: white;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success-step {
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #42b983;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
}

.success-step h2 {
  margin-bottom: 1rem;
  color: #333;
}

.success-step p {
  margin-bottom: 0.5rem;
  color: #666;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-view-applications, .btn-home {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.btn-view-applications {
  background-color: #2196f3;
  color: white;
}

.btn-home {
  background-color: #42b983;
  color: white;
}

@media (max-width: 768px) {
  .pet-info-summary {
    flex-direction: column;
    text-align: center;
  }
  
  .user-info {
    grid-template-columns: 1fr;
  }
  
  .member-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .step-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .success-actions {
    flex-direction: column;
  }
}
</style>