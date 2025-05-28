<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFieldArray, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppointmentStore, useShiftStore, useUserStore } from '@/stores';
import dayjs from 'dayjs';
import { RoleType, type User, availableReqSchema, fetchSpaces, fetchUsers } from '@/api';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getType } from '@/utils/mappers';
import { AddOnServiceTypes, MachineTypes, PhysicalTypes, ShiftType } from '@/const/general';
import { removeZhuyin } from '@/utils/helpers';
import { omit } from 'radash';
import type { QSelectSlots } from 'quasar';

type Scope = Parameters<QSelectSlots['option']>[0];

const $q = useQuasar();
const router = useRouter();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();
const shiftStore = useShiftStore();
const selectLabel = ref('治療師');
const therapistOptions = ref<any[]>([]);

await appointmentStore.getUsers([userStore.currentSpaceId!]);

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: toTypedSchema(availableReqSchema),
  initialValues: {
    userShiftType: shiftStore.spaceShiftOptions[0].value,
    userIds: [],
    date: dayjs().format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '21:00',
    addOnUserShiftTypes: [],
    autoRecommend: false,
  },
});
const { push, remove } = useFieldArray<AddOnServiceTypes>('addOnUserShiftTypes');

const ifReservingGChair = computed(() => values.userShiftType === ShiftType['G動椅']);
const ifUsingAutoRecommend = computed(() => values.autoRecommend);
const canSelectMachine = computed(() => values.userShiftType && PhysicalTypes.includes(values.userShiftType as any) && !ifUsingAutoRecommend.value);

function selectAddOn(addOn: AddOnServiceTypes) {
  if (values.addOnUserShiftTypes?.includes(addOn)) {
    const idx = values.addOnUserShiftTypes?.findIndex(a => a === addOn);
    remove(idx);
  }
  else {
    push(addOn);
  }
}

function selectAutoRecommend(ifAuto: boolean) {
  if (ifAuto) {
    setFieldValue('userIds', []);
    setFieldValue('addOnUserShiftTypes', []);
  }
}

watch(() => values.userShiftType, (newShiftType) => {
  const shiftDetails = getType(newShiftType!)!;
  const newTherapistOptions = appointmentStore.currentNonFronDeskUsers.filter(item => shiftDetails.roles.includes(item.role.type));
  // const newTherapistIds = newTherapistOptions.map(item => item.id);
  therapistOptions.value = newTherapistOptions;
  setFieldValue('userIds', []);
  selectLabel.value = shiftDetails.selectLabel;

  if (newShiftType === ShiftType['G動椅']) {
    setFieldValue('autoRecommend', false);
    getReferralList();
  }
}, { immediate: true });

const onSubmit = handleSubmit(async (values) => {
  appointmentStore.appointmentCalendarInitOption = values.userIds ?? [];
  appointmentStore.referralUserId = values.referalUserId ?? null;
  appointmentStore.availableQuery = {
    ...omit(values, ['referalUserId']),
    userIds: values.autoRecommend
      ? []
      : appointmentStore.currentNonFronDeskUsers.map(user => user.id),
  }; // refactor, 改成 api 篩選治療師，非前端篩選

  try {
    $q.loading.show();
    await appointmentStore.getAvailable(appointmentStore.availableQuery);
    appointmentStore.querySent = true;

    // 自動推薦僅顯示可預約治療師
    if (ifUsingAutoRecommend.value) {
      appointmentStore.appointmentCalendarInitOption = appointmentStore.autoRecommendTherpistIds;
      appointmentStore.availableQuery = { ...appointmentStore.availableQuery, userIds: values.autoRecommend ? [] : appointmentStore.autoRecommendTherpistIds };
    }
    // G動椅是另外的 Machine Calendar 顯示
    await router.push(ifReservingGChair.value
      ? {
          name: 'machineBookingCalendar',
          params: {
            machineType: MachineTypes['G動椅儀器治療'],
          },
        }
      : {
          name: 'appointmentBookingCalendar',
        });
  }
  catch (err) {
    console.log(err);
  }
  finally {
    $q.loading.hide();
  }
});

const isFetchingReferral = ref(false);
const referralList = ref<User[]>([]);
const keyword = ref('');
const filterReferralList = computed(() => keyword.value ? referralList.value.filter(user => user.name.includes(keyword.value)) : referralList.value);
async function getReferralList() {
  isFetchingReferral.value = true;
  const spaces = await fetchSpaces();
  const res = await fetchUsers({ spaceIds: spaces.map(s => s.id), roleTypes: [RoleType['院長'], RoleType['副院長'], RoleType['物理治療師組長'], RoleType['物理治療師']] });
  referralList.value = res.map(user => ({ label: user.name, value: user.id, space: user.spaces.map(s => s.name).join(','), ...user }));
  isFetchingReferral.value = false;
}

