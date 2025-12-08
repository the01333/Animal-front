<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-card">
        <!-- 头部 -->
        <div class="card-header">
          <h1 class="title">宠物领养系统</h1>
          <p class="subtitle">
            还没有账户？
            <el-link type="primary" :underline="false" @click="$router.push('/register')">
              在此注册
            </el-link>
          </p>
        </div>

        <!-- 登录方式切换 -->
        <el-tabs v-model="loginType" class="login-tabs">
          <el-tab-pane label="密码登录" name="password">
            <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" size="large">
              <div class="form-label">账号</div>
              <el-form-item prop="account">
                <el-input 
                  v-model="passwordForm.account" 
                  placeholder="请输入邮箱或手机号"
                  clearable
                />
              </el-form-item>

              <div class="form-label">
                <span>密码</span>
                <el-link type="primary" :underline="false" class="forgot-link">
                  忘记密码？
                </el-link>
              </div>
              <el-form-item prop="password">
                <el-input 
                  v-model="passwordForm.password" 
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  @keyup.enter="handlePasswordLogin"
                />
              </el-form-item>

              <el-form-item>
                <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
              </el-form-item>

              <el-button 
                type="primary" 
                :loading="loading" 
                class="login-btn"
                @click="handlePasswordLogin"
              >
                登入
              </el-button>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="验证码登录" name="code">
            <el-form ref="codeFormRef" :model="codeForm" :rules="codeRules" size="large">
              <el-radio-group v-model="codeType" class="code-type-radio">
                <el-radio-button label="email">邮箱</el-radio-button>
                <el-radio-button label="phone">手机</el-radio-button>
              </el-radio-group>

              <div class="form-label">{{ codeType === 'email' ? '邮箱' : '手机号' }}</div>
              <el-form-item prop="target">
                <el-input 
                  v-model="codeForm.target" 
                  :placeholder="codeType === 'email' ? '请输入邮箱地址' : '请输入手机号'"
                  clearable
                />
              </el-form-item>

              <div class="form-label">验证码</div>
              <el-form-item prop="code">
                <div class="code-input-wrapper">
                  <el-input 
                    v-model="codeForm.code" 
                    placeholder="请输入验证码"
                    @keyup.enter="handleCodeLogin"
                  />
                  <el-button 
                    :disabled="countdown > 0"
                    @click="sendVerificationCode"
                  >
                    {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                  </el-button>
                </div>
              </el-form-item>

              <el-button 
                type="primary" 
                :loading="loading" 
                class="login-btn"
                @click="handleCodeLogin"
              >
                登入
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
import { login, loginByEmailCode, loginByPhoneCode } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const loginType = ref('password')
const autoLogin = ref(false)
const showTip = ref(false)
const tipMessage = ref('')

// 密码登录表单
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  account: '',
  password: ''
})

const passwordRules = reactive<FormRules>({
  account: [
    { required: true, message: '请输入邮箱或手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ]
})

// 验证码登录表单
const codeFormRef = ref<FormInstance>()
const codeType = ref<'email' | 'phone'>('email')
const codeForm = reactive({
  target: '',
  code: ''
})

const codeRules = reactive<FormRules>({
  target: [
    { required: true, message: '请输入邮箱或手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
})

const countdown = ref(0)
let countdownTimer: number | null = null

// 密码登录
const handlePasswordLogin = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const response = await login({
        username: passwordForm.account,
        password: passwordForm.password
      })

      if (response.code === 200) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
        showSuccessTip('登录成功！正在跳转...')
        redirectAfterLogin()
      }
    } catch (error: any) {
      console.error('登录失败:', error)
    } finally {
      loading.value = false
    }
  })
}

// 验证码登录
const handleCodeLogin = async () => {
  if (!codeFormRef.value) return

  await codeFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const resp = codeType.value === 'email'
        ? await loginByEmailCode(codeForm.target, codeForm.code)
        : await loginByPhoneCode(codeForm.target, codeForm.code)

      if (resp.code === 200) {
        localStorage.setItem('token', resp.data.token)
        localStorage.setItem('userInfo', JSON.stringify(resp.data.userInfo))
        showSuccessTip('登录成功！正在跳转...')
        redirectAfterLogin(1000)
      }
    } catch (error: any) {
      console.error('登录失败:', error)
    } finally {
      loading.value = false
    }
  })
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!codeForm.target) {
    ElMessage.warning(`请先输入${codeType.value === 'email' ? '邮箱' : '手机号'}`)
    return
  }

  try {
    const endpoint = codeType.value === 'email' ? '/api/verification/email/send' : '/api/verification/phone/send'
    const response = await axios.post(endpoint, {
      [codeType.value]: codeForm.target,
      purpose: 'login'
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

const startCountdown = () => {
  countdown.value = 60
  countdownTimer && clearInterval(countdownTimer)
  countdownTimer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
      countdown.value = 0
    }
  }, 1000)
}

const redirectAfterLogin = (delay = 1500) => {
  setTimeout(() => {
    const redirect = router.currentRoute.value.query.redirect as string
    if (redirect) {
      window.location.href = redirect
    } else {
      router.push('/')
    }
  }, delay)
}

const showSuccessTip = (message: string) => {
  tipMessage.value = message
  showTip.value = true
  setTimeout(() => {
    showTip.value = false
  }, 3000)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.login-wrapper {
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 2;
}

.login-card {
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

.login-tabs {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.forgot-link {
  font-size: 13px;
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

.code-type-radio {
  width: 100%;
  margin-bottom: 20px;
}

:deep(.code-type-radio .el-radio-button) {
  flex: 1;
}

:deep(.code-type-radio .el-radio-button__inner) {
  width: 100%;
  border-radius: 8px;
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

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 10px;
  background: #409eff;
  border-color: #409eff;
}

.login-btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.divider-text {
  margin: 25px 0;
  color: #c0c4cc;
  font-size: 13px;
}

.social-login {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.social-btn {
  flex: 1;
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.social-btn .icon {
  flex-shrink: 0;
}

.wechat-btn {
  background: #07c160;
  color: white;
  border: none;
}

.wechat-btn:hover {
  background: #06ad56;
}

.qq-btn {
  background: #12b7f5;
  color: white;
  border: none;
}

.qq-btn:hover {
  background: #0ea8e0;
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

@media (max-width: 768px) {
  .login-card {
    padding: 30px 20px;
  }

  .social-login {
    flex-direction: column;
  }
}
</style>
