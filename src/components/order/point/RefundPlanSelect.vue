<script setup lang='ts'>
import type { RefundablePayment } from '@/api';
import type { PointTypes } from '@/const/general';
import { computed, ref } from 'vue';
import { pointUnit } from '@/const/points';

const props = defineProps<{
  modelValue?: RefundablePayment;
  list: RefundablePayment[];
  pointType?: PointTypes;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', option: RefundablePayment): void;
}>();

const showOptions = ref(false);
const selected = ref(props.modelValue?.id);
const unit = computed(() => props?.pointType ? pointUnit[props.pointType] : '堂');
function handleConfirm() {
  const selectedPlan = props.list.find(o => o.id === selected.value);
  if (!selectedPlan) {
    return new Error('no selected plan');
  }
  emit('update:modelValue', selectedPlan);
  showOptions.value = false;
}

// const list = [
//   {
//     id: 122,
//     plan: '$20,000：10堂送1堂',
//     useAblePoints: 11,
//     usedPoints: 0,
//     amount: 20000,
//     clientGroupId: 5,
//     clientGroupName: '1人物理群',
//     createdAt: '2025-04-27 17:09:25',
//     sellers: [],
//     chargers: [
//       {
//         id: 9,
//         name: '大主管',
//         hireDate: null,
//         role: null,
//         spaces: [],
//         ancestor: null,
//         introducer: null,
//       },
//     ],
//   },
//   {
//     id: 127,
//     plan: '$20,000：10堂送1堂',
//     useAblePoints: 11,
//     usedPoints: 0,
//     amount: 20000,
//     clientGroupId: 5,
//     clientGroupName: '1人物理群',
//     createdAt: '2025-05-31 13:38:55',
//     sellers: [],
//     chargers: [
//       {
//         id: 1,
//         name: 'admin',
//         hireDate: null,
//         role: null,
//         spaces: [],
//         ancestor: null,
//         introducer: null,
//       },
//     ],
//   },
//   {
//     id: 128,
//     plan: 'winback能量治療五堂 $9,500',
//     useAblePoints: 5,
//     usedPoints: 0,
//     amount: 9500,
//     clientGroupId: 5,
//     clientGroupName: '1人物理群',
//     createdAt: '2025-06-15 00:51:56',
//     sellers: [
//       {
//         id: 25,
//         name: 'Sherry',
//         hireDate: null,
//         role: null,
//         spaces: [],
//         ancestor: null,
//         introducer: null,
//       },
//       {
//         id: 9,
//         name: '大主管',
//         hireDate: null,
//         role: null,
//         spaces: [],
//         ancestor: null,
//         introducer: null,
//       },
//     ],
//     chargers: [],
//   },
// ];
</script>

<template>
  <QCard flat bordered class="full-width">
    <QCardSection class="full-width">
      <div class="row">
        <div class="col text-body-large">退款方案</div>
        <QBtn flat color="primary" label="選擇方案" class="col-auto" @click="(showOptions = true), (selected = modelValue?.id)" />
      </div>
    </QCardSection>
    <QSeparator />
    <QCardSection>
      <p v-if="!modelValue" class="text-surface-dim">尚未選擇</p>
      <div v-else class="row">
        <QCardSection class="col">
          <p class="text-label-medium">{{ modelValue.createdAt }}</p>
          <p class="q-my-xs text-body-large">{{ modelValue.plan }}</p>
          <p class="text-body-small text-outline">負責人：{{ modelValue?.chargers?.map(c => c.name).join(', ') }} | 銷售者：{{ modelValue?.sellers?.map(s => s.name).join(', ') }}</p>
        </QCardSection>
        <QCardSection class="col-12 col-sm-auto flex items-center">
          <QItemLabel caption> 退款：{{ modelValue.useAblePoints }} {{ unit }} (已使用：{{ modelValue.usedPoints }} {{ unit }})</QItemLabel>
        </QCardSection>
      </div>
    </QCardSection>

    <QDialog v-model="showOptions" persistent>
      <QCard class="refund_plan_list">
        <QCardSection class="q-py-lg">
          <div class="text-h6">選擇退款方案</div>
        </QCardSection>

        <QCardSection class="q-pt-none">
          <QList separator padding>
            <QItem v-for="option in list" :key="option.id" v-ripple clickable @click="selected = option.id">
              <QItemSection side>
                <QRadio v-model="selected" :val="option.id" />
              </QItemSection>
              <QItemSection>
                <QItemLabel caption class="text-label-medium">{{ option.createdAt }}</QItemLabel>
                <QItemLabel class="q-my-xs text-body-large">
                  {{ option.plan }}
                </QItemLabel>
                <QItemLabel caption class="text-body-small text-outline">
                  負責人： {{ option.chargers.map(c => c.name).join(', ') }} | 銷售者：{{ option.sellers.map(s => s.name).join(', ') }}
                </QItemLabel>
              </QItemSection>
              <QItemSection side>
                <QItemLabel caption class="text-on-surface">
                  退款：{{ option.useAblePoints }} {{ unit }} (已使用：{{ option.usedPoints }} {{ unit }})
                </QItemLabel>
              </QItemSection>
            </QItem>
          </QList>
        </QCardSection>

        <QCardActions align="right" class="q-pa-lg">
          <QBtn v-close-popup rounded plain color="primary" flat label="取消" @click="showOptions = false" />
          <QBtn rounded label="確定" color="primary" @click="handleConfirm" />
        </QCardActions>
      </QCard>
    </QDialog>
  </QCard>
</template>

<style>
.refund_plan_list {
  width: 640px;
  max-width: 100vw;
  border-radius: 28px;
}
</style>
