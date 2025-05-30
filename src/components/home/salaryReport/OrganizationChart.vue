<script setup lang="ts">
import ApexTree from 'apextree';
import { nextTick, onMounted } from 'vue';

interface Data {
  content: {
    label: string;
    caption: string;
  };
  children?: Data[];
}

const props = defineProps<{
  data: Data;
}>();

const options = {
  nodeWidth: 220,
  nodeHeight: 60,
  childrenSpacing: 56,
  siblingSpacing: 24,
  direction: 'left',
  borderRadius: '8px',
  contentKey: 'content',
  borderColor: 'transparent',
  highlightOnHover: false,

  nodeTemplate: (content: Data['content']) => {
    return `<div class="node">
      <div class="node__label">${content.label}</div>
      <div class="node__caption">${content.caption}</div>
    </div>`;
  },
};

onMounted(async () => {
  // This component is placed inside an expansion-item that is collapsed by default.
  // We wait for the expansion-item to be opened before rendering the SVG,
  // ensuring there's enough space available for proper SVG rendering.
  await nextTick();

  const svgTreeEl = document.getElementById('svg-tree')!;

  const tree = new ApexTree(svgTreeEl, options);
  tree.render(props.data);

  // const nodeEls = document.querySelectorAll('.node__label')!;
  // const maxNodeWidth = [...nodeEls].reduce((acc, item) => {
  //   return item.clientWidth > acc
  //     ? acc += item.clientWidth
  //     : acc;
  // }, 0);

  // because of some restrictions of apexTree, we need to remove the first child and re-render again
  // the nodeWidth is fixed so we have to reset the nodeWidth
  // svgTreeEl.removeChild(svgTreeEl.firstChild!);
  // const newTree = new ApexTree(svgTreeEl, { ...options, nodeWidth: maxNodeWidth + 20 });
  // newTree.render(props.data);

  const svgEle = document.querySelector('#apexTreeWrapper > svg')!;

  // remove viewBox to ensure the svg to fit the container
  svgEle.removeAttribute('viewBox');

  // The g element is not aligned with the left edge of the SVG container,
  // so we apply a transform to adjust its position.
  const gEle = svgEle.querySelector('g')!;
  const distance = gEle.getBoundingClientRect().top - svgEle.getBoundingClientRect().top;
  gEle.setAttribute('transform', `translate(0, ${-distance})`);

  // Disable the default behavior that allows the SVG to be scrollable and zoomable.
  svgEle.addEventListener('wheel', (e) => {
    e.stopImmediatePropagation();
  }, { capture: true });

  // Disable the default behavior that allows the SVG to be scrollable and zoomable.
  svgEle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  }, { capture: true });

  // Resize the SVG to fit its container element.
  const gEleRect = gEle.getBoundingClientRect();
  svgEle.setAttribute('width', `${gEleRect.width}`);
  svgEle.setAttribute('height', `${gEleRect.height}`);
});
</script>

<template>
  <div id="svg-tree" />
</template>

<style lang="scss" scoped>
:deep(.node) {
  background-color: #e1e5ec;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
:deep(.node__label) {
  @include text-style($label-large-perminent, $on-surface);
}

:deep(.node__caption) {
  @include text-style($body-small, $on-surface-variant);
}
:deep(svg path) {
  stroke: #767680;
}
</style>
