<template>
  <footer class="footer">
    <div class="footer-container">
      <el-row :gutter="40">
        <el-col :xs="24" :sm="8">
          <div class="footer-section">
            <h3>
              <el-icon>
                <InfoFilled />
              </el-icon>
              关于我们
            </h3>
            <p>i宠园致力于为流浪动物寻找温暖的家，连接爱心领养者与需要关爱的小动物。</p>
            <el-space wrap>
              <el-tag type="success" effect="plain">爱心领养</el-tag>
              <el-tag type="warning" effect="plain">责任饲养</el-tag>
              <el-tag type="info" effect="plain">终身陪伴</el-tag>
            </el-space>
          </div>
        </el-col>

        <el-col :xs="24" :sm="8">
          <div class="footer-section">
            <h3>
              <el-icon>
                <Phone />
              </el-icon>
              联系我们
            </h3>
            <el-space direction="vertical" :size="8">
              <div class="contact-item">
                <el-icon>
                  <Message />
                </el-icon>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=linyyccc@gmail.com" target="_blank"
                  rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
                  linyyccc@gmail.com
                </a>
              </div>
              <div class="contact-item">
                <el-icon>
                  <Iphone />
                </el-icon>
                <a href="tel:130xxxxxxxx" style="text-decoration: none; color: inherit;">
                  电话：130xxxxxxxx
                </a>
              </div>
              <div class="contact-item">
                <el-icon>
                  <Location />
                </el-icon>
                <a href="https://uri.amap.com/search?keyword=福建省漳州市" target="_blank"
                  style="text-decoration: none; color: inherit;">
                  地址：福建省漳州市
                </a>
              </div>
            </el-space>
          </div>
        </el-col>

        <el-col :xs="24" :sm="8">
          <div class="footer-section">
            <h3>
              <el-icon>
                <Link />
              </el-icon>
              友情链接
            </h3>
            <el-space direction="vertical" :size="8">
              <el-link href="#" :underline="false" class="footer-link">
                <el-icon>
                  <Star />
                </el-icon>
                <a href="https://www.worldanimalprotection.org.cn/" target="_blank" rel="noopener noreferrer"
                  style="text-decoration: none; color: inherit;">
                  动物保护协会
                </a>
              </el-link>
              <el-link href="#" :underline="false" class="footer-link">
                <el-icon><first-aid-kit /></el-icon>
                <a href="https://www.ruichen.com/index.html" target="_blank" rel="noopener noreferrer"
                  style="text-decoration: none; color: inherit;">
                  宠物医院联盟
                </a>
              </el-link>
              <el-link href="#" :underline="false" class="footer-link">
                <el-icon>
                  <UserFilled />
                </el-icon>
                <a href="https://www.undp.org/zh/china/lianheguozhiyuanrenyuanzuzhi" target="_blank"
                  rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
                  志愿者组织
                </a>
              </el-link>
            </el-space>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-divider />

    <div class="footer-bottom">
      <el-text type="info">
        <el-icon>
          <CopyDocument />
        </el-icon>
        &copy; 2025 i宠园. 保留所有权利.
      </el-text>
      <el-space>
        <el-link type="info" :underline="false" @click="openPolicy('privacy')">隐私政策</el-link>
        <el-divider direction="vertical" />
        <el-link type="info" :underline="false" @click="openPolicy('terms')">使用条款</el-link>
        <el-divider direction="vertical" />
        <el-link type="info" :underline="false">
          <a href="https://uri.amap.com/search" target="_blank" style="text-decoration: none; color: inherit;">
            网站地图
          </a>
        </el-link>
      </el-space>
    </div>

    <transition name="policy-fade">
      <div v-if="policyVisible" class="policy-dialog-overlay" @click.self="policyVisible = false">
        <div class="policy-dialog-card">
          <div class="policy-dialog-inner">
            <div class="policy-dialog-header">
              <div class="policy-dialog-badge">小宠提示</div>
              <h3 class="policy-dialog-title">{{ dialogTitle }}</h3>
              <button type="button" class="policy-dialog-close" @click="policyVisible = false">×</button>
            </div>
            <div class="policy-dialog-body">
              <div class="policy-scroll">
                <template v-if="policyType === 'terms'">
                  <p class="policy-intro">
                    欢迎访问 i宠园（以下简称“本网站”）。在使用本网站前，请您仔细阅读以下使用条款。
                    一旦访问或使用本网站，即表示您已同意并接受本条款的全部内容。
                  </p>
                  <h4 class="policy-section-title">一、定义说明</h4>
                  <p>“用户 / 您”：指访问或使用本网站的个人或组织。</p>
                  <p>“本网站 / 我们”：指 i宠园及其运营方。</p>
                  <p>“服务”：指本网站提供的动物信息展示、领养相关服务及其他功能。</p>
                  <h4 class="policy-section-title">二、使用规则</h4>
                  <p>用户在使用本网站时，不得从事以下行为：</p>
                  <ul class="policy-list">
                    <li>发布任何违法、侵权、虚假、淫秽、攻击性内容；</li>
                    <li>侵犯他人的合法权益（包括但不限于肖像权、隐私权、知识产权）；</li>
                    <li>利用本网站从事商业推广、欺诈或非法活动；</li>
                    <li>以任何形式破坏网站正常运行。</li>
                  </ul>
                  <p>我们有权在不事先通知的情况下，删除违规内容或限制用户访问权限。</p>
                  <h4 class="policy-section-title">三、内容声明</h4>
                  <ul class="policy-list">
                    <li>网站中的动物信息、图片、文字内容主要用于公益展示；</li>
                    <li>我们不保证所有信息的完整性、实时性或绝对准确性；</li>
                    <li>用户应自行判断并承担因使用信息而产生的风险。</li>
                  </ul>
                  <h4 class="policy-section-title">四、知识产权</h4>
                  <p>
                    除非另有说明，本网站内的所有内容（包括文字、图片、标识、页面设计等）均归 i宠园 或相关权利人所有，
                    未经许可不得复制、传播或用于商业用途。
                  </p>
                  <h4 class="policy-section-title">五、第三方链接</h4>
                  <p>
                    本网站可能包含指向第三方网站的链接（如地图、邮箱、合作机构网站）。这些链接仅为方便用户提供，
                    我们不对第三方网站的内容或行为负责。
                  </p>
                  <h4 class="policy-section-title">六、免责声明</h4>
                  <ul class="policy-list">
                    <li>在法律允许的最大范围内，本网站不对因使用或无法使用本网站而产生的任何损失承担责任；</li>
                    <li>对不可抗力、系统故障、网络问题造成的服务中断不承担责任。</li>
                  </ul>
                  <h4 class="policy-section-title">七、条款变更</h4>
                  <p>
                    我们有权在必要时修改本使用条款，更新后的条款将在本页面公布并立即生效。
                  </p>
                  <h4 class="policy-section-title">八、联系我们</h4>
                  <p>如对本条款有任何疑问，请通过网站底部的联系方式与我们取得联系。</p>
                </template>
                <template v-else>
                  <p class="policy-intro">
                    i宠园非常重视您的隐私保护。本隐私政策说明我们如何收集、使用和保护您的个人信息。
                  </p>
                  <h4 class="policy-section-title">一、信息收集</h4>
                  <p>在您使用本网站时，我们可能会收集以下信息：</p>
                  <ul class="policy-list">
                    <li>基本访问信息（如浏览器类型、访问时间）；</li>
                    <li>您主动提供的信息（如邮箱、联系方式）。</li>
                  </ul>
                  <h4 class="policy-section-title">二、信息使用</h4>
                  <p>我们收集的信息仅用于：</p>
                  <ul class="policy-list">
                    <li>改善网站服务和用户体验；</li>
                    <li>与您进行必要的联系；</li>
                    <li>保障网站安全与正常运行。</li>
                  </ul>
                  <h4 class="policy-section-title">三、Cookies 使用</h4>
                  <p>
                    本网站可能使用 Cookies 以提升用户体验。您可以通过浏览器设置选择是否接受 Cookies。
                  </p>
                  <h4 class="policy-section-title">四、信息保护</h4>
                  <p>
                    我们采取合理的技术和管理措施保护您的个人信息，防止未经授权的访问、披露或滥用。
                  </p>
                  <h4 class="policy-section-title">五、第三方服务</h4>
                  <p>
                    本网站可能使用第三方服务（如地图、邮箱跳转）。第三方服务的隐私政策不受本政策约束，请您自行查阅。
                  </p>
                  <h4 class="policy-section-title">六、政策更新</h4>
                  <p>
                    我们可能会不定期更新本隐私政策，更新内容将在本页面公布。
                  </p>
                </template>
              </div>
            </div>
            <div class="policy-dialog-footer">
              <el-button type="primary" size="default" round @click="policyVisible = false">我已知晓</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </footer>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type PolicyType = 'privacy' | 'terms'

