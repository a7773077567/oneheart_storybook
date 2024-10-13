<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { omit } from 'radash';
import { ShiftChip, ShiftEditor, ShiftSelector } from '@/components/shift';
import { createUserShift, deleteUserShift, updateUserShift } from '@/api/shift';
import type { CreateUserShift, UpdateUserShift, UserShiftTemplate } from '@/api/shift';
import dayjs from 'dayjs';
import { useShiftStore, useUserStore } from '@/stores';
import type { ChangeParams } from '@/components/shared/Calendar.vue';
import { ErrorMessages } from '@/api/errorMessages';
import { useQuasar } from 'quasar';

const shiftStore = useShiftStore();
const userStore = useUserStore();
const $q = useQuasar();

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const duration = ref({ startDate: '', endDate: '' });
const isShiftSelectorOpen = ref(false);
const isShiftEditorOpen = ref(false);
const targetDate = ref<string | null >(null);
const userIds = computed(() => shiftStore.users.map(user => user.id));
const targetUserId = ref<number | null>(null);
const targetUserShiftId = ref<number | null>(null);
const targetShiftTemplates = computed(() => userStore.isGym ? shiftStore.shiftTemplatesForGym : shiftStore.shiftTemplates);
const shiftSelectorHint = ref('');

watch(duration, getUserShifts);

await shiftStore.getUsers([userStore.currentSpaceId!]);

function getDayShifts(date: string, userId: string) {
  const currentDay = dayjs(date);

  return shiftStore.userShifts.filter(item =>
    dayjs(item.date).isSame(currentDay, 'date') && +userId === item.userId,
  );
}

async function openShiftSelector(date: string, userId: number) {
  await shiftStore.getShiftTemplates();
  targetDate.value = date;
  targetUserId.value = userId;
  isShiftSelectorOpen.value = true;
}

async function addUserShift(shiftTemplate: UserShiftTemplate) {
  let payload: CreateUserShift;
  const isGroupClass = shiftTemplate.type === 11;
  if (isGroupClass) {
    payload = {
      ...omit(shiftTemplate, ['id', 'spaceId', 'remainingClasses', 'maxClientsForGroupClass', 'numberOfClasses']),
      userId: targetUserId.value!,
      date: targetDate.value!,
      name: null,
      groupClassId: shiftTemplate.id,
      notAvailableTimes: [],
      maxClients: null,
      maxClientsForCoachClass: null,
    };
  }
  else {
    payload = {
      ...omit(shiftTemplate, ['id', 'spaceId']),
      userId: targetUserId.value!,
      date: targetDate.value!,
      groupClassId: null,
    };
  }

  try {
    await createUserShift(payload);
    targetUserId.value = null;
    targetDate.value = null;
    isShiftSelectorOpen.value = false;
    shiftSelectorHint.value = '';
    await getUserShifts();
  }
  catch (err: any) {
    const message = err.response.data.data.message;
    const hint = ErrorMessages.get(message) ?? message;
    shiftSelectorHint.value = hint;
    $q.notify({ message: hint, position: 'top', timeout: 2000 });
  }
}

async function onDeleteUserShift(userShiftId: number) {
  await deleteUserShift(userShiftId);
  await getUserShifts();
}

async function openShiftEditor(userShiftId: number) {
  await shiftStore.getUserShift(userShiftId);
  targetUserShiftId.value = userShiftId;
  isShiftEditorOpen.value = true;
}

async function onUpdateUserShift(payload: Record<string, any>) {
  await updateUserShift(targetUserShiftId.value!, payload as UpdateUserShift);
  await getUserShifts();
  targetUserShiftId.value = null;
  isShiftEditorOpen.value = false;
}

function onCalendarChange(calendarDuration: ChangeParams) {
  const { start, end } = calendarDuration;
  duration.value = {
    startDate: start,
    endDate: end,
  };
}

async function getUserShifts() {
  if (userStore.isGym) {
    await shiftStore.getAvailableClassesForGym();
  }
  await shiftStore.getUserShifts({
    ...duration.value,
    userIds: userIds.value,
  });
}

function closeShiftSelector() {
  isShiftSelectorOpen.value = false;
  shiftSelectorHint.value = '';
}
</script>

<template>
  <div class="shift-list">
    <Calendar
      v-model="selectedDate"
      :model-resources="shiftStore.activeUsers"
      :resource-width="200"
      view="week"
      @model-resources="shiftStore.users = $event"
      @change="onCalendarChange"
    >
      <template #day="{ scope: { resource, timestamp, isEditing } }">
        <div class="day">
          <ShiftChip
            v-for="(item, idx) in getDayShifts(timestamp.date, resource.id)"
            :key="idx"
            :data="item"
            :edit-mode="isEditing"
            :hide-edit="item.type === 1 || item.type === 11"
            :is-group-class="item.type === 11"
            @delete="onDeleteUserShift"
            @update="openShiftEditor"
          />
          <QBtn v-if="isEditing" icon="add" flat round size="10px" @click="() => openShiftSelector(timestamp.date, resource.id)" />
        </div>
      </template>
    </Calendar>
    <QDialog v-model="isShiftSelectorOpen" persistent>
      <ShiftSelector :data="targetShiftTemplates" :hint-message="shiftSelectorHint" style="min-width: 336px;" @confirm="addUserShift" @close="closeShiftSelector" />
    </QDialog>
    <QDialog v-model="isShiftEditorOpen" persistent>
      <ShiftEditor :data="shiftStore.targetUserShift" :shift-type-options="shiftStore.spaceShiftOptions" @cancel="isShiftEditorOpen = false" @confirm="onUpdateUserShift" />
    </QDialog>
  </div>
</template>

<style lang="scss" scoped>
.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 12px;
  overflow-y: scroll;
  > * {
    flex-shrink: 0;
  }
}
</style>
