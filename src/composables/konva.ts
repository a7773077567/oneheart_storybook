import Konva from 'konva';
import { ref } from 'vue';

export function useKonva() {
  let stage: Konva.Stage;
  let drawingLayer: Konva.Layer;
  let isDrawing = false;
  const mode = ref<'brush' | 'eraser'>('brush');

  function init() {
    stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight,
    });
    createDrawingLayer();
    createBgImg();
    bindDrawingEvent();
  }

  function importDrawing(json: any) {
    console.log(json);
    stage = Konva.Node.create(json, 'container');

    // 取得當前繪圖圖層
    const existedDrawingLayer = stage.findOne('.drawingLayer');
    if (existedDrawingLayer) {
      drawingLayer = existedDrawingLayer as Konva.Layer;
    }
    else {
      createDrawingLayer();
    }
    bindDrawingEvent();

    // 重置背景圖層
    let oriBgLayer = stage.findOne('.bgLayer');
    if (oriBgLayer) {
      oriBgLayer.destroy();
    }
    createBgImg();
  }

  function createDrawingLayer() {
    drawingLayer = new Konva.Layer({ name: 'drawingLayer' });
    stage.add(drawingLayer);
  }

  function bindDrawingEvent() {
    let lastLine: Konva.Line;

    function startDrawing() {
      isDrawing = true;
      const pos = stage.getPointerPosition() as Konva.Vector2d;
      lastLine = new Konva.Line({
        stroke: 'black',
        strokeWidth: mode.value === 'eraser' ? 15 : 5,
        points: [pos.x, pos.y],
        globalCompositeOperation: mode.value === 'eraser' ? 'destination-out' : 'source-over',
        name: mode.value === 'eraser' ? 'eraser' : 'brush',
      });
      drawingLayer.add(lastLine);
    }

    function continueDrawing() {
      if (!isDrawing) {
        return;
      }
      const pos = stage.getPointerPosition() as Konva.Vector2d;
      const newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);
      drawingLayer.batchDraw();
    }

    function endDrawing() {
      isDrawing = false;
    }

    if (stage) {
      stage.on('mousedown touchstart', startDrawing);
      stage.on('mousemove touchmove', continueDrawing);
      stage.on('mouseup touchend', endDrawing);
    }
  }

  function createBgImg() {
    let BgLayer = new Konva.Layer({ name: 'bgLayer' });
    const img = new Image();
    img.src = ('/images/humanGraph.png');

    img.onload = function () {
      let background = new Konva.Rect({
        name: 'humanGraphicBg',
        x: 0,
        y: 0,
        width: stage.width(),
        // height: stage.value.height(),
        // width: 874,
        height: 750,
        fillPatternImage: img,
        fillPatternRepeat: 'no-repeat',
        fillPatternX: (stage.width() - 874) / 2,
        fillPatternY: 20,
        listening: false,
      });

      BgLayer.add(background);
      stage.add(BgLayer);
    };
  }

  function save() {
    if (!stage)
      return;
    return stage.toJSON();
  }

  function resetLayer() {
    if (!stage)
      return;
    stage.destroyChildren();
  }

  return { init, importDrawing, createDrawingLayer, save, createBgImg, resetLayer, mode };
}
