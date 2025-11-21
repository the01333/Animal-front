<template>
  <div class="about">
    <h1>关于我们</h1>
    <p>i宠园致力于为流浪动物寻找温暖的家，连接爱心领养者与需要关爱的小动物。</p>

    <div class="about-section">
      <h2>我们的使命</h2>
      <p>通过技术手段搭建领养平台，让每一只宠物都能找到属于自己的幸福家庭，减少流浪动物数量，促进人与动物和谐共处。</p>
    </div>

    <div class="about-section">
      <h2>我们的愿景</h2>
      <p>建设全国领先的宠物领养平台，推动宠物领养文化的普及，提高社会对流浪动物的关注度和保护意识。</p>
    </div>

    <div class="about-section">
      <h2>联系方式</h2>
      <p>邮箱: adopt@petlove.com</p>
      <p>电话: 400-123-4567</p>
      <p>地址: 北京市朝阳区某某街道123号</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 关于我们页面不需要额外的逻辑
</script>

<style scoped>
.about {
  padding: 1rem 0;
  max-width: 800px;
  margin: 0 auto;
}

.about h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.about p {
  line-height: 1.6;
  color: #666;
  margin-bottom: 1rem;
}

.about-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.about-section h2 {
  margin-top: 0;
  color: #333;
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }
}
</style>