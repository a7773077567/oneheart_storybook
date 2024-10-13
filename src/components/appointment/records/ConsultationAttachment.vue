<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { ClientScheduleDetail } from '@/api';
import { updateClientSchedule } from '@/api';
import { useQuasar } from 'quasar';
import { useKonva } from '@/composables/konva';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

defineEmits<{
  (e: 'save'): void;
}>();

const $q = useQuasar();
const recordId = computed(() => props.scheduleDetail.medicalAndTrainingRecordId);
const initialValues = computed(() => props.scheduleDetail.record.canvasAttachment);

const container = ref();
const { init, importDrawing, save, mode } = useKonva();

onMounted(() => {
  if (initialValues.value && Object.keys(initialValues.value).length > 0) {
    importDrawing(initialValues.value);
  }
  else {
    init();
  }
});

async function handleSave() {
  const canvasJson = save();

  if (canvasJson) {
    await updateClientSchedule(recordId.value, { canvasAttachment: canvasJson });
    $q.notify({ message: '已存檔！', timeout: 2000 });
  }
}
</script>

<template>
  <div class="consultation_attachment">
    <div class="settings">
      <div class="canvas_tools">
        <QBtn
          round
          icon="o_edit"
          size="md"
          :color="mode === 'brush' ? 'primary' : 'white'"
          :text-color="mode === 'brush' ? 'white' : 'black'"
          @click="mode = 'brush'"
        />
        <QBtn
          round
          icon="auto_fix_normal"
          size="md"
          :color="mode === 'eraser' ? 'primary' : 'white'"
          :text-color="mode === 'eraser' ? 'white' : 'black'"
          @click="mode = 'eraser'"
        />
      </div>
      <QBtn label="儲存" style="width: 100px" @click="handleSave" />
    </div>
    <div id="container" ref="container" />
  </div>
</template>

<style lang="scss" scoped>
.consultation_attachment {
  width: 100%;
  height: 100%;
  .canvas_tools {
    .q-btn {
      margin: 0 6px;
    }
  }

  .settings {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    .save_btn {
      font-size: 20px;
    }
  }
}
</style>
