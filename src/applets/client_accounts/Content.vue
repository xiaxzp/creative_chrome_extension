<template>
  <div id="client-account" class="relative">
    <div class="flex items-center text-gray-500 absolute -top-30px right-3px">
      <Tooltip content="Log out" placement="top">
        <div
          class="cursor-pointer hover:text-gray-900"
          @click.stop="logoutCurrentAccount"
        >
          <ic:outline-logout />
        </div>
      </Tooltip>
    </div>

    <div class="mb-3px">
      <SearchInput
        v-model="search"
        placeholder="根据用户名、邮箱、国家、白名单功能搜索"
      />
    </div>

    <div
      class="account-container -mx-13px p-13px"
      max-h="500px"
      overflow="y-auto"
      overscroll="contain"
      :data-edit-mode="underEditMode"
      :style="{
        '--padding-bottom': `${dynamicPaddingBottom}px`,
      } as any"
    >
      <AccountCard
        v-for="(item, index) in accountListFiltered"
        :key="item.uid"
        :item="item"
        @emit-event="(...params) => emit('emit-event', ...params)"
        @toggle-edit="val => onToggleEditMode(val, index)"
      />
    </div>
    <ItsEmpty
      v-if="accountListFiltered.length === 0"
      content="🪵 The wood said no matching accounts yet"
    />
  </div>
</template>

<script setup lang='ts'>
import { uniq } from 'lodash-es';
import type { Context } from './config';
import clientAccountAppletConf, { CLIENT_ACCOUNTS_APPLET_KEY } from './config';
import { getCurrentAccountId } from './utils';
import AccountCard from './AccountCard/index.vue';
import { accountStore } from './shared';
import { EventKey } from './typings';
import { useAppletEnabled } from '~/hooks/appletEnablings';

const props = defineProps<{
  context: Context
}>();

const emit = defineEmits(['set-context', 'emit-event']);

const [, toggleAppletEnable] = useAppletEnabled(clientAccountAppletConf);

const underEditMode = ref(false);
const dynamicPaddingBottom = ref<number>();

const search = ref('');

// 计算出所有账户可选的 tags
watch(
  () => props.context?.accountList ?? [],
  (val) => {
    accountStore.availableTags = uniq(
      val
        .map(acc => acc.tags ?? [])
        .flat()
        .filter(Boolean),
    );
  },
);

const accountListFiltered = computed(() => {
  const list = props.context?.accountList ?? [];
  console.log('this list', list);

  // move current logined account to first
  const currentUID = getCurrentAccountId();
  const idx = list.findIndex(item => item.uid === currentUID);
  if (idx > 0) {
    list.splice(0, 0, ...list.splice(idx, 1));
  }

  if (!search.value) {
    return list;
  }

  const searchValue = search.value.toLowerCase();
  return list.filter(
    item =>
      item.account.toLowerCase().includes(searchValue)
      || item.name?.toLowerCase().includes(searchValue)
      || item.uid?.toLowerCase().includes(searchValue)
      || item.tags?.some(tag => tag.toLowerCase().includes(searchValue))
      || item.country.toLowerCase().includes(searchValue),
  );
});

function onToggleEditMode(val: boolean, index: number) {
  underEditMode.value = val;
  if (val) {
    const count = accountListFiltered.value.length;
    if (count - index <= 4 && count - index >= 3) {
      dynamicPaddingBottom.value = 150;
    }
    else if (count - index <= 2) {
      dynamicPaddingBottom.value = 290;
    }
    else {
      dynamicPaddingBottom.value = 13;
    }
  }
}

function logoutCurrentAccount() {
  const currentUID = getCurrentAccountId();

  emit('emit-event', EventKey.logout, currentUID);

  // 登出后隐藏账号列表
  toggleAppletEnable(CLIENT_ACCOUNTS_APPLET_KEY);

  location.reload();
}
</script>

<style lang="scss">
.env-tag {
  transform: scale(0.7);
  transform-origin: left;
  padding: 2px 6px;
  font-size: 12px;
}

.account-container {
  display: grid;
  overscroll-behavior: contain;
  grid-template-columns: 320px 320px;
  gap: 15px 10px;
  transition: 0.4s ease-out;

  &[data-edit-mode='true'] {
    padding-bottom: var(--padding-bottom);

    .account-card[data-is-editing='false'] {
      opacity: 0.7;
      pointer-events: none;
      filter: grayscale(100);
    }
  }
}
</style>
