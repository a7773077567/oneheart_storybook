<script setup lang='ts'>
import { Field } from 'vee-validate';
import type { Client } from '@/api';

withDefaults(defineProps<{
  name: string;
  hideDelete?: boolean;
}>(), {
  hideDelete: false,
});

defineEmits<{
  (e: 'remove', val: Client): void;
}>();
</script>

<template>
  <div class="group_member row">
    <Field v-slot="{ value, field }" :name="name">
      <fieldset class="col-4">
        <span class="label">姓名</span>
        <OInput :name="field.name" readonly :model-value="value.name" hide-bottom-space error-message="" />
      </fieldset>
      <fieldset class="col-4">
        <span class="label">電話</span>
        <OInput :name="field.name" readonly :model-value="value.phone" hide-bottom-space error-message="" />
      </fieldset>
      <fieldset class="col-3 text-weight-bold">
        <span class="label">會員編號</span>
        <p class="text-weight-bold">
          #{{ value.id }}
        </p>
      </fieldset>
      <div v-if="!hideDelete" class="col-auto">
        <QBtn icon="o_delete" round flat size="sm" @click="$emit('remove', value)" />
      </div>
    </Field>
  </div>
</template>

<style scoped lang="scss">
.group_member {
  align-items: center;
  flex-wrap: nowrap;
  fieldset {
    display: flex;
    align-items: center;
    .label {
      margin-right: 8px;
    }
  }
}
</style>
