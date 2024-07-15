<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { GroupShiftCard, GroupShiftEditor } from '@/components/shift';
import { useShiftStore } from '@/stores';
import { storeToRefs } from 'pinia';
import type { GroupShiftTemplatePayload } from '@/api';
import { createGroupShiftTemplate, deleteGroupShiftTemplate } from '@/api';

const shiftStore = useShiftStore();
const { groupShiftTemplates } = storeToRefs(shiftStore);
const { getGroupShiftTemplates } = shiftStore;
const $q = useQuasar();
const isGroupShiftEditorOpen = ref(false);

getGroupShiftTemplates();

async function onDelete(id: number) {
  $q.dialog({
    title: '確認刪除',
    message: '是否要刪除此筆班別?',
  }).onOk(async () => {
    await deleteGroupShiftTemplate(id);
    await getGroupShiftTemplates();
  });
}

async function createShift(data: Omit<GroupShiftTemplatePayload, 'color'>) {
  try {
    await createGroupShiftTemplate({ ...data, color: '#88F2D8' });
    await getGroupShiftTemplates();
    isGroupShiftEditorOpen.value = false;
  }
  catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <main class="shift">
    <div class="shift__header row justify-between items-center gutter">
      <h2 class="text-h6">
        團課列表
      </h2>
      <QBtn label="新增" icon="add" outline @click="isGroupShiftEditorOpen = true" />
      <QDialog v-model="isGroupShiftEditorOpen" persistent>
        <GroupShiftEditor @confirm="createShift" />
      </QDialog>
    </div>
    <div class="shift__body column q-gutter-sm">
      <GroupShiftCard
        v-for="shift in groupShiftTemplates"
        :key="shift.id"
        :data="shift"
        flat
        style="border: 1px solid #79747E;"
        @delete="onDelete"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>

</style>
