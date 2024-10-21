<template>
  <section
    :data-is-current="isCurrent"
    :data-is-editing="editing"
    class="account-card"
  >
    <div
      :display="editing ? 'none' : 'block'"
      font="sans extrabold"
      text="9xl"
      pointer="none"
      opacity="5"
      class="absolute -bottom-15px -right-15px text-gray-100"
    >
      {{ item.country }}
    </div>

    <header class="relative flex items-center mb-6px">
      <Tooltip placement="top" :disabled="editing">
        <template #content>
          <template v-if="isCurrent">
            <ic:outline-logout />
            登出
          </template>
          <span v-else> 登录此账号 </span>
        </template>
        <div
          class="log-in-out flex items-center justify-center rounded-full"
          :class="[isCurrent ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300']"
          :text="isCurrent ? 'white' : 'gray-600'"
          w="24px"
          h="24px"
          m="r-10px"
          cursor="pointer"
          transition="colors"
          @click="() => (isCurrent ? logout() : login())"
        >
          <ri:user-line
            v-if="lackOfCriticalInfo"
            w="12px"
            h="12px"
          />
          <bx:bxs-user v-else w="12px" h="12px" />
        </div>
      </Tooltip>

      <div class="flex-1 min-w-0">
        <strong class="text-15px truncate">{{
          item.name || item.account
        }}</strong>
        <div
          text="10px gray-400"
          font="200"
          display="none hover:block"
          class="truncate"
        >
          {{ item.account || item.uid }}
        </div>
      </div>

      <div
        class="actions-area"
      >
        <Tooltip content="编辑账号">
          <ic:baseline-edit
            class="action-button"
            cursor="pointer"
            @click="onEditClick"
          />
        </Tooltip>
      </div>
    </header>

    <template v-if="!editing">
      <div
        v-if="props.item.tags?.length"
        class="hover:overflow-x-auto tag-list-box"
        p="l-1"
        m="t-2px"
      >
        <div class="flex scale-sm gap-6px">
          <div
            v-for="tagName in props.item.tags"
            :key="tagName"
            :title="tagName"
            class="bg-gray-800 rounded-3px px-5px py-2px text-white text-xs truncate opacity-90"
          >
            {{ tagName }}
          </div>
        </div>
      </div>
      <!-- 📝 Comment -->
      <div
        :title="item.comment"
        class="account-comment leading-tight mt-12px"
        text="12px gray-400 opacity-90 break-all"
        font="300"
      >
        {{ item.comment }}
      </div>
    </template>

    <small v-if="!editing" pos="absolute left-10px bottom-3px" text="gray-300">
      <span v-if="lackOfCriticalInfo" class="text-yellow-500">
        🟡 账号、密码信息待补全
      </span>
      <span v-else-if="item.uid"> ID: {{ item.uid }} </span>
    </small>
    <!-- 💾 表单 -->
    <Transition name="form-fade">
      <AccountCardForm
        v-if="editing"
        ref="form"
        :account-info="item"
        @cancel="editing = false"
        @submit="updateAccount"
      />
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { getCurrentAccountId } from '../utils';
import type { AccountInfo } from '../typings';
import { EventKey } from '../typings';
import AccountCardForm from './AccountCardForm.vue';
import { useAppletEnabled } from '~/hooks/appletEnablings';
import config, {
  CLIENT_ACCOUNTS_APPLET_KEY,
} from '~/applets/ext_demo/config';
import { useTracker } from '~/hooks/tracker';

const props = defineProps<{
  item: AccountInfo
}>();

const emit = defineEmits(['emit-event', 'toggle-edit']);

const { trackEvent } = useTracker();

const [, toggleAppletEnable] = useAppletEnabled(config);

const editing = ref(false);

watch(editing, (val) => {
  emit('toggle-edit', val);
});

const isCurrent = computed(
  () =>
    !location.pathname.startsWith('/login')
    && props.item.uid === getCurrentAccountId(),
);
const lackOfCriticalInfo = computed(() => {
  return !props.item.account || !props.item.password;
});

function updateAccount(newInfo: AccountInfo) {
  emit('emit-event', EventKey.updateAccount, newInfo);
}