function filterReferral(val: string) {
  keyword.value = removeZhuyin(val);
}
</script>

<template>
  <h3 class="text-headline-small">預約</h3>
  <form class="booking-query">
    <fieldset>
      <OSelect name="userShiftType" label="選擇項目" :options="shiftStore.spaceShiftOptions" hide-bottom-space />
    </fieldset>
    <fieldset>
      <OCheckbox
        name="autoRecommend" :disable="ifReservingGChair" label="自動推薦治療師" class="q-px-none"
        @update:model-value="selectAutoRecommend"
      />
      <p v-if="ifReservingGChair" class="text-body-small text-on-surface-variant">此項目不需提前指定治療師，當天現場於「客戶預約單」指定。</p>
    </fieldset>
    <fieldset>
      <OSelect
        :disable="ifUsingAutoRecommend || ifReservingGChair" name="userIds" :label="`選擇${selectLabel}`"
        :options="therapistOptions" multiple hide-bottom-space
      />
      <p v-show="ifUsingAutoRecommend" class="text-body-small text-on-surface-variant q-pl-md q-pt-xs">
        已勾選「自動推薦治療師」，不須選擇治療師。
      </p>
      <OSelect
        v-if="ifReservingGChair"
        use-input name="referalUserId" label="選擇轉介治療師(選填)" :options="filterReferralList"
        hide-bottom-space class="q-mt-md"
        emit-value
        map-options
        :disable="isFetchingReferral"
        popup-content-class="referral_menu"
        clearable
        @input-value="filterReferral"
        @clear="keyword = ''"
      >
        <template #option="scope">
          <QItem v-bind="(scope as Scope).itemProps" style="max-width: 100%">
            <QItemSection>
              <QItemLabel>{{ (scope as Scope).opt.label }}</QItemLabel>
            </QItemSection>
            <QItemSection>
              <QItemLabel caption>{{ (scope as Scope).opt.space }}</QItemLabel>
            </QItemSection>
          </QItem>
        </template>
      </OSelect>
    </fieldset>
    <fieldset>
      <OInput date-mode name="date" hide-bottom-space inside-label="選擇日期" mask="####-##-##" error-message="" />
    </fieldset>
    <fieldset>
      <div class="flex items-center q-gutter-x-sm">
        <OTime name="startTime" now-btn hide-bottom-space label="開始時間" />
        <span>至</span>
        <OTime name="endTime" now-btn hide-bottom-space label="結束時間" />
        <span>止</span>
      </div>
    </fieldset>
    <fieldset v-if="canSelectMachine">
      <legend>物理治療可加購儀器，是否加購？</legend>
      <p class="remark text-body-small text-on-surface-variant">(至多可選兩項)</p>
      <QCheckbox
        :model-value="!!values.addOnUserShiftTypes?.includes(AddOnServiceTypes['震波'])"
        :disable="(values.addOnUserShiftTypes ?? []).length >= 2 && !values.addOnUserShiftTypes?.includes(AddOnServiceTypes['震波'])"
        label="震波" class="q-pr-md" @update:model-value="selectAddOn(AddOnServiceTypes['震波'])"
      />
      <QCheckbox
        :model-value="!!values.addOnUserShiftTypes?.includes(AddOnServiceTypes['射頻'])"
        :disable="(values.addOnUserShiftTypes ?? []).length >= 2 && !values.addOnUserShiftTypes?.includes(AddOnServiceTypes['射頻'])"
        label="射頻" class="q-pa-md" @update:model-value="selectAddOn(AddOnServiceTypes['射頻'])"
      />
      <QCheckbox
        :model-value="!!values.addOnUserShiftTypes?.includes(AddOnServiceTypes['磁波'])"
        :disable="(values.addOnUserShiftTypes ?? []).length >= 2 && !values.addOnUserShiftTypes?.includes(AddOnServiceTypes['磁波'])"
        label="磁波" class="q-pa-md" @update:model-value="selectAddOn(AddOnServiceTypes['磁波'])"
      />
    </fieldset>
    <QBtn label="查詢" rounded color="primary" unelevated icon="search" class="q-mt-lg" @click="onSubmit" />
  </form>
</template>

<style lang="scss" scoped>
.booking-query {
  width: fit-content;
  padding: 20px 0;
  overflow: auto;

  fieldset + fieldset {
    margin-top: 20px;
  }

  .note {
    font-size: 12px;
    font-weight: 500;
    color: #1a1b21;
    white-space: nowrap;
    margin-top: 8px;
  }

  fieldset {
    legend {
      @include text-style($body-large, $on-surface);
      margin-bottom: 8px;
    }
  }
}
</style>

<style>
.referral_menu {
  max-width: 300px !important;
}
</style>
