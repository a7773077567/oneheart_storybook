<script setup lang="ts">
import { type Available, type Client, createAppointment, createAppointmentRearrange } from '@/api';
import { useAppointmentStore } from '@/stores';
import { computed, ref } from 'vue';
import { getDateLabel, getTypeLabel } from '@/utils/mappers';
import { getDurationLabel } from '@/utils/date';
import { useRouter } from 'vue-router';
import { OInput, OMemberSearch } from '@/components/shared';
import { useNotify } from '@/composables/notify';
import { useDialog } from '@/composables/dialog';
import { useQuasar } from 'quasar';
import { ShiftType } from '@/const/general';

interface Column<T> {
  key: keyof T | string;
  label: string;
  mapFunc?: (target: T) => string;
  slotName?: string;
}

interface TableData {
  key: string;
  value: string;
}

const emit = defineEmits<{
  (e: 'appointment', appointment?: Available): void;
  (e: 'close'): void;
}>();

const router = useRouter();
const appointmentStore = useAppointmentStore();
const isEmployeePrice = ref(false);
const pickedClientId = ref<number | null>(null);
const note = ref('');

const clientTableData = computed(() => getTableData(appointmentStore.targetClient, [
  { key: 'name', label: '姓名' },
  { key: 'phone', label: '電話' },
]));
const availableTableData = computed(() => getTableData(appointmentStore.targetAvailable, [
  { key: 'date', label: '日期', mapFunc: target => getDateLabel(target.date) },
  { key: 'startTime', label: '時間', mapFunc: target => getDurationLabel(target.startTime, target.endTime) },
  { key: 'name', label: '項目', mapFunc: target => `${getTypeLabel(target.type)}` },
  { key: 'user', label: '治療師', mapFunc: target => target.user.name },
  { key: 'note', label: '備註', slotName: 'note' },
]));

function getTableData<T extends Record<string, any>>(target: T | null, columns: Column<T>[]): TableData[] {
  if (!target) {
    return [];
  }
  return columns.map(({ key, label, mapFunc, slotName }) => {
    const targetValue = target[key as keyof T];
    return {
      key: label,
      value: mapFunc ? mapFunc(target) : targetValue,
      ...(slotName && { slotName }),
    };
  });
}

function close() {
  appointmentStore.resetTargetAppointmentState();
  emit('close');
}

async function appointment() {
  if (!appointmentStore.targetAvailable || !appointmentStore.targetClient) {
    return;
  }
  if (!appointmentStore.rearrangeMode) {
    const { targetAvailable, targetClient } = appointmentStore;
    const { userShiftId, startTime, endTime, date, machine, space, type, autoRecommand } = targetAvailable;

    await createAppointment({
      isEmployeePrice: isEmployeePrice.value,
      userShiftId,
      bookingClientIds: [targetClient.id],
      note: note.value ?? '',
      startTime,
      endTime,
      date,
      machineId: machine?.id ?? null,
      spaceId: space.id,
      userShiftType: type,
      isUsingAutoRecommend: autoRecommand,
      referalUserId: type === ShiftType['G動椅'] ? appointmentStore.referralUserId : null,
      ...(appointmentStore.queryAddOns.length > 0 ? { addOnUserShiftTypes: appointmentStore.queryAddOns } : {}),
    });
    await appointmentStore.getAvailable(appointmentStore.availableQuery!);
    // router.push({ name: 'appointmentListCalendar', query: { date: targetAvailable.date } });
    useNotify('預約成功');
  }
  else {
    const { targetClientScheduleNotStarted, targetAvailable } = appointmentStore;
    const { userShiftId, startTime, endTime } = targetAvailable;
    try {
      await createAppointmentRearrange({
        clientScheduleId: targetClientScheduleNotStarted!.id,
        userShiftId,
        startTime,
        endTime,
      });
      router.push({ name: 'appointmentListCalendar', query: { date: targetAvailable.date } });
      useNotify('改期成功');
    }
    catch (err) {
      console.log(err);
    }
    return;
  }
  emit('appointment', appointmentStore.targetAvailable);
  appointmentStore.resetTargetAppointmentState();
}

const showBlacklistAlert = ref(false);
const $q = useQuasar();
async function handleSelection(client: Client | null) {
  appointmentStore.targetClient = client;

  if (client?.isBlacklisted) {
    showBlacklistAlert.value = true;
    // const { onOk } = await useDialog({ type: 'confirm', title: '確定刪除此群組', message: '一但刪除群組，則無法復原，如確認無誤請按確定。' });
    // onOk(async () => {

    // });
    $q.dialog({
      title: '該客戶被設置為黑名單',
      message: '此客戶於客戶管理頁面設置為黑名單，僅作提醒，您仍可完成預約。',
      ok: {
        label: '我瞭解了',
        rounded: true,
        color: 'primary',
        style: 'padding: 10px 24px',
      },
      style: 'width: 312px; padding:8px 8px 16px; border-radius: 28px',
    });
  }
}

// to refactor, need to get clients first
appointmentStore.getClients();
</script>

<template>
  <QCard style="width: 757px; min-height: 658px;">
    <QCardActions align="right" class="q-pa-none">
      <QIcon name="close" size="24px" class="cursor-pointer q-pa-sm" @click="close" />
    </QCardActions>
    <QCardSection class="column q-gutter-sm">
      <OCheckbox
        v-model="isEmployeePrice"
        label="員工價"
        left-label
        class="self-start q-pa-sm"
      />
      <OMemberSearch v-model="pickedClientId" placeholder="電話或姓名搜尋會員" @update:full-info="handleSelection" />
      <template v-if="appointmentStore.targetClient">
        <span class="q-pa-sm">會員編號 {{ appointmentStore.targetClient.identityNumber || 1234567890 }} </span>
        <OTable :data="clientTableData" />
        <OTable :data="availableTableData">
          <template #note>
            <OInput v-model="note" name="note" hide-bottom-space type="textarea" class="full-width" placeholder="請輸入預約備註" />
          </template>
        </OTable>
        <QBtn label="預約" class="self-end" outline dense padding="10px 46px" @click="appointment" />
      </template>
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>
.active {
  background-color: #000 !important;
  color: #fff;
}
</style>
