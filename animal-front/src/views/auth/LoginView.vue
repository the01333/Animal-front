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

        <!-- 第三方登录 -->
        <el-divider class="divider-text">OR</el-divider>
        
        <div class="social-login">
          <el-button class="social-btn wechat-btn" @click="handleWechatLogin">
            <svg class="icon" viewBox="0 0 1024 1024" width="20" height="20">
              <path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z" fill="#00C800"/>
            </svg>
            微信登录
          </el-button>
          <el-button class="social-btn qq-btn" @click="handleQQLogin">
            <svg class="icon" viewBox="0 0 1024 1024" width="20" height="20">
              <path d="M511.09 63.25c-174.84 0-316.59 123.88-316.59 276.75 0 56.99 18.97 109.9 51.58 154.75-23.45 71.59-62.89 122.38-62.89 122.38s84.4-9.39 141.12-49.68c33.19 12.3 69.42 19.03 107.18 19.03 174.84 0 316.59-123.88 316.59-276.75S685.93 63.25 511.09 63.25z" fill="#4EABE6"/>
              <path d="M826.49 600.43c25.6-35.84 40.96-78.34 40.96-123.9 0-45.57-15.36-88.06-40.96-123.9 0 0 0 0 0 0 0 0 0 0 0 0-25.6-35.84-63.49-66.56-107.52-89.09 0 0 0 0 0 0 0 0 0 0 0 0-44.03-22.53-92.16-35.84-143.36-35.84-51.2 0-99.33 13.31-143.36 35.84 0 0 0 0 0 0 0 0 0 0 0 0-44.03 22.53-81.92 53.25-107.52 89.09 0 0 0 0 0 0 0 0 0 0 0 0-25.6 35.84-40.96 78.34-40.96 123.9 0 45.57 15.36 88.06 40.96 123.9 0 0 0 0 0 0 0 0 0 0 0 0 25.6 35.84 63.49 66.56 107.52 89.09 0 0 0 0 0 0 0 0 0 0 0 0 44.03 22.53 92.16 35.84 143.36 35.84 51.2 0 99.33-13.31 143.36-35.84 0 0 0 0 0 0 0 0 0 0 0 0 44.03-22.53 81.92-53.25 107.52-89.09 0 0 0 0 0 0z" fill="#12B7F5"/>
            </svg>
            QQ登录
          </el-button>
        </div>

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
import { login, loginByEmailCode, loginByPhoneCode, wechatAuthorize, qqAuthorize } from '@/api/user'

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
const codeType = ref('email')
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
    if (valid) {
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
          
          setTimeout(() => {
            router.push('/')
          }, 1500)
        } else {
          ElMessage.error(response.data.message || '登录失败')
        }
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '登录失败，请检查网络连接')
      } finally {
        loading.value = false
      }
    }
  })
}

// 验证码登录
const handleCodeLogin = async () => {
  if (!codeFormRef.value) return

  await codeFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        let resp
        if (codeType.value === 'email') {
          resp = await loginByEmailCode(codeForm.target, codeForm.code)
        } else {
          resp = await loginByPhoneCode(codeForm.target, codeForm.code)
        }
        if (resp.code === 200) {
          localStorage.setItem('token', resp.data.token)
          localStorage.setItem('userInfo', JSON.stringify(resp.data.userInfo))
          showSuccessTip('登录成功！正在跳转...')
          setTimeout(() => { router.push('/') }, 1000)
        } else {
          ElMessage.error(resp.message || '登录失败')
        }
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '登录失败')
      } finally {
        loading.value = false
      }
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

// 微信登录
const handleWechatLogin = async () => {
  try {
    const res = await wechatAuthorize()
    if (res.code === 200) {
      window.location.href = res.data.url
    } else {
      ElMessage.error(res.message || '获取授权地址失败')
    }
  } catch (e) {
    ElMessage.error('获取授权地址失败')
  }
}

// QQ登录
const handleQQLogin = async () => {
  try {
    const res = await qqAuthorize()
    if (res.code === 200) {
      window.location.href = res.data.url
    } else {
      ElMessage.error(res.message || '获取授权地址失败')
    }
  } catch (e) {
    ElMessage.error('获取授权地址失败')
  }
}

// 显示成功提示
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
