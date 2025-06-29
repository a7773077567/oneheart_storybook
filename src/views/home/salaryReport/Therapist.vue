<script setup lang="ts">
import { RoleType } from '@/api';
import { revokeSalaryConfirmation } from '@/api/home/salaryReport/admin';
import { confirmTherapistSalary } from '@/api/home/salaryReport/therapist';
import { ConfirmChip, ExpansionItem, Layout, MoneyDisplay, OrganizationChart, Table } from '@/components/home/salaryReport';
import { BasicBtn, BasicTabs } from '@/components/shared';
import { useDialog } from '@/composables/dialog';
import { useUserStore } from '@/stores';
import { useSalaryReportTherapistStore } from '@/stores/home/salaryReport/therapist';
import { toCurrency } from '@/utils/helpers';
import { getMonthTabs } from '@/utils/salaryReport';
import dayjs from 'dayjs';
import { useQuasar } from 'quasar';
import { computed, reactive, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const $q = useQuasar();
const route = useRoute();
const userId = computed(() => route.query.employeeId as string);
const therapistSalaryStore = useSalaryReportTherapistStore();
const userStore = useUserStore();

const monthTabs = getMonthTabs();

const state = reactive({
  currentTab: monthTabs[0].name,
  showAmount: false,
  educationSharingExpand: false,
});

watch(
  [() => state.currentTab, () => userId.value],
  async () => {
    $q.loading.show();
    await therapistSalaryStore.getTherapistSalaryDetail(
      +userId.value,
      state.currentTab,
    );
    $q.loading.hide();
  },
  { immediate: true },
);

const expansionItems = computed(() => {
  return [
    { ...therapistSalaryStore.executionAmount },
    therapistSalaryStore.shockWaveSharing,
    therapistSalaryStore.magneticWaveSharing,
    therapistSalaryStore.gChairSharing,
    therapistSalaryStore.SecondmentBonus,
    therapistSalaryStore.educationSharing,
    therapistSalaryStore.recommendationBonus,
    therapistSalaryStore.writingBonus,
    therapistSalaryStore.positionBonus,
    therapistSalaryStore.assistanceBonus,
  ];
});

function showPositionBonus(itemLabel: string) {
  return itemLabel !== '職務獎金' || [RoleType['院長'], RoleType['副院長'], RoleType['物理治療師組長']].includes(userStore.role);
}

async function confirmSalary() {
  const { onOk } = await useDialog({ type: 'confirm', title: '薪資確認', message: `您的 ${dayjs(state.currentTab).format('M')} 月薪資為 ${toCurrency(therapistSalaryStore.totalAmount)}。\n\n請確認您的薪資正確，點擊確認後將鎖定該薪資內容。` });
  onOk(async () => {
    $q.loading.show();
    // await confirmTherapistSalary({ yearMonth: state.currentTab });
    await therapistSalaryStore.getTherapistSalaryDetail(
      +userId.value,
      state.currentTab,
    );
    $q.loading.hide();
  });
}

async function revokeSalary() {
  const { onOk } = await useDialog({ type: 'confirm', title: '倒回確認', message: '倒回確認後，該人員需重新確認。' });
  onOk(async () => {
    $q.loading.show();
    // await revokeSalaryConfirmation({ userId: +userId.value, yearMonth: state.currentTab });
    await therapistSalaryStore.getTherapistSalaryDetail(
      +userId.value,
      state.currentTab,
    );
    $q.loading.hide();
  });
}
</script>

<template>
  <Layout>
    <template #header>
      <BasicTabs
        v-model="state.currentTab"
        :tabs="monthTabs"
      />
      <MoneyDisplay
        v-model="state.showAmount"
        :dot-number="5"
        :amount="therapistSalaryStore.totalAmount"
        label="薪資"
        visibility-toggle
      />
      <ConfirmChip />
      <BasicBtn v-if="RoleType[userStore.role] === '系統管理者'" icon="o_redo" label="倒回確認" style="justify-self: end;" @click="revokeSalary" />
      <BasicBtn v-else label="確認薪資" style="justify-self: end;" @click="confirmSalary" />
    </template>
    <template #body>
      <QList>
        <template
          v-for="(item, idx) in expansionItems"
          :key="idx"
        >
          <ExpansionItem
            v-if="showPositionBonus(item.label)"
            :model-value="item.label === '教育分潤' ? state.educationSharingExpand : undefined"
            :label="item.label"
            :amount="item.amount"
            :show-amount="state.showAmount"
            :details="item.details"
            :disable="!state.showAmount"
            @update:model-value="item.label === '教育分潤' && (state.educationSharingExpand = $event)"
          >
            <template
              v-if="!state.showAmount"
              #tooltip
            >
              <QTooltip v-if="!state.showAmount">為保護您的隱私，請開啟眼睛以查看薪資詳情。</QTooltip>
            </template>

            <template v-if="item.label === '教育分潤'" #body>
              <div v-if="state.educationSharingExpand" class="table-wrapper">
                <Table
                  :columns="therapistSalaryStore.educationSharingTable.columns"
                  :rows="therapistSalaryStore.educationSharingTable.rows"
                />
                <OrganizationChart
                  :data="therapistSalaryStore.educationSharingRelationship"
                />
              </div>
            </template>
            <template v-else-if="item.label === '推薦獎金'" #body>
              <div class="table-wrapper">
                <Table
                  :columns="therapistSalaryStore.recommendationBonusTable.columns"
                  :rows="therapistSalaryStore.recommendationBonusTable.rows"
                />
              </div>
            </template>
            <template v-else-if="item.label === '職務獎金' && RoleType[userStore.role] === '院長'" #body>
              <div class="table-wrapper">
                <div class="caption--position">
                  <QIcon name="o_info" size="20px" />
                  <span>$10,000 或 營收 1% 擇優發放。</span>
                </div>
                <Table
                  :columns="therapistSalaryStore.positionBonusTable.columns"
                  :rows="therapistSalaryStore.positionBonusTable.rows"
                >
                  <template
                    #body-cell="props"
                  >
                    <QTd :props="props">
                      <template v-if="props.row.performanceTarget === '狀態'">
                        <template v-if="props.value === '狀態'">
                          狀態
                        </template>
                        <template v-else>
                          <span
                            :class="[props.value ? 'text-forest' : 'text-warning']"
                          >{{ props.value ? '達成' : '未達成' }}</span>
                        </template>
                      </template>
                      <template v-else>
                        {{ props.value }}
                      </template>
                    </QTd>
                  </template>
                </Table>
              </div>
            </template>
            <template v-if="item.label === '執行時段應發總金額'" #row-0>
              <div class="caption">
                <QIcon name="o_info" size="20px" />
                <span>由「本薪」或「總執行數 * 單價」擇優發放。</span>
              </div>
            </template>
            <template v-else-if="item.label === '外派獎金'" #row-1>
              <RouterLink :to="{ name: 'relocationBonus' }" class="anchor">查看外派獎金列表</RouterLink>
            </template>
            <template v-else-if="item.label === '寫作津貼'" #row-1>
              <RouterLink :to="{ name: 'writingAllowance' }" class="anchor">查看寫作津貼列表</RouterLink>
            </template>
            <template v-else-if="item.label === '支援獎金'" #row-1>
              <RouterLink :to="{ name: 'supportBonus' }" class="anchor">查看支援獎金列表</RouterLink>
            </template>
          </ExpansionItem>
        </template>
      </QList>
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
.amount-caption {
  display: flex;
  align-items: center;
  gap: 8px;

  > p {
    @include text-style($body-large, $on-surface-variant);
  }
}

.table-wrapper {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.caption {
  display: flex;
  gap: 8px;
  align-items: center;
  color: $on-surface-variant;
  span {
    @include text-style($body-large, $on-surface-variant);
  }

  &--position {
    @extend .caption;
    border-bottom: 1px solid $outline-variant;
    padding: 12px;
  }
}

.anchor {
  @include text-style($body-large, $primary);
}

:deep(.q-item__label) {
  @include text-style($title-small, $on-surface);
}

:global(.q-tooltip) {
  background-color: $inverse-surface;
  @include text-style($body-small, $inverse-on-surface);
}
</style>
