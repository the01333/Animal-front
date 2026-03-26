<template>
  <div class="register-container">
    <div class="register-wrapper">
      <div class="register-card">
        <!-- 头部 -->
        <div class="card-header">
          <h1 class="title">创建新账户</h1>
          <p class="subtitle">
            已有账户？
            <el-link type="primary" :underline="false" @click="$router.push('/login')">
              立即登录
            </el-link>
          </p>
        </div>

        <!-- 注册方式切换 -->
        <el-tabs v-model="registerType" class="register-tabs">
          <el-tab-pane label="邮箱注册" name="email">
            <el-form ref="emailFormRef" :model="emailForm" :rules="emailRules" size="large">
              <div class="form-label">邮箱</div>
              <el-form-item prop="email">
                <el-input 
                  v-model="emailForm.email" 
                  placeholder="请输入邮箱地址"
                  clearable
                />
              </el-form-item>

              <div class="form-label">验证码</div>
              <el-form-item prop="code">
                <div class="code-input-wrapper">
                  <el-input 
                    v-model="emailForm.code" 
                    placeholder="请输入验证码"
                  />
                  <el-button 
                    :disabled="countdown > 0 || sendingCode"
                    @click="sendEmailCode"
                  >
                    {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                  </el-button>
                </div>
              </el-form-item>

              <div class="form-label">设置密码</div>
              <el-form-item prop="password">
                <el-input 
                  v-model="emailForm.password" 
                  type="password"
                  placeholder="请设置密码（至少6个字符）"
                  show-password
                />
              </el-form-item>

              <el-form-item prop="agreeTerms">
                <el-checkbox v-model="emailForm.agreeTerms">
                  我已阅读并同意
                  <el-link type="primary" :underline="false" @click.stop="openPolicyFromRegister('terms')">《用户协议》</el-link>
                  和
                  <el-link type="primary" :underline="false" @click.stop="openPolicyFromRegister('privacy')">《隐私政策》</el-link>
                </el-checkbox>
              </el-form-item>

              <el-button 
                type="primary" 
                :loading="loading" 
                class="register-btn"
                @click="handleEmailRegister"
              >
                注册
              </el-button>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="手机注册" name="phone">
            <el-form ref="phoneFormRef" :model="phoneForm" :rules="phoneRules" size="large">
              <div class="form-label">手机号</div>
              <el-form-item prop="phone">
                <el-input 
                  v-model="phoneForm.phone" 
                  placeholder="请输入手机号"
                  clearable
                />
              </el-form-item>

              <div class="form-label">验证码</div>
              <el-form-item prop="code">
                <div class="code-input-wrapper">
                  <el-input 
                    v-model="phoneForm.code" 
                    placeholder="请输入验证码"
                  />
                  <el-button 
                    :disabled="countdown > 0 || sendingCode"
                    @click="sendPhoneCode"
                  >
                    {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                  </el-button>
                </div>
              </el-form-item>

              <div class="form-label">设置密码</div>
              <el-form-item prop="password">
                <el-input 
                  v-model="phoneForm.password" 
                  type="password"
                  placeholder="请设置密码（至少6个字符）"
                  show-password
                />
              </el-form-item>

              <el-form-item prop="agreeTerms">
                <el-checkbox v-model="phoneForm.agreeTerms">
                  我已阅读并同意
                  <el-link type="primary" :underline="false" @click.stop="openPolicyFromRegister('terms')">《用户协议》</el-link>
                  和
                  <el-link type="primary" :underline="false" @click.stop="openPolicyFromRegister('privacy')">《隐私政策》</el-link>
                </el-checkbox>
              </el-form-item>

              <el-button 
                type="primary" 
                :loading="loading" 
                class="register-btn"
                @click="handlePhoneRegister"
              >
                注册
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <!-- 提示信息 -->
        <div v-if="showTip" class="success-tip">
          <el-icon class="tip-icon"><CircleCheck /></el-icon>
          <span>{{ tipMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const registerType = ref('email')
const showTip = ref(false)
const tipMessage = ref('')

// 邮箱注册表单
const emailFormRef = ref<FormInstance>()
const emailForm = reactive({
  email: '',
  code: '',
  password: '',
  agreeTerms: false
})

const validateAgreeTerms = (rule: any, value: any, callback: any) => {
  if (!emailForm.agreeTerms) {
    callback(new Error('请同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

const emailRules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  agreeTerms: [
    { validator: validateAgreeTerms, trigger: 'change' }
  ]
})

// 手机注册表单
const phoneFormRef = ref<FormInstance>()
const phoneForm = reactive({
  phone: '',
  code: '',
  password: '',
  agreeTerms: false
})

const validatePhoneAgreeTerms = (rule: any, value: any, callback: any) => {
  if (!phoneForm.agreeTerms) {
    callback(new Error('请同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

const phoneRules = reactive<FormRules>({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  agreeTerms: [
    { validator: validatePhoneAgreeTerms, trigger: 'change' }
  ]
})

const countdown = ref(0)
let countdownTimer: number | null = null
const sendingCode = ref(false)

const getEmailFormErrorMessage = () => {
  if (!emailForm.email) return '请输入邮箱'
  if (!emailForm.code) return '请输入验证码'
  if (!emailForm.password) return '请输入密码'
  if (!emailForm.agreeTerms) return '请同意用户协议和隐私政策'
  return '请完善注册信息'
}

const getPhoneFormErrorMessage = () => {
  if (!phoneForm.phone) return '请输入手机号'
  if (!phoneForm.code) return '请输入验证码'
  if (!phoneForm.password) return '请输入密码'
  if (!phoneForm.agreeTerms) return '请同意用户协议和隐私政策'
  return '请完善注册信息'
}

// 邮箱注册
const handleEmailRegister = async () => {
  if (!emailFormRef.value) return

  await emailFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error(getEmailFormErrorMessage())
      return
    }

    loading.value = true
    try {
      const response = await axios.post('/api/user/register', {
        email: emailForm.email,
        password: emailForm.password,
        code: emailForm.code,
        registerType: 'email'
      })

      if (response.data.code === 200) {
        showSuccessTip('注册成功！正在跳转到登录页...')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        ElMessage.error(response.data.message || '注册失败')
      }
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '注册失败，请检查网络连接')
    } finally {
      loading.value = false
    }
  })
}

// 手机注册
const handlePhoneRegister = async () => {
  if (!phoneFormRef.value) return

  await phoneFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error(getPhoneFormErrorMessage())
      return
    }

    loading.value = true
    try {
      const response = await axios.post('/api/user/register', {
        phone: phoneForm.phone,
        password: phoneForm.password,
        code: phoneForm.code,
        registerType: 'phone'
      })

      if (response.data.code === 200) {
        showSuccessTip('注册成功！正在跳转到登录页...')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        ElMessage.error(response.data.message || '注册失败')
      }
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '注册失败，请检查网络连接')
    } finally {
      loading.value = false
    }
  })
}

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!emailForm.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }

  if (countdown.value > 0 || sendingCode.value) {
    return
  }

  sendingCode.value = true
  try {
    const response = await axios.post('/api/verification/email/send', {
      email: emailForm.email,
      purpose: 'register'
    })

    if (response.data.code === 200) {
      ElMessage.success('验证码已发送')
      startCountdown()
    } else {
      ElMessage.error(response.data.message || '发送失败')
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '发送失败')
  } finally {
    sendingCode.value = false
  }
}

