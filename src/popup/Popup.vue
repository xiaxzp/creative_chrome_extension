<template>
  <main class="w-250px px-4 py-4 text-blue-600 underline-current">
    <el-container>
      <el-header class="flex justify-between items-center" height="24px">
        Devtool
        <el-icon class="cursor-pointer" :size="16" @click="openOptionsPage">
          <Setting />
        </el-icon>
      </el-header>
      <el-main>
        <h2>Quick Links</h2>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="Github" name="Github">
            <div>
              <el-link
                href="https://github.com/xiaxzp/creative_chrome_extension"
                type="danger"
                target="_blank"
                rel="noopener"
              >
                Github Link
              </el-link>
            </div>
          </el-collapse-item>
          <el-collapse-item title="Other" name="other">
          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Setting } from '@element-plus/icons-vue';

const activeName = ref('');

function openOptionsPage() {
  browser.runtime.openOptionsPage();
}
</script>

<style lang="scss">
.extension-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e5e7eb;

  &:last-child {
    border-bottom: 1px dashed #e5e7eb;
  }
}
.el-link {
  margin-right: 8px;
}
h2 {
  font-size: 18px;
  line-height: 24px;
}
</style>
