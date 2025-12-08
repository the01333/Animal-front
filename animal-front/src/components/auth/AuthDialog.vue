<template>
  <el-dialog v-model="dialogVisible" :title="null" width="480" :close-on-click-modal="false" align-center
    destroy-on-close append-to-body class="auth-dialog">
    <div class="auth-dialog-content">
      <!-- 头部 -->
      <div class="dialog-header">
        <h2 class="dialog-title">欢迎来到 i 宠园</h2>
        <p class="dialog-subtitle">
          <template v-if="activeTab === 'login'">
            还没有账户？
            <el-link type="primary" :underline="false" @click="switchToRegister">
              在此注册
            </el-link>
          </template>
          <template v-else>
            已有账户？
            <el-link type="primary" :underline="false" @click="switchToLogin">
              立即登录
            </el-link>
          </template>
        </p>
      </div>

      <!-- 登录/注册表单切换 -->
      <div v-if="activeTab === 'login'" class="form-container">
        <div class="form-inner">
          <el-tabs v-model="loginMethod" class="method-tabs">
            <el-tab-pane label="手机号登录" name="phone">
              <el-form ref="loginPhoneFormRef" :model="loginPhoneForm" :rules="loginPhoneRules" size="large">
                <div class="form-label">手机号</div>
                <el-form-item prop="phone">
                  <el-input v-model="loginPhoneForm.phone" placeholder="请输入手机号" clearable />
                </el-form-item>

                <div class="form-label">验证码</div>
                <el-form-item prop="code">
                  <div class="code-input-wrapper">
                    <el-input v-model="loginPhoneForm.code" placeholder="请输入验证码" @keyup.enter="handleLoginByCode" />
                    <el-button :disabled="loginCountdown > 0" @click="sendLoginCode('phone')">
                      {{ loginCountdown > 0 ? `${loginCountdown}秒后重试` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>

                <el-button type="primary" :loading="loginLoading" class="submit-btn" @click="handleLoginByCode">
                  登入
                </el-button>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="邮箱登录" name="email">
              <el-form ref="loginEmailFormRef" :model="loginEmailForm" :rules="loginEmailRules" size="large">
                <div class="form-label">邮箱</div>
                <el-form-item prop="email">
                  <el-input v-model="loginEmailForm.email" placeholder="请输入邮箱地址" clearable />
                </el-form-item>

                <div class="form-label">验证码</div>
                <el-form-item prop="code">
                  <div class="code-input-wrapper">
                    <el-input v-model="loginEmailForm.code" placeholder="请输入验证码" @keyup.enter="handleLoginByCode" />
                    <el-button :disabled="loginCountdown > 0" @click="sendLoginCode('email')">
                      {{ loginCountdown > 0 ? `${loginCountdown}秒后重试` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>

                <el-button type="primary" :loading="loginLoading" class="submit-btn" @click="handleLoginByCode">
                  登入
                </el-button>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="密码登录" name="password">
              <el-form ref="loginPasswordFormRef" :model="loginPasswordForm" :rules="loginPasswordRules" size="large">
                <div class="form-label">用户名</div>
                <el-form-item prop="username">
                  <el-input v-model="loginPasswordForm.username" placeholder="请输入用户名" clearable />
                </el-form-item>

                <div class="form-label">
                  <span>密码</span>
                  <el-link type="primary" :underline="false" class="forgot-link" @click="goToResetPassword">
                    忘记密码？
                  </el-link>
                </div>
                <el-form-item prop="password">
                  <el-input v-model="loginPasswordForm.password" type="password" placeholder="请输入密码" show-password
                    @keyup.enter="handleLoginByPassword" />
                </el-form-item>

                <el-button type="primary" :loading="loginLoading" class="submit-btn" @click="handleLoginByPassword">
                  登录
                </el-button>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div v-else class="form-container">
        <div class="form-inner">
          <el-tabs v-model="registerMethod" class="method-tabs">
            <el-tab-pane label="手机注册" name="phone">
              <el-form ref="registerPhoneFormRef" :model="registerPhoneForm" :rules="registerPhoneRules" size="large">
                <div class="form-label">手机号</div>
                <el-form-item prop="phone">
                  <el-input v-model="registerPhoneForm.phone" placeholder="请输入手机号" clearable />
                </el-form-item>

                <div class="form-label">验证码</div>
                <el-form-item prop="code">
                  <div class="code-input-wrapper">
                    <el-input v-model="registerPhoneForm.code" placeholder="请输入验证码"
                      @keyup.enter="handleRegisterByCode" />
                    <el-button :disabled="registerCountdown > 0" @click="sendRegisterCode('phone')">
                      {{ registerCountdown > 0 ? `${registerCountdown}秒后重试` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item prop="agree" class="agreement-item agreement-item-phone">
                  <el-checkbox v-model="registerPhoneForm.agree">
                    <span class="agreement-text">
                      <span>我已阅读并同意</span>
                      <el-link type="primary" :underline="false">《用户协议》</el-link>
                      <span>和</span>
                      <el-link type="primary" :underline="false">《隐私政策》</el-link>
                    </span>
                  </el-checkbox>
                </el-form-item>

                <el-button type="primary" :loading="registerLoading" class="submit-btn" @click="handleRegisterByCode">
                  注册并登录
                </el-button>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="邮箱注册" name="email">
              <el-form ref="registerEmailFormRef" :model="registerEmailForm" :rules="registerEmailRules" size="large">
                <div class="form-label">邮箱</div>
                <el-form-item prop="email">
                  <el-input v-model="registerEmailForm.email" placeholder="请输入邮箱地址" clearable />
                </el-form-item>

                <div class="form-label">验证码</div>
                <el-form-item prop="code">
                  <div class="code-input-wrapper">
                    <el-input v-model="registerEmailForm.code" placeholder="请输入验证码"
                      @keyup.enter="handleRegisterByCode" />
                    <el-button :disabled="registerCountdown > 0" @click="sendRegisterCode('email')">
                      {{ registerCountdown > 0 ? `${registerCountdown}秒后重试` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item prop="agree" class="agreement-item">
                  <el-checkbox v-model="registerEmailForm.agree">
                    <span class="agreement-text">
                      <span>我已阅读并同意</span>
                      <el-link type="primary" :underline="false">《用户协议》</el-link>
                      <span>和</span>
                      <el-link type="primary" :underline="false">《隐私政策》</el-link>
                    </span>
                  </el-checkbox>
                </el-form-item>

                <el-button type="primary" :loading="registerLoading" class="submit-btn" @click="handleRegisterByCode">
                  注册并登录
                </el-button>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  loginByEmailCode,
  loginByPhoneCode,
  sendEmailVerificationCode,
  sendPhoneVerificationCode,
  login as loginApi
} from '@/api/user'

defineOptions({
  name: 'AuthDialog'
})

const props = defineProps<{
  modelValue: boolean
  defaultTab?: 'login' | 'register'
}>()

const emit = defineEmits(['update:modelValue', 'login-success', 'register-success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const router = useRouter()
const activeTab = ref<'login' | 'register'>(props.defaultTab || 'login')

// 当前登录/注册方式
const loginMethod = ref<'phone' | 'email' | 'password'>('phone')
const registerMethod = ref<'phone' | 'email'>('phone')

// 登录表单 - 手机
const loginPhoneFormRef = ref<FormInstance>()
const loginPhoneForm = reactive({
  phone: '',
  code: ''
})

const loginPhoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

// 登录表单 - 邮箱
const loginEmailFormRef = ref<FormInstance>()
const loginEmailForm = reactive({
  email: '',
  code: ''
})

const loginEmailRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

// 登录表单 - 账号密码
const loginPasswordFormRef = ref<FormInstance>()
const loginPasswordForm = reactive({
  username: '',
  password: ''
})

const loginPasswordRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ]
}

// 注册表单 - 手机
const registerPhoneFormRef = ref<FormInstance>()
const registerPhoneForm = reactive({
  phone: '',
  code: '',
  agree: false
})

const validatePhoneAgree = (rule: any, value: any, callback: any) => {
  if (!registerPhoneForm.agree) {
    callback(new Error('请同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

const registerPhoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  agree: [
    { validator: validatePhoneAgree, trigger: 'change' }
  ]
}

// 注册表单 - 邮箱
const registerEmailFormRef = ref<FormInstance>()
const registerEmailForm = reactive({
  email: '',
  code: '',
  agree: false
})

const validateEmailAgree = (rule: any, value: any, callback: any) => {
  if (!registerEmailForm.agree) {
    callback(new Error('请同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

const registerEmailRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  agree: [
    { validator: validateEmailAgree, trigger: 'change' }
  ]
}

// 倒计时
const loginCountdown = ref(0)
let loginTimer: number | null = null

const registerCountdown = ref(0)
let registerTimer: number | null = null

const loginLoading = ref(false)
const registerLoading = ref(false)

const userStore = useUserStore()

const setLoginState = (token: string, userInfo: any) => {
  userStore.token = token
  userStore.userInfo = userInfo
  localStorage.setItem('token', token)
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

const startLoginCountdown = () => {
  loginCountdown.value = 60
  if (loginTimer) clearInterval(loginTimer)
  loginTimer = window.setInterval(() => {
    loginCountdown.value--
    if (loginCountdown.value <= 0 && loginTimer) {
      clearInterval(loginTimer)
      loginTimer = null
    }
  }, 1000)
}

const startRegisterCountdown = () => {
  registerCountdown.value = 60
  if (registerTimer) clearInterval(registerTimer)
  registerTimer = window.setInterval(() => {
    registerCountdown.value--
    if (registerCountdown.value <= 0 && registerTimer) {
      clearInterval(registerTimer)
      registerTimer = null
    }
  }, 1000)
}

// 发送登录验证码
const sendLoginCode = async (type: 'phone' | 'email') => {
  try {
    if (type === 'phone') {
      if (!loginPhoneForm.phone) {
        ElMessage.warning('请先输入手机号')
        return
      }
      const res = await sendPhoneVerificationCode(loginPhoneForm.phone, 'login')
      if (res.code === 200) {
        ElMessage.success('验证码已发送')
        startLoginCountdown()
      } else {
        ElMessage.error(res.message || '发送验证码失败')
      }
    } else {
      if (!loginEmailForm.email) {
        ElMessage.warning('请先输入邮箱')
        return
      }
      const res = await sendEmailVerificationCode(loginEmailForm.email, 'login')
      if (res.code === 200) {
        ElMessage.success('验证码已发送')
        startLoginCountdown()
      } else {
        ElMessage.error(res.message || '发送验证码失败')
      }
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '发送验证码失败')
  }
}

// 发送注册验证码（本质上也是登录验证码，后端会自动完成首次注册）
const sendRegisterCode = async (type: 'phone' | 'email') => {
  try {
    if (type === 'phone') {
      if (!registerPhoneForm.phone) {
        ElMessage.warning('请先输入手机号')
        return
      }
      const res = await sendPhoneVerificationCode(registerPhoneForm.phone, 'login')
      if (res.code === 200) {
        ElMessage.success('验证码已发送')
        startRegisterCountdown()
      } else {
        ElMessage.error(res.message || '发送验证码失败')
      }
    } else {
      if (!registerEmailForm.email) {
        ElMessage.warning('请先输入邮箱')
        return
      }
      const res = await sendEmailVerificationCode(registerEmailForm.email, 'login')
      if (res.code === 200) {
        ElMessage.success('验证码已发送')
        startRegisterCountdown()
      } else {
        ElMessage.error(res.message || '发送验证码失败')
      }
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '发送验证码失败')
  }
}

// 登录（验证码）
const handleLoginByCode = async () => {
  loginLoading.value = true
  try {
    if (loginMethod.value === 'phone') {
      if (!loginPhoneFormRef.value) return
      await loginPhoneFormRef.value.validate(async (valid) => {
        if (!valid) {
          ElMessage.error('请完整填写手机号和验证码')
          return
        }
        const res = await loginByPhoneCode(loginPhoneForm.phone, loginPhoneForm.code)
        if (res.code === 200) {
          setLoginState(res.data.token, res.data.userInfo)
          ElMessage.success({ message: '登录成功！', duration: 1500 })
          setTimeout(() => {
            dialogVisible.value = false
            emit('login-success')
          }, 300)
        }
      })
    } else {
      if (!loginEmailFormRef.value) return
      await loginEmailFormRef.value.validate(async (valid) => {
        if (!valid) {
          ElMessage.error('请完整填写邮箱和验证码')
          return
        }
        const res = await loginByEmailCode(loginEmailForm.email, loginEmailForm.code)
        if (res.code === 200) {
          setLoginState(res.data.token, res.data.userInfo)
          ElMessage.success({ message: '登录成功！', duration: 1500 })
          setTimeout(() => {
            dialogVisible.value = false
            emit('login-success')
          }, 300)
        }
      })
    }
  } catch (error: any) {
    console.error('登录失败:', error)
  } finally {
    loginLoading.value = false
  }
}

// 登录（账号密码）
const handleLoginByPassword = async () => {
  loginLoading.value = true
  try {
    if (!loginPasswordFormRef.value) return
    await loginPasswordFormRef.value.validate(async (valid) => {
      if (!valid) {
        ElMessage.error('请完整填写用户名和密码')
        return
      }
      const res = await loginApi({
        username: loginPasswordForm.username,
        password: loginPasswordForm.password
      })
      if (res.code === 200) {
        setLoginState(res.data.token, res.data.user || res.data.userInfo)
        ElMessage.success({ message: '登录成功！', duration: 1500 })
        setTimeout(() => {
          dialogVisible.value = false
          emit('login-success')
        }, 300)
      }
    })
  } catch (error: any) {
    console.error('登录失败:', error)
  } finally {
    loginLoading.value = false
  }
}

// 跳转到重置密码页面
const goToResetPassword = () => {
  dialogVisible.value = false
  router.push('/reset-password')
}

// 注册（验证码，首次登录自动注册）
const handleRegisterByCode = async () => {
  registerLoading.value = true
  try {
    if (registerMethod.value === 'phone') {
      if (!registerPhoneFormRef.value) return
      await registerPhoneFormRef.value.validate(async (valid) => {
        if (!valid) {
          ElMessage.error('请完整填写手机号和验证码，并勾选同意协议')
          return
        }
        const res = await loginByPhoneCode(registerPhoneForm.phone, registerPhoneForm.code)
        if (res.code === 200) {
          setLoginState(res.data.token, res.data.userInfo)
          ElMessage.success({ message: '注册并登录成功！', duration: 1800 })
          emit('register-success')
          setTimeout(() => {
            dialogVisible.value = false
          }, 300)
        } else {
          ElMessage.error(res.message || '注册失败')
        }
      })
    } else {
      if (!registerEmailFormRef.value) return
      await registerEmailFormRef.value.validate(async (valid) => {
        if (!valid) {
          ElMessage.error('请完整填写邮箱和验证码，并勾选同意协议')
          return
        }
        const res = await loginByEmailCode(registerEmailForm.email, registerEmailForm.code)
        if (res.code === 200) {
          setLoginState(res.data.token, res.data.userInfo)
          ElMessage.success({ message: '注册并登录成功！', duration: 1800 })
          emit('register-success')
          setTimeout(() => {
            dialogVisible.value = false
          }, 300)
        } else {
          ElMessage.error(res.message || '注册失败')
        }
      })
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '注册失败，请稍后重试')
  } finally {
    registerLoading.value = false
  }
}

// 切换到注册
const resetLoginForms = () => {
  loginPhoneForm.phone = ''
  loginPhoneForm.code = ''
  loginEmailForm.email = ''
  loginEmailForm.code = ''
  loginPasswordForm.username = ''
  loginPasswordForm.password = ''
  loginCountdown.value = 0
  if (loginTimer) {
    clearInterval(loginTimer)
    loginTimer = null
  }
}

const resetRegisterForms = () => {
  registerPhoneForm.phone = ''
  registerPhoneForm.code = ''
  registerPhoneForm.agree = false
  registerEmailForm.email = ''
  registerEmailForm.code = ''
  registerEmailForm.agree = false
  registerCountdown.value = 0
  if (registerTimer) {
    clearInterval(registerTimer)
    registerTimer = null
  }
}

const switchToRegister = () => {
  activeTab.value = 'register'
  registerMethod.value = 'phone'
  resetLoginForms()
}

// 切换到登录
const switchToLogin = () => {
  activeTab.value = 'login'
  loginMethod.value = 'phone'
  resetRegisterForms()
}

// 监听对话框关闭，重置表单
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    resetLoginForms()
    resetRegisterForms()
    activeTab.value = props.defaultTab || 'login'
    loginMethod.value = 'phone'
    registerMethod.value = 'phone'
  }
})

watch(registerMethod, () => {
  registerPhoneForm.agree = false
  registerEmailForm.agree = false
})
</script>

<style scoped>
/* 背景模糊与遮罩 */
:deep(.el-overlay) {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.25);
  animation: overlayFadeIn 0.3s ease-out;
}

@keyframes overlayFadeIn {
  from {
    backdrop-filter: blur(0px);
    background-color: rgba(0, 0, 0, 0);
  }

  to {
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.25);
  }
}

/* 对话框主体：仅做轻量美化，交给 Element Plus 负责居中 */
:deep(.auth-dialog.el-dialog) {
  max-width: 480px;
  width: 100%;
  border-radius: 32px;
  background: #ffffff;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

:deep(.auth-dialog .el-dialog__header) {
  display: none;
}

:deep(.auth-dialog .el-dialog__body) {
  padding: 35px 45px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 32px;
}

/* 内容容器 */
.auth-dialog-content {
  padding: 0;
}

/* 头部 */
.dialog-header {
  text-align: center;
  margin-bottom: 32px;
  animation: headerFadeIn 0.5s ease-out 0.1s both;
}

@keyframes headerFadeIn {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 50%, #f97316 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
}

.dialog-subtitle {
  font-size: 14px;
  color: #7c8fa3;
  margin: 0;
  font-weight: 500;
}

.dialog-subtitle :deep(.el-link) {
  transition: all 0.3s ease;
}

.dialog-subtitle :deep(.el-link:hover) {
  color: #ff8c42 !important;
  text-decoration: underline;
}

/* 表单容器 */
.form-container {
  animation: fadeIn 0.4s ease-in-out 0.15s both;
  width: 100%;
  display: flex;
  justify-content: center;
}

.form-inner {
  width: 320px;
  max-width: 100%;
  flex: 0 0 auto;
}

:deep(.method-tabs) {
  width: 100%;
  background: #f5f7fb;
  border-radius: 18px;
  padding: 10px 10px 16px;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6), 0 6px 18px rgba(99, 112, 144, 0.08);
}

:deep(.method-tabs .el-tabs__item) {
  padding: 0 10px !important;
}

:deep(.method-tabs .el-tabs__content) {
  width: 100%;
}

:deep(.el-form) {
  width: 100%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表单标签 */
.form-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
  font-size: 14px;
  color: #4b5563;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.forgot-link {
  font-size: 13px;
  transition: all 0.3s ease;
}

.forgot-link:hover {
  color: #ff8c42 !important;
  text-decoration: underline;
}

/* Tab 样式 */
:deep(.el-tabs) {
  --el-tabs-header-height: 44px;
  width: 100%;
}

:deep(.el-tabs__header) {
  margin-bottom: 8px;
  border-bottom: none;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px;
  transition: all 0.3s ease;
  width: 100%;
  overflow: hidden;
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
  gap: 0;
}

:deep(.el-tabs__nav-wrap) {
  overflow: visible !important;
}

:deep(.el-tabs__content) {
  padding-top: 12px;
}

:deep(.el-tab-pane) {
  padding-top: 8px;
}

:deep(.el-tabs__item) {
  flex: 1;
  height: 40px;
  line-height: 40px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  color: #7c8fa3;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin: 0;
  border: none;
  padding: 0 8px;
  white-space: nowrap;
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

/* 输入框样式 */
:deep(.el-input) {
  max-width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 10px 14px;
  background: #ffffff;
  border: 2px solid #e8eaef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  height: 40px;
  width: 100%;
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

:deep(.el-input__inner) {
  font-size: 14px;
  color: #2c3e50;
  line-height: 20px;
}

:deep(.el-input__inner::placeholder) {
  color: #a8b2c1;
  font-weight: 500;
}

/* 代码输入框包装器 */
.code-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
}

.code-input-wrapper :deep(.el-input) {
  flex: 1;
  min-width: 0;
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

.code-input-wrapper :deep(.el-button:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 700;
  border-radius: 10px;
  margin-top: 15px;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 50%, #f97316 100%);
  border: none;
  color: #ffffff;
  box-shadow: 0 12px 32px rgba(255, 140, 66, 0.35);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff7a1f 0%, #ff5a1f 50%, #f97316 100%);
  box-shadow: 0 16px 40px rgba(255, 120, 54, 0.4);
  transform: translateY(-2px);
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 8px 24px rgba(255, 120, 54, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 复选框样式 */
:deep(.el-checkbox) {
  font-size: 14px;
  --el-checkbox-input-border-color: #e8eaef;
  --el-checkbox-input-border-color-hover: #ff8c42;
  --el-checkbox-checked-bg-color: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  --el-checkbox-checked-input-border-color: #ff8c42;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  border-color: #ff8c42;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
}

:deep(.el-checkbox__inner) {
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.el-checkbox__inner:hover) {
  border-color: #ff8c42;
}

:deep(.el-checkbox__label) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  white-space: normal;
  line-height: 1.4;
  color: #4b5563;
}

.auth-dialog-content :deep(.el-checkbox .el-link) {
  color: #ff8c42 !important;
}

.agreement-item :deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  overflow: visible;
}

.agreement-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  font-size: 13px;
  color: #4b5563;
}

.agreement-item :deep(.el-checkbox__input.is-checked + .el-checkbox__label .agreement-text) {
  color: #ff6b35;
  text-shadow: 0 0 6px rgba(255, 107, 53, 0.3);
}

.auth-dialog-content ::selection {
  background: rgba(255, 140, 66, 0.18);
  color: #d65b16;
}

/* 表单项 */
:deep(.el-form-item) {
  margin-bottom: 30px !important;
  width: 100%;
}

:deep(.el-form-item__content) {
  width: 100%;
}

:deep(.el-form-item__error) {
  font-size: 13px !important;
  color: #f56c6c !important;
  margin-top: 4px !important;
  margin-bottom: 8px !important;
  animation: errorShake 0.3s ease;
  display: block !important;
  line-height: 1.4 !important;
  padding: 0 !important;
}

:deep(.el-form-item.is-error) {
  margin-bottom: 30px !important;
}

@keyframes errorShake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  75% {
    transform: translateX(4px);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 85% !important;
    max-width: 400px !important;
    border-radius: 20px !important;
  }

  :deep(.el-dialog__body) {
    padding: 30px 25px;
  }

  .dialog-title {
    font-size: 22px;
  }

  .submit-btn {
    height: 44px;
    font-size: 15px;
  }

  .code-input-wrapper :deep(.el-button) {
    min-width: 90px;
    height: 40px;
    font-size: 12px;
  }
}
</style>
