<script setup lang="ts">
import { ElTooltip } from 'element-plus';
import useCopyText from '~/hooks/copyText';
import { getPopperPortal } from '~/content/utils';

interface Props {
  text: string // text to copy
  toCopyTip?: string // tooltip text before copy
  copiedTip?: string // tooltip text after copy
  showTip?: boolean
  stopClickPropagation?: boolean
  containerClass?: string
  tipPlacement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
}

const props = withDefaults(defineProps<Props>(), {
  toCopyTip: 'Click To Copy',
  copiedTip: 'Copied',
  showTip: true,
  tipPlacement: 'top',
  stopClickPropagation: false,
});

const emit = defineEmits(['copied']);

const popperPortal = getPopperPortal();

const tooltipEl = ref<InstanceType<typeof ElTooltip> | null>(null);

const tipTextContent = ref(props.toCopyTip);

const _tipVisible = ref(false);
const tipVisible = computed({
  get() {
    return _tipVisible.value && props.showTip;
  },
  set(val: boolean) {
    _tipVisible.value = val;
  },
});

watchEffect(() => {
  if (!tipVisible.value) {
    tipTextContent.value = props.toCopyTip;
  }
});

const copyText = useCopyText(toRef(props, 'text'), {
  onSuccess() {
    if (tipVisible.value) {
      tipTextContent.value = props.copiedTip;
      tooltipEl.value?.updatePopper();
    }
    emit('copied');
  },
});

function copyTextWrap(e) {
  if (props.stopClickPropagation) {
    e.stopPropagation();
  }
  copyText();
}
</script>

<template>
  <ElTooltip
    ref="tooltipEl"
    v-model:visible="tipVisible"
    :placement="tipPlacement"
    effect="dark"
    :append-to="popperPortal"
  >
    <template #default>
      <div
        class="cursor-pointer" :class="[containerClass]"
        @mouseover="tipVisible = true"
        @mouseout="tipVisible = false"
        @click="copyTextWrap"
        @dblclick.stop
      >
        <slot />
      </div>
    </template>
    <template #content>
      <span class="whitespace-nowrap">{{ tipTextContent }}</span>
    </template>
  </ElTooltip>
</template>
