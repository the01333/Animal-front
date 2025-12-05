<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <!-- 返回按钮 -->
      <div class="header">
        <el-button link @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>

      <!-- 标题 -->
      <div class="title-section">
        <h1 class="title">重置密码</h1>
        <p class="subtitle">请选择重置方式</p>
      </div>

      <!-- 重置方式选择 -->
      <el-tabs v-model="resetMethod" class="reset-tabs">
        <!-- 邮箱重置 -->
        <el-tab-pane label="邮箱重置" name="email">
          <el-form ref="emailFormRef" :model="emailForm" :rules="emailRules" size="large">
            <div class="form-label">邮箱</div>
            <el-form-item prop="email">
              <el-input
                v-model="emailForm.email"
                placeholder="请输入注册邮箱"
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
                  :disabled="emailCountdown > 0"
                  @click="sendEmailCode"
                >
                  {{ emailCountdown > 0 ? `${emailCountdown}秒后重试` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>

            <div class="form-label">新密码</div>
            <el-form-item prop="newPassword">
              <el-input
                v-model="emailForm.newPassword"
                type="password"
                placeholder="请输入新密码（至少6个字符）"
                show-password
              />
            </el-form-item>

            <div class="form-label">确认密码</div>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="emailForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>

            <el-button
              type="primary"
              :loading="emailLoading"
              class="submit-btn"
              @click="handleEmailReset"
            >
              重置密码
            </el-button>
          </el-form>
        </el-tab-pane>

        <!-- 手机重置 -->
        <el-tab-pane label="手机重置" name="phone">
          <el-form ref="phoneFormRef" :model="phoneForm" :rules="phoneRules" size="large">
            <div class="form-label">手机号</div>
            <el-form-item prop="phone">
              <el-input
                v-model="phoneForm.phone"
                placeholder="请输入注册手机号"
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
                  :disabled="phoneCountdown > 0"
                  @click="sendPhoneCode"
                >
                  {{ phoneCountdown > 0 ? `${phoneCountdown}秒后重试` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>

            <div class="form-label">新密码</div>
            <el-form-item prop="newPassword">
              <el-input
                v-model="phoneForm.newPassword"
                type="password"
                placeholder="请输入新密码（至少6个字符）"
                show-password
              />
            </el-form-item>

            <div class="form-label">确认密码</div>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="phoneForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>

            <el-button
              type="primary"
              :loading="phoneLoading"
              class="submit-btn"
              @click="handlePhoneReset"
            >
              重置密码
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { sendEmailVerificationCode, sendPhoneVerificationCode } from '@/api/user'

defineOptions({
  name: 'ResetPasswordView'
})

const router = useRouter()
const resetMethod = ref<'email' | 'phone'>('email')

// 邮箱重置表单
const emailFormRef = ref<FormInstance>()
const emailForm = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const validateEmailPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== emailForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const emailRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateEmailPassword, trigger: 'blur' }
  ]
}

// 手机重置表单
const phoneFormRef = ref<FormInstance>()
const phoneForm = reactive({
  phone: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const validatePhonePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== phoneForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePhonePassword, trigger: 'blur' }
  ]
}

// 倒计时
const emailCountdown = ref(0)
let emailTimer: number | null = null

const phoneCountdown = ref(0)
let phoneTimer: number | null = null

const emailLoading = ref(false)
const phoneLoading = ref(false)

const startEmailCountdown = () => {
  emailCountdown.value = 60
  if (emailTimer) clearInterval(emailTimer)
  emailTimer = window.setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0 && emailTimer) {
      clearInterval(emailTimer)
      emailTimer = null
    }
  }, 1000)
}

const startPhoneCountdown = () => {
  phoneCountdown.value = 60
  if (phoneTimer) clearInterval(phoneTimer)
  phoneTimer = window.setInterval(() => {
    phoneCountdown.value--
    if (phoneCountdown.value <= 0 && phoneTimer) {
      clearInterval(phoneTimer)
      phoneTimer = null
    }
  }, 1000)
}

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!emailForm.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  try {
    const res = await sendEmailVerificationCode(emailForm.email, 'reset_password')
    if (res.code === 200) {
      ElMessage.success('验证码已发送')
      startEmailCountdown()
    } else {
      ElMessage.error(res.message || '发送验证码失败')
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '发送验证码失败')
  }
}

