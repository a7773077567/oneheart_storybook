<script setup lang='ts'>
// This is for UI component demo
// staging env only
import { QSeparator } from 'quasar';
import { ref } from 'vue';
import { OSearch } from '@/components/shared';

const list = ref([
  { label: '搜尋 OSearch', value: 'osearch' },
  { label: '搜尋', value: 'osearch' },
]);

const displayComponent = ref(list.value[0].value);
</script>

<template>
  <div class="column full-height q-pa-md">
    <h2 class="text-h5 q-mb-md">UI Library</h2>
    <QSelect v-model="displayComponent" outlined label="元件選單" emit-values map-options :options="list" />

    <QSeparator class="q-my-xl" />

    <div style="flex: 1">
      <section v-if="displayComponent === 'osearch'">
        <OSearch label="搜尋客戶姓名或手機號碼" />
      </section>
    </div>
  </div>
</template>
