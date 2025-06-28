<script setup lang="ts">
defineProps<{
  infos: string[];
  showHelpIcon?: boolean;
  tooltip?: string;
}>();
</script>

<template>
  <div class="info-hint">
    <QIcon name="o_info" size="20px" />
    <span
      v-for="(info, idx) in infos"
      :key="idx"
    >{{ info }}</span>
    <QIcon v-if="showHelpIcon" name="o_help_outline" size="20px" />

    <QTooltip v-if="tooltip" max-width="320px" class="bg-black" style="white-space: pre-wrap;">
      <span class="text-body-small">{{ tooltip }}</span>
    </QTooltip>
  </div>
</template>

<style lang="scss" scoped>
.info-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  > span {
    @include text-style($body-medium, $on-surface-variant);
  }
}
</style>
