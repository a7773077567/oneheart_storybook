<script setup lang="ts">
import Konva from 'konva';
import { computed, onMounted, ref } from 'vue';
import type { ClientScheduleDetail } from '@/api';
import { updateClientSchedule } from '@/api';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

defineEmits<{
  (e: 'save'): void;
}>();

const recordId = computed(() => props.scheduleDetail.medicalAndTrainingRecordId);

const container = ref();
type Mode = 'brush' | 'eraser';
const mode = ref<Mode>('brush');

const { init, save } = createKonva();

onMounted(() => {
  init({ container: 'container', width: container.value.offsetWidth, height: container.value.offsetHeight });
});

function createKonva() {
  const stage = ref();
  const context = ref();
  const isPaint = ref(false);

  function init({ container, width, height }: { container: string; width?: number; height?: number }) {
    stage.value = new Konva.Stage({
      container,
      width,
      height,
    });
    const layer = new Konva.Layer();
    stage.value.add(layer);

    // then we are going to draw into special canvas element
    const canvas = document.createElement('canvas');
    canvas.width = stage.value.width();
    canvas.height = stage.value.height();

    // created canvas we can add to layer as "Konva.Image" element
    const konvaImage = new Konva.Image({
      image: canvas,
      x: 0,
      y: 0,
    });
    layer.add(konvaImage);

    context.value = canvas.getContext('2d');
    context.value!.strokeStyle = '#df4b26';
    context.value!.lineJoin = 'round';
    context.value!.lineWidth = 5;

    // background
    const img = new Image();
    img.src = ('/images/humanGraph.png');

    img.onload = function () {
      let background = new Konva.Rect({
        x: 0,
        y: 0,
        // width: stage.value.width(),
        // height: stage.value.height(),
        width: 874,
        height: 750,
        fillPatternImage: img,
        fillPatternRepeat: 'no-repeat',
        listening: false,
      });
      layer.add(background);
    };

    let lastPointerPosition = ref<Konva.Vector2d | null>(null);

    // now we need to bind some events
    // we need to start drawing on mousedown
    // and stop drawing on mouseup
    konvaImage.on('mousedown touchstart', () => {
      isPaint.value = true;
      lastPointerPosition.value = stage.value.getPointerPosition();
    });
    stage.value.on('mouseup touchend', () => {
      isPaint.value = false;
    });

    // and core function - drawing
    stage.value.on('mousemove touchmove', () => {
      if (!isPaint.value) {
        return;
      }

      if (mode.value === 'brush') {
        context.value!.globalCompositeOperation = 'source-over';
      }
      if (mode.value === 'eraser') {
        context.value!.globalCompositeOperation = 'destination-out';
      }
      context.value!.beginPath();

      let localPos = {
        x: lastPointerPosition.value!.x - konvaImage.x(),
        y: lastPointerPosition.value!.y - konvaImage.y(),
      };
      context.value.moveTo(localPos.x, localPos.y);
      let pos = stage.value.getPointerPosition();
      localPos = {
        x: pos.x - konvaImage.x(),
        y: pos.y - konvaImage.y(),
      };
      context.value.lineTo(localPos.x, localPos.y);
      context.value.closePath();
      context.value.stroke();

      lastPointerPosition.value = pos;
      // redraw manually
      layer.batchDraw();
    });
  }

  function save() {
    return stage.value.toJSON();
  }

  return { init, save };
}

function handleSave() {
  const canvasJson = save();
  // to fix
  updateClientSchedule(recordId.value, { attachments: canvasJson });
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
      <QIcon name="save" class="save_btn" @click="handleSave" />
    </div>
    <div id="container" ref="container" style="width:100%; height:100%" />
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