const policyVisible = ref(false)
const policyType = ref<PolicyType>('privacy')

const dialogTitle = computed(() => (policyType.value === 'privacy' ? '隐私政策' : '使用条款'))

const openPolicy = (type: PolicyType) => {
  policyType.value = type
  policyVisible.value = true
}

const handleGlobalPolicyDialog = (event: Event) => {
  const detail = (event as CustomEvent<{ type?: PolicyType }>).detail || {}
  const type = detail.type || 'privacy'
  openPolicy(type)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('openPolicyDialog', handleGlobalPolicyDialog as EventListener)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('openPolicyDialog', handleGlobalPolicyDialog as EventListener)
  }
})
</script>

<style scoped>
.footer {
  background: #4f9ae4;
  color: white;
  padding: 40px 20px 20px;
  margin-top: 40px;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-section {
  margin-bottom: 20px;
}

.footer-section h3 {
  margin-bottom: 20px;
  color: #ffd04b;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-section p {
  line-height: 1.8;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
}

.contact-item:hover {
  color: #ffd04b;
  transform: translateX(5px);
}

.footer-link {
  color: rgba(255, 255, 255, 0.9) !important;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
}

.footer-link:hover {
  color: #ffd04b !important;
  transform: translateX(5px);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

:deep(.el-divider) {
  border-color: rgba(237, 218, 218, 0.2);
}

:deep(.el-link.el-link--info) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-link.el-link--info:hover) {
  color: #ffd04b;
}

:deep(.el-text.el-text--info) {
  color: white !important;
}

@media (max-width: 768px) {
  .footer {
    padding: 30px 15px 15px;
  }

  .footer-bottom {
    font-size: 12px;
  }
}

.policy-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 16px;
}

