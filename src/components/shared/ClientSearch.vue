<script setup lang='ts' generic="T extends 'single' | 'multi'">
import { computed, ref } from 'vue';
import { type Client, fetchClients } from '@/api';

const props = withDefaults(defineProps<{
  // multiple?: T;
  mode: T;
}>(), {
  mode: () => 'single' as T,
});

defineEmits<{
  (e: 'select', clientInfo: (T extends 'single' ? Client[] : Client)): void;
  // (e: 'select', clientInfo: (typeof props['mode'] extends 'multi' ? Client[] : Client)): void;
  (e: 'cancel'): void;
}>();

const searchInput = ref('');
const resultList = ref<Client[]>([]);

const getSelectionInital = (mode: T): Client | Client[] => mode === 'single' ? {} as Client : [];
const selection = ref(getSelectionInital(props.mode));

async function searchClient() {
  const { data } = await fetchClients({ nameOrPhone: searchInput.value });
  resultList.value = data;
}

function handleSelect(client: Client) {
  switch (props.mode) {
    case 'multi':
      (selection.value as Client[]) = toggleSelection(client, selection.value as Client[]);
      return;
    case 'single':
    default:
      return (selection.value as Client) = client;
  }
}

function toggleSelection(newSelect: Client, ori: Client[]): Client[] {
  if (!ori)
    return [];

  const alreadySelect = ori?.map(client => client.id).includes(newSelect.id);
  if (alreadySelect) {
    return (ori as Client[])?.filter(s => s.id !== newSelect.id);
  }

  return [...ori ?? [], newSelect];
}

const selectionId = computed(() => {
  return props.mode === 'single' ? new Set([selection.value?.id]) : new Set(selection.value.map(c => c.id));
});
</script>

<template>
  <QCard class="q-pa-md client_search">
    <QCardSection>
      <div class="client_search_input">
        <QInput v-model="searchInput" outlined dense hide-bottom-space placeholder="請輸入客戶名稱或電話" clearable />
        <QBtn outline label="搜尋" :disabled="!searchInput" @click="searchClient" />
      </div>
    </QCardSection>
    <QCardSection class="client_search_result">
      <QList bordered separator>
        <QItem v-for="client in resultList" :key="client.id" clickable :class="{ selected: selectionId.has(client.id) }" @click="handleSelect(client)">
          <QItemSection>
            <QItemLabel>{{ client.name }}</QItemLabel>
            <QItemLabel caption>
              {{ client.phone }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </QCardSection>
    <QCardActions class="q-pa-sm justify-center">
      <QBtn label="選擇" color="black" :disable="!selection" @click="$emit('select', selection)" />
      <QBtn label="取消" @click="$emit('cancel')" />
    </QCardActions>
  </QCard>
</template>

<style scoped lang="scss">
.client_search {
  width: 600px;
  &_input {
    display: flex;
    gap: 8px;
    width: 100%;
    .q-field {
      flex: 1;
    }
  }
  &_result {
    height: 500px;
    .q-list {
      height: 100%;
      overflow: auto;
    }
    .selected {
      background: #ebebeb;
    }
  }
}
</style>
