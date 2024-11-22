<script setup lang="ts">
defineProps<{
  miniMode?: boolean;
}>();
</script>

<template>
  <div v-if="miniMode" class="flag">
    <QIcon name="flag" />
  </div>
  <QChip v-else icon="flag" icon-right="o_help" class="chip">
    會員堂數成交機會!
    <QTooltip class="bg-black text-white booking-card__note q-pa-md" anchor="center right" self="bottom middle" max-width="264px" max-height="160px">
      <div class="tip-text">
        <div>此客戶會員堂數成交機會高！</div>
        <div>• 為初診客戶，可建議儲值堂數</div>
        <div>• 上次支付方式非堂數，可建議儲值</div>
        <div>• 會員只剩下一堂，可建議儲值</div>
      </div>
    </QTooltip>
  </QChip>
</template>

<style lang="scss" scoped>
.chip {
  border-radius: 2px;
  background-color: rgba(204, 153, 0, 1);
  :deep(.q-chip__content) {
    color: #fff;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 0.5px;
  }
  :deep(.q-chip__icon--left) {
    color: rgba(251, 238, 178, 1);
  }
  :deep(.q-chip__icon--right) {
    color: white;
  }
}

.tip-text {
  > div {
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0.4px;
    &:not(:first-of-type) {
      text-indent: 6px;
    }
  }
}

.flag {
  display: inline-block;
  background-color: rgba(204, 153, 0, 1);
  border-radius: 2px;
  padding: 1px 4px;
  .q-icon {
    color: rgba(251, 238, 178, 1);
  }
}
</style>