.policy-dialog-card {
  width: 100%;
  max-width: 760px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 35%, #f6f3ff 70%, #a1c4fd 100%);
  padding: 2px;
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
}

.policy-dialog-inner {
  background: #ffffff;
  border-radius: 18px;
  padding: 22px 26px 18px;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.policy-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.policy-dialog-badge {
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(255, 154, 158, 0.12);
  color: #ff7c7c;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
}

.policy-dialog-title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-right: 70px;
}

.policy-dialog-close {
  border: none;
  background: transparent;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  transition: color 0.2s ease, transform 0.2s ease;
}

.policy-dialog-close:hover {
  color: #ff7c7c;
  transform: rotate(90deg);
}

.policy-dialog-body {
  flex: 1;
  margin-top: 4px;
}

.policy-scroll {
  max-height: 56vh;
  overflow-y: auto;
  padding-right: 6px;
  color: black;
}

.policy-intro {
  margin-bottom: 12px;
  color: #000000;
  line-height: 1.7;
}

.policy-section-title {
  margin: 14px 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: #444;
}

.policy-list {
  margin: 0 0 6px 18px;
  padding: 0;
  list-style: disc;
  color: #000000;
}

.policy-list li {
  margin-bottom: 4px;
  line-height: 1.7;
}

.policy-dialog-footer {
  margin-top: 10px;
  margin-right: 16px;
  display: flex;
  justify-content: flex-end;
}

.policy-fade-enter-active,
.policy-fade-leave-active {
  transition: opacity 0.2s ease;
}

.policy-fade-enter-from,
.policy-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .policy-dialog-inner {
    padding: 18px 16px 14px;
  }

  .policy-dialog-title {
    font-size: 18px;
  }

  .policy-scroll {
    max-height: 60vh;
  }
}
</style>