function login() {
  if (lackOfCriticalInfo.value) {
    ElMessage.warning({ message: '需要先补全账号、密码后方可登录' });
    editing.value = true;
    return;
  }
  if (editing.value) {
    return;
  }
  emit('emit-event', EventKey.login, props.item.uid);

  trackEvent('content_click_switch_account');

  if (location.pathname !== '/login') {
    location.href = `${location.origin}/login`;
  }
}

function logout() {
  if (editing.value) {
    return;
  }
  emit('emit-event', EventKey.logout, props.item.uid);

  // 登出后隐藏账号列表
  toggleAppletEnable(CLIENT_ACCOUNTS_APPLET_KEY);

  location.href = `${location.origin}/login`;
}

function onEditClick() {
  editing.value = true;
}

const form = ref(null);
</script>

<style scoped lang="scss">
.account-card {
  position: relative;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  z-index: 1;
  aspect-ratio: auto 224 / 92;
  overflow: hidden;
  box-sizing: border-box;
  background-color: white;
  box-shadow: 0 3px 13px -2px rgba(0, 0, 0, 0.12);

  &[data-is-editing='true'] {
    @apply sticky z-10 overflow-visible z-10;
    width: 320px;
    height: 139px;
    aspect-ratio: unset;
    bottom: 0;
  }

  &:hover {
    &[data-is-current='false'][data-is-editing='false'] {
      box-shadow: 0 0 0 3px #0a67ff;

      .log-in-out::before {
        content: '';
      }
    }

    &[data-is-editing='false'] {
      .actions-area {
        display: flex;
      }
    }

    .account-comment {
      @apply text-gray-500;
    }

    .share-this-account {
      animation: wifi 1.2s steps(4, end) infinite alternate;
    }
  }
}

@keyframes ripples {
  from {
    opacity: 1;
    transform: scale(0.9);
  }

  to {
    opacity: 0;
    transform: scale(1.5);
  }
}

.log-in-out {
  position: relative;

  &::before {
    @apply bg-blue-300;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: -1;
    animation: ripples 1.1s ease-out infinite;
  }
}

.share-this-account {
  --blue-position: 0px;

  width: 15px;
  height: 15px;
  background-image: radial-gradient(
    circle at 50% 100%,
    #0f44ff 0%,
    #0f44ff var(--blue-position),
    currentColor var(--blue-position),
    currentColor 100%
  );
  mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBjbGFzcz0iaWNvbmlmeSBpY29uaWZ5LS1pYyIgd2lkdGg9IjFlbSIgaGVpZ2h0PSIxZW0iIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJtMSA5bDIgMmM0Ljk3LTQuOTcgMTMuMDMtNC45NyAxOCAwbDItMkMxNi45MyAyLjkzIDcuMDggMi45MyAxIDl6bTggOGwzIDNsMy0zYTQuMjM3IDQuMjM3IDAgMCAwLTYgMHptLTQtNGwyIDJhNy4wNzQgNy4wNzQgMCAwIDEgMTAgMGwyLTJDMTUuMTQgOS4xNCA4Ljg3IDkuMTQgNSAxM3oiPjwvcGF0aD48L3N2Zz4=);
}

@keyframes wifi {
  0% {
    --blue-position: 0px;
  }

  33.3% {
    --blue-position: 5px;
  }

  66.6% {
    --blue-position: 10px;
  }

  100% {
    --blue-position: 15px;
  }
}

.actions-area {
  @apply  flex -right-0px -top-0px gap-7px;
  padding-left: 20px;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 1) 20%,
    white
  );
}

.scale-sm {
  transform: scale(0.9);
  transform-origin: left;
}

.tag-list-box {
  height: 18px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: #d6d6d6;
  }

  + .account-comment {
    margin-top: 8px;
    -webkit-line-clamp: 2;
  }
}

.account-comment {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.action-button {
  @apply text-gray-400;
  font-size: 13px;

  & + & {
    margin-left: 3px;
  }

  &:hover {
    @apply text-blue-500;
  }

  &:focus {
    outline: 0;
  }
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: 0.2s ease-out;
  max-height: 400px;
}

.form-fade-enter-from,
.form-fade-leave-to {
  opacity: 0;
  max-height: 0px;
}
</style>
