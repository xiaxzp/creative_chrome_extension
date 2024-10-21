<template>
  <div m="-x-10px" p="x-10px b-15px" bg="white" class="account-form">
    <el-form
      ref="formRef"
      label-position="top"
      label-width="100px"
      :model="formData"
      size="small"
      :rules="rules"
    >
      <el-form-item label="Account" prop="account" required>
        <el-input
          v-model="formData.account"
          placeholder="Account"
          required
          class="form-item-input"
        />
      </el-form-item>
      <el-form-item label="Password" prop="password" required>
        <el-input
          v-model="formData.password"
          required
          placeholder="Password"
          class="form-item-input"
        />
      </el-form-item>
      <el-form-item label="Tags" prop="tags">
        <el-select
          v-model="formData.tags"
          class="form-item-input"
          popper-class="tags-select"
          placeholder="Tags"
          :popper-append-to-body="false"
          multiple
          filterable
          allow-create
          default-first-option
          no-data-text="回车创建 Tag"
          :reserve-keyword="false"
        >
          <el-option
            v-for="item in accountStore.availableTags || []"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Comment" prop="comment">
        <el-input
          v-model="formData.comment"
          placeholder="Comment"
          type="textarea"
          class="form-item-input"
          :rows="3"
        />
      </el-form-item>

      <el-form-item class="flex justify-end">
        <el-button
          ref="cancelButton"
          class="form-item-btn"
          size="small"
          @click="emit('cancel')"
        >
          Cancel
        </el-button>
        <el-button
          class="form-item-btn"
          type="primary"
          size="small"
          @click="submitForm(formRef)"
        >
          Save
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import type { AccountInfo } from '../typings';
import { accountStore } from '../shared';

const props = defineProps<{
  accountInfo: AccountInfo
}>();

const emit = defineEmits(['cancel', 'submit']);

const cancelButton = ref(null);
const formRef = ref<FormInstance>();
const rules: FormRules = {
  account: [{ required: true }],
  password: [{ required: true }],
};

defineExpose({
  cancelButton,
});

const formData = reactive({
  account: props.accountInfo.account,
  password: props.accountInfo.password,
  tags: props.accountInfo.tags,
  comment: props.accountInfo.comment,
});

async function submitForm(formInstance?: FormInstance) {
  if (!formInstance) {
    return;
  }
  await formInstance.validate((valid) => {
    if (valid) {
      emit('submit', {
        ...props.accountInfo,
        ...formData,
      });
      emit('cancel');
    }
    else {
      ElMessage.warning('请检查必填字段');
    }
  });
}
</script>

<style lang="scss">
.account-form {
  @apply sticky bottom-10px top-100px;
  border-radius: 8px;
  box-shadow: 0 5px 13px -7px rgb(0 0 0 / 35%);
  overflow: hidden;

  .el-form-item__label {
    width: fit-content;
  }
}

.form-item {
  margin-bottom: 16px;

  &-title {
    margin-bottom: 8px;
    font-size: 13px;
  }

  &-input {
    background: rgba(99, 99, 99, 0.2);
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.5);
    width: 100%;
    font-size: 12px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .el-select .el-select__tags .el-tag {
    background: rgba(31, 41, 55);
    color: white;
  }
  .el-select__tags {
    z-index: 1;
  }
}
</style>