// 发送手机验证码
const sendPhoneCode = async () => {
  if (!phoneForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }

  if (countdown.value > 0 || sendingCode.value) {
    return
  }

  sendingCode.value = true
  try {
    const response = await axios.post('/api/verification/phone/send', {
      phone: phoneForm.phone,
      purpose: 'register'
    })

    if (response.data.code === 200) {
      ElMessage.success('验证码已发送')
      startCountdown()
    } else {
      ElMessage.error(response.data.message || '发送失败')
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '发送失败')
  }
}

// 倒计时
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

// 显示成功提示
const showSuccessTip = (message: string) => {
  tipMessage.value = message
  showTip.value = true
  setTimeout(() => {
    showTip.value = false
  }, 3000)
}

const openPolicyFromRegister = (type: 'terms' | 'privacy') => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('openPolicyDialog', {
      detail: { type: type === 'terms' ? 'terms' : 'privacy' }
    })
  )
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  position: relative;
}

.register-wrapper {
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 2;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.register-tabs {
  margin-bottom: 20px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
}

.form-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 12px 15px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.code-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.code-input-wrapper .el-input {
  flex: 1;
}

.code-input-wrapper .el-button {
  white-space: nowrap;
  padding: 0 20px;
  height: auto;
  min-height: 48px;
  border-radius: 8px;
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 10px;
  background: #409eff;
  border-color: #409eff;
}

.register-btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.success-tip {
  margin-top: 20px;
  padding: 12px 16px;
  background: #f0f9ff;
  border: 1px solid #b3e0ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #409eff;
  font-size: 14px;
  animation: slideIn 0.3s ease-out;
}

.tip-icon {
  font-size: 18px;
  flex-shrink: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-checkbox) {
  font-size: 14px;
}

:deep(.el-checkbox__label) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .register-card {
    padding: 30px 20px;
  }
}
</style>