// 发送手机验证码
const sendPhoneCode = async () => {
  if (!phoneForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  try {
    const res = await sendPhoneVerificationCode(phoneForm.phone, 'reset_password')
    if (res.code === 200) {
      ElMessage.success('验证码已发送')
      startPhoneCountdown()
    } else {
      ElMessage.error(res.message || '发送验证码失败')
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '发送验证码失败')
  }
}

// 邮箱重置密码
const handleEmailReset = async () => {
  if (!emailFormRef.value) return
  await emailFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请完整填写所有字段')
      return
    }
    emailLoading.value = true
    try {
      // TODO: 调用后端重置密码接口
      // const res = await resetPasswordByEmail({...})
      ElMessage.success('密码重置成功，请重新登录')
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error: any) {
      ElMessage.error(error?.response?.data?.message || '重置密码失败')
    } finally {
      emailLoading.value = false
    }
  })
}

// 手机重置密码
const handlePhoneReset = async () => {
  if (!phoneFormRef.value) return
  await phoneFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请完整填写所有字段')
      return
    }
    phoneLoading.value = true
    try {
      // TODO: 调用后端重置密码接口
      // const res = await resetPasswordByPhone({...})
      ElMessage.success('密码重置成功，请重新登录')
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error: any) {
      ElMessage.error(error?.response?.data?.message || '重置密码失败')
    } finally {
      phoneLoading.value = false
    }
  })
}

// 返回
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.reset-password-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  margin-bottom: 24px;
}

.back-btn {
  color: #7c8fa3;
  font-size: 14px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: #ff8c42;
}

.title-section {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 50%, #f97316 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  font-size: 14px;
  color: #7c8fa3;
  margin: 0;
  font-weight: 500;
}

.reset-tabs {
  margin-top: 24px;
}

:deep(.el-tabs__header) {
  margin-bottom: 24px;
  border-bottom: 2px solid #f0f2f5;
  border-radius: 12px;
  background: #f8f9fb;
  padding: 4px;
}

:deep(.el-tabs__item) {
  flex: 1;
  height: 40px;
  line-height: 40px;
  border-radius: 10px;
  font-weight: 600;
  color: #7c8fa3;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin: 0;
  border: none;
}

:deep(.el-tabs__item:hover) {
  color: #ff8c42;
  background: rgba(255, 140, 66, 0.08);
}

:deep(.el-tabs__item.is-active) {
  color: #ffffff;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  box-shadow: 0 8px 16px rgba(255, 140, 66, 0.3);
}

:deep(.el-tabs__active-bar) {
  display: none;
}

.form-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #4b5563;
  font-weight: 600;
  letter-spacing: 0.3px;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 10px 14px;
  background: #ffffff;
  border: 2px solid #e8eaef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  height: 40px;
}

:deep(.el-input__wrapper:hover) {
  border-color: #d4d8e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #ff8c42;
  background: #fffaf5;
  box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.15), 0 4px 16px rgba(255, 140, 66, 0.2);
  transform: translateY(-2px);
}

.code-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.code-input-wrapper :deep(.el-input) {
  flex: 1;
}

.code-input-wrapper :deep(.el-button) {
  flex-shrink: 0;
  min-width: 100px;
  height: 40px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 12px;
  border: 2px solid #e8eaef;
  background: #ffffff;
  color: #ff8c42;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  padding: 0 12px;
}

.code-input-wrapper :deep(.el-button:hover:not(:disabled)) {
  border-color: #ff8c42;
  background: rgba(255, 140, 66, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.2);
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 700;
  border-radius: 10px;
  margin-top: 24px;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 50%, #f97316 100%);
  border: none;
  color: #ffffff;
  box-shadow: 0 12px 32px rgba(255, 140, 66, 0.35);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff7a1f 0%, #ff5a1f 50%, #f97316 100%);
  box-shadow: 0 16px 40px rgba(255, 120, 54, 0.4);
  transform: translateY(-2px);
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__error) {
  font-size: 13px;
  color: #f56c6c;
  margin-top: 6px;
  margin-bottom: 8px;
  animation: errorShake 0.3s ease;
  display: block;
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

@media (max-width: 768px) {
  .reset-password-card {
    padding: 30px 25px;
  }

  .title {
    font-size: 22px;
  }

  .submit-btn {
    height: 48px;
    font-size: 15px;
  }
}
</style>
