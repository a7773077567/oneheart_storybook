<script setup lang='ts'>
interface MemberInfo {
  name: string | null;
  phone: string | null;
  id: string | null;
}
defineProps<{
  modelValue: MemberInfo;
}>();

defineEmits<{
  (e: 'update:modelValue', val: MemberInfo): void;
  (e: 'remove'): void;
}>();
</script>

<template>
  <div class="group_member row">
    <fieldset class="col-6 col-md-4">
      <span class="label">姓名</span>
      <OInput name="name" hide-bottom-space />
    </fieldset>
    <fieldset class="col-6 col-md-4">
      <span class="label">電話</span>
      <OInput name="name" hide-bottom-space />
    </fieldset>
    <fieldset class="col-6 col-md-3">
      <span class="label">會員編號</span>
      <p>{{ }}</p>
    </fieldset>
    <div class="col-6 col-md-auto">
      <QBtn icon="o_delete" round flat size="sm" @click="$emit('remove')" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.group_member {
  align-items: center;
  fieldset {
    display: flex;
    align-items: center;
    .label {
      margin-right: 8px;
    }
  }
}
</style>
