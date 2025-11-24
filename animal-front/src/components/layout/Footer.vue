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
                <span>邮箱: linyyccc@gmail.com</span>
              </div>
              <div class="contact-item">
                <el-icon>
                  <Iphone />
                </el-icon>
                <span>电话: 1306318xxxx</span>
              </div>
              <div class="contact-item">
                <el-icon>
                  <Location />
                </el-icon>
                <span>地址: 福建省漳州市东山县宠物街1号</span>
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
                动物保护协会
              </el-link>
              <el-link href="#" :underline="false" class="footer-link">
                <el-icon><first-aid-kit /></el-icon>
                宠物医院联盟
              </el-link>
              <el-link href="#" :underline="false" class="footer-link">
                <el-icon>
                  <UserFilled />
                </el-icon>
                志愿者组织
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
        <el-link type="info" :underline="false">隐私政策</el-link>
        <el-divider direction="vertical" />
        <el-link type="info" :underline="false">使用条款</el-link>
        <el-divider direction="vertical" />
        <el-link type="info" :underline="false">网站地图</el-link>
      </el-space>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 页脚组件不需要额外的逻辑
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
</style>
