<template>
  <el-dialog 
    v-model="dialogVisible" 
    :title="null"
    width="480" 
    :close-on-click-modal="false"
    align-center 
    destroy-on-close
    class="auth-dialog"
  >
    <div class="auth-dialog-content">
      <!-- 头部 -->
      <div class="dialog-header">
        <h2 class="dialog-title">宠物领养系统</h2>
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
          <!-- 登录表单 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
            <div class="form-label">账号</div>
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
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
                v-model="loginForm.password" 
                type="password" 
                placeholder="请输入密码" 
                show-password 
                @keyup.enter="handleLogin" 
              />
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="rememberMe">自动登录</el-checkbox>
            </el-form-item>

            <el-button 
              type="primary" 
              :loading="loginLoading" 
              class="submit-btn" 
              @click="handleLogin"
            >
              登入
            </el-button>
          </el-form>

          <el-divider class="divider-text">OR</el-divider>

          <div class="social-login">
            <el-button class="social-btn wechat-btn">
              <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
                <path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z" fill="#00C800"/>
              </svg>
              微信登录
            </el-button>
            <el-button class="social-btn qq-btn">
              <svg class="icon" viewBox="0 0 1024 1024" width="18" height="18">
                <path d="M511.09 63.25c-174.84 0-316.59 123.88-316.59 276.75 0 56.99 18.97 109.9 51.58 154.75-23.45 71.59-62.89 122.38-62.89 122.38s84.4-9.39 141.12-49.68c33.19 12.3 69.42 19.03 107.18 19.03 174.84 0 316.59-123.88 316.59-276.75S685.93 63.25 511.09 63.25z" fill="#4EABE6"/>
                <path d="M826.49 600.43c25.6-35.84 40.96-78.34 40.96-123.9 0-45.57-15.36-88.06-40.96-123.9 0 0 0 0 0 0 0 0 0 0 0 0-25.6-35.84-63.49-66.56-107.52-89.09 0 0 0 0 0 0 0 0 0 0 0 0-44.03-22.53-92.16-35.84-143.36-35.84-51.2 0-99.33 13.31-143.36 35.84 0 0 0 0 0 0 0 0 0 0 0 0-44.03 22.53-81.92 53.25-107.52 89.09 0 0 0 0 0 0 0 0 0 0 0 0-25.6 35.84-40.96 78.34-40.96 123.9 0 45.57 15.36 88.06 40.96 123.9 0 0 0 0 0 0 0 0 0 0 0 0 25.6 35.84 63.49 66.56 107.52 89.09 0 0 0 0 0 0 0 0 0 0 0 0 44.03 22.53 92.16 35.84 143.36 35.84 51.2 0 99.33-13.31 143.36-35.84 0 0 0 0 0 0 0 0 0 0 0 0 44.03-22.53 81.92-53.25 107.52-89.09 0 0 0 0 0 0z" fill="#12B7F5"/>
              </svg>
              QQ登录
            </el-button>
          </div>
        </div>

      <div v-else class="form-container">
          <!-- 注册表单 -->
          <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
            <div class="form-label">用户名</div>
            <el-form-item prop="username">
              <el-input 
                v-model="registerForm.username" 
                placeholder="请输入用户名" 
                clearable 
              />
            </el-form-item>

            <div class="form-label">邮箱</div>
            <el-form-item prop="email">
              <el-input 
                v-model="registerForm.email" 
                type="email" 
                placeholder="请输入邮箱地址" 
                clearable 
              />
            </el-form-item>

            <div class="form-label">设置密码</div>
            <el-form-item prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password" 
                placeholder="请设置密码（至少6个字符）" 
                show-password 
              />
            </el-form-item>

            <div class="form-label">确认密码</div>
            <el-form-item prop="confirmPassword">
              <el-input 
                v-model="registerForm.confirmPassword" 
                type="password" 
                placeholder="请再次输入密码" 
                show-password 
                @keyup.enter="handleRegister" 
              />
            </el-form-item>

            <el-form-item prop="agreeTerms">
              <el-checkbox v-model="agreeTerms">
                我已阅读并同意
                <el-link type="primary" :underline="false">《用户协议》</el-link>
                和
                <el-link type="primary" :underline="false">《隐私政策》</el-link>
              </el-checkbox>
            </el-form-item>

            <el-button 
              type="primary" 
              :loading="registerLoading" 
              class="submit-btn" 
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form>
        </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { User, Lock, Unlock, Message, CirclePlus, ChatLineRound, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({
  name: 'AuthDialog'
})

const props = defineProps<{
  modelValue: boolean
  defaultTab?: 'login' | 'register'
}>()

const emit = defineEmits(['update:modelValue', 'loginSuccess', 'registerSuccess'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const activeTab = ref<'login' | 'register'>(props.defaultTab || 'login')
const isLogin = computed(() => activeTab.value === 'login')

// 登录表单
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
    { min: 3, message: '用户名长度至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ]
})

const rememberMe = ref(false)
const loginLoading = ref(false)

// 注册表单
const registerFormRef = ref<FormInstance>()
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateAgreeTerms = (rule: any, value: any, callback: any) => {
  if (!agreeTerms.value) {
    callback(new Error('请同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

const registerRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  agreeTerms: [
    { validator: validateAgreeTerms, trigger: 'change' }
  ]
})

const agreeTerms = ref(false)
const registerLoading = ref(false)

// 切换到注册
const switchToRegister = () => {
  activeTab.value = 'register'
  loginFormRef.value?.resetFields()
}

// 切换到登录
const switchToLogin = () => {
  activeTab.value = 'login'
  registerFormRef.value?.resetFields()
  agreeTerms.value = false
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loginLoading.value = true

      setTimeout(() => {
        localStorage.setItem('user-token', 'mock-token-12345')

        ElMessage.success({
          message: '登录成功！',
          duration: 2000
        })

        loginLoading.value = false
        dialogVisible.value = false
        emit('loginSuccess')

        // 刷新页面以更新导航栏状态
        window.location.reload()
      }, 1000)
    } else {
      ElMessage.error('请填写完整的登录信息')
    }
  })
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate((valid) => {
    if (valid) {
      registerLoading.value = true

      setTimeout(() => {
        ElMessage.success({
          message: '注册成功！请登录您的账户。',
          duration: 2000
        })

        registerLoading.value = false
        emit('registerSuccess')

        // 切换到登录标签
        activeTab.value = 'login'
        // 清空注册表单
        registerFormRef.value?.resetFields()
        agreeTerms.value = false
      }, 1000)
    } else {
      ElMessage.error('请填写完整的注册信息')
    }
  })
}

// 监听对话框关闭，重置表单
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    loginFormRef.value?.resetFields()
    registerFormRef.value?.resetFields()
    agreeTerms.value = false
    activeTab.value = props.defaultTab || 'login'
  }
})
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__header) {
  display: none;
}

:deep(.el-dialog__body) {
  padding: 35px 40px;
}

.auth-dialog-content {
  padding: 0;
}

.dialog-header {
  text-align: center;
  margin-bottom: 30px;
}

.dialog-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
}

.dialog-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.form-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 10px;
  background: #409eff;
  border-color: #409eff;
}

.submit-btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.divider-text {
  margin: 20px 0;
  color: #c0c4cc;
  font-size: 13px;
}

.social-login {
  display: flex;
  gap: 12px;
  margin-top: 15px;
}

.social-btn {
  flex: 1;
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
  display: inline-flex;
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
  line-height: 1.5;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
  }

  :deep(.el-dialog__body) {
    padding: 25px 20px;
  }

  .social-login {
    flex-direction: column;
  }
}
</style>
