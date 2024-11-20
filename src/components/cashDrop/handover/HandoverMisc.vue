<script setup lang="ts">
import { useFieldArray, useForm } from 'vee-validate';
import { watch } from 'vue';

interface HandoverMisc {
  name: string;
  amount: number;
}

const props = defineProps<{
  modelValue: HandoverMisc[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: HandoverMisc[]): void;
}>();

const { values } = useForm<{ handoverMisc: HandoverMisc[] }>({
  initialValues: {
    handoverMisc: props.modelValue,
  },
});

watch(values, () => {
  emit('update:modelValue', values.handoverMisc);
});

const { fields, push, remove } = useFieldArray<HandoverMisc>('handoverMisc');

function addDetail() {
  push({
    name: '',
    amount: 0,
  });
}
</script>

<template>
  <div class="handover-misc">
    <div class="handover-misc__inputs">
      <div v-for="(field, idx) in fields" :key="field.key" class="input">
        <div class="input__item">
          <div class="input__label">細項名稱</div>
          <OInput :name="`handoverMisc[${idx}].name`" hide-bottom-space style="width: 236px;" />
        </div>
        <div class="input__item--amount">
          <div class="input__label">金額</div>
          <OInput type="number" :name="`handoverMisc[${idx}].amount`" hide-bottom-space style="width: 178px;" />
        </div>
        <div class="input__item">
          <QBtn icon="o_delete" flat round @click="remove(idx)" />
        </div>
      </div>
    </div>
    <div class="handover-misc__add">
      <QBtn label="新增細項" flat icon="add" padding="10px 13px" @click="addDetail" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.handover-misc {
  width: fit-content;
  min-width: 640px;
  &__inputs {
    border-bottom: 1px solid rgba(217, 217, 217, 1);
    margin-bottom: 8px;
  }
}

.input {
  padding: 16px 0;
  display: flex;
  gap: 15px;
  &__item {
    display: flex;
    gap: 10px;
    align-items: center;
    &--amount {
      @extend .input__item;
      padding-left: 31px;
    }
  }
}
</style>
