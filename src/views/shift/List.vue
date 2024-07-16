<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { omit } from 'radash';
import { ShiftChip, ShiftEditor, ShiftSelector } from '@/components/shift';
import { createUserShift, deleteUserShift, updateUserShift } from '@/api/shift';
import type { CreateUserShift, UserShiftPatch, UserShiftTemplate } from '@/api/shift';
import dayjs from 'dayjs';
import { useShiftStore, useUserStore } from '@/stores';
import type { ChangeParams } from '@/components/shared/Calendar.vue';

const shiftStore = useShiftStore();
const userStore = useUserStore();

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const duration = ref({ startDate: '', endDate: '' });
const isAddingShift = ref(false);
const isUpdatingShift = ref(false);
const targetDate = ref<string | null >(null);
const userIds = computed(() => shiftStore.users.map(user => user.id));
const targetUserId = ref<number | null>(null);
const targetUserShiftId = ref<number | null>(null);
const targetShiftTemplates = computed(() => userStore.isGym ? shiftStore.shiftTemplatesForGym : shiftStore.shiftTemplates);

watch(duration, getUserShifts);

await shiftStore.getUsers([userStore.currentSpace!]);

function getDayShifts(date: string, userId: string) {
  const currentDay = dayjs(date);

  const items = shiftStore.userShifts.filter(item =>
    dayjs(item.date).isSame(currentDay, 'date') && +userId === item.userId,
  );
  return items;
}

async function openShiftSelector(date: string, userId: number) {
  await shiftStore.getShiftTemplates();
  targetDate.value = date;
  targetUserId.value = userId;
  isAddingShift.value = true;
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

  await createUserShift(payload);
  await getUserShifts();
  targetUserId.value = null;
  targetDate.value = null;
  isAddingShift.value = false;
}

async function onDeleteUserShift(userShiftId: number) {
  await deleteUserShift(userShiftId);
  await getUserShifts();
}

async function openShiftEditor(userShiftId: number) {
  await shiftStore.getUserShift(userShiftId);
  targetUserShiftId.value = userShiftId;
  isUpdatingShift.value = true;
}

async function onUpdateUserShift(payload: UserShiftPatch) {
  await updateUserShift(targetUserShiftId.value!, payload);
  await getUserShifts();
  targetUserShiftId.value = null;
  isUpdatingShift.value = false;
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
</script>

<template>
  <div class="shift-list">
    <Calendar
      v-model="selectedDate"
      v-model:model-resources="shiftStore.users"
      view="week"
      @change="onCalendarChange"
    >
      <template #day="{ scope: { resource, timestamp, isEditing } }">
        <div class="day">
          <ShiftChip
            v-for="(item, idx) in getDayShifts(timestamp.date, resource.id)"
            :key="idx"
            :data="item"
            :edit-mode="isEditing"
            @delete="onDeleteUserShift"
            @update="openShiftEditor"
          />
          <QBtn v-if="isEditing" icon="add" flat round size="10px" @click="() => openShiftSelector(timestamp.date, resource.id)" />
        </div>
      </template>
    </Calendar>
    <QDialog v-model="isAddingShift" persistent>
      <ShiftSelector :data="targetShiftTemplates" style="min-width: 336px;" @confirm="addUserShift" />
    </QDialog>
    <QDialog v-model="isUpdatingShift" persistent>
      <ShiftEditor :data="shiftStore.targetUserShift" user-shift-mode @cancel="isUpdatingShift = false" @update-confirm="onUpdateUserShift" />
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
