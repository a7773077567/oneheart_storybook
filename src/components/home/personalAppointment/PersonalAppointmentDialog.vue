<script setup lang="ts">
import type { UserInProgressClientSchedule } from '@/api';
import { getTypeLabel } from '@/utils/mappers';
import dayjs from 'dayjs';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  data: UserInProgressClientSchedule[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'choose', val: number): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
});

const title = computed(() => `${dayjs(props.data[0].date).format('M月D日')} 預約`);
const appointments = computed(() => {
  return props.data.map((item) => {
    const { scheduleStartTime, scheduleEndTime, client, state, id, userShift } = item;

    return {
      info: [
        { name: 'space', label: '場館', value: `${userShift.space.name}` },
        { name: 'type', label: getTypeLabel(userShift.type), value: `${scheduleStartTime}-${scheduleEndTime}` },
        { name: 'name', label: '客戶姓名', value: client.name },
        { name: 'phone', label: '電話', value: client.phone },
      ],
      isComplete: state === 4,
      id,
    };
  });
});
</script>

<template>
  <QDialog v-model="model" persistent>
    <div class="dialog">
      <div class="dialog__header">
        <div class="title">{{ title }}</div>
      </div>
      <div class="dialog__body">
        <div v-for="(appointment, idx) in appointments" :key="idx" class="appointment">
          <div v-for="(item, itemIdx) in appointment.info " :key="itemIdx" :class="`appointment__item--${item.name}`">
            <div class="appointment__label">{{ item.label }}</div>
            <div class="appointment__value">{{ item.value }}</div>
          </div>
          <div class="appointment__item--badge">
            <QBadge v-if="!appointment.isComplete" class="badge">病例未完成</QBadge>
          </div>
          <div class="appointment__item--btn">
            <QBtn icon="chevron_right" flat @click="$emit('choose', appointment.id)" />
          </div>
        </div>
      </div>
      <div class="dialog__actions">
        <QBtn label="關閉" color="primary" padding="10px 24px" class="close" @click="model = false" />
      </div>
    </div>
  </QDialog>
</template>

<style lang="scss" scoped>
@mixin mobile {
  @media (max-width: 680px) {
    @content;
  }
}

.dialog {
  background-color: #fff;
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  border-radius: 28px;
  &__header {
    padding: 24px;
  }
  &__body {
    max-height: calc(85vh - 168px);
    padding: 0 24px;
    overflow-y: scroll;
    @include mobile {
      padding: 0 12px;
    }
  }
  &__actions {
    text-align: right;
    padding: 24px;
  }
}
.appointment {
  padding: 4px 0;
  border-bottom: 1px solid rgba(219, 218, 231, 1);
  display: grid;
  grid-template-columns: repeat(4, 1fr) 96px auto;
  align-items: center;
  @include mobile {
    grid-template-columns: 1fr auto;
    padding-bottom: 12px;
    &:last-of-type {
      border-bottom: none;
    }
  }
  &__item {
    padding: 8px 16px;
    &--space {
      @extend .appointment__item;
    }
    &--type {
      @extend .appointment__item;
    }
    &--name {
      @extend .appointment__item;
      @include mobile {
        grid-column: 1 / 2;
        grid-row: 3 / 4;
      }
    }
    &--phone {
      @extend .appointment__item;
      @include mobile {
        grid-column: 1 / 2;
        grid-row: 4 / 5;
      }
    }
    &--badge {
      @extend .appointment__item;
      @include mobile {
        grid-column: 1 / 2;
        grid-row: 5/ 6;
      }
    }
    &--btn {
      @extend .appointment__item;
      padding: 0;
      @include mobile {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
      }
    }
  }

  &__label {
    color: #45464f;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
  }

  &__value {
    color: #1a1b21;
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0.5px;
  }
}

.title {
  color: #1a1b21;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}

.close {
  padding: 10px 24px;
  border-radius: 100px;
  :deep(.block) {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0.1px;
  }
}

.badge {
  padding: 2px 4px;
  color: #c22227;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.5px;
  background-color: rgba(178, 80, 47, 0.12);
  border-radius: 2px;
}
</style>
