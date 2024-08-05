<script setup lang="ts">
import { computed, ref } from 'vue';
import { addMemo, getMemos, replyMemo } from '@/api';
import type { ClientScheduleDetail, Memo } from '@/api';
import { ShiftType, TherapyTypes } from '@/const/general';
import { useUserStore } from '@/stores';

const props = defineProps<{
  scheduleId: number;
  scheduleDetail: ClientScheduleDetail;
}>();

const userStore = useUserStore();

const memoLogs = ref<Memo[]>([]);
const newMessage = ref('');
const messageTo = ref(ShiftType['物理治療門診']);
const messageFrom = computed(() => ({
  shiftId: props.scheduleDetail?.userShift?.id ?? '',
  shiftType: props.scheduleDetail?.userShift?.type ?? ShiftType['物理治療門診'],
  person: userStore.userInfo?.name ?? '', // to confirmed, use login account
}));
const clientId = computed(() => props.scheduleDetail?.clientId);

const targetMemoId = ref();
const sessionDetail = computed(() => memoLogs.value.find(memo => memo.id === targetMemoId.value)!);

async function addNewMemo() {
  if (!clientId.value)
    return;

  await addMemo(clientId.value, { clientScheduleId: props.scheduleId, content: newMessage.value, toUserShiftType: messageTo.value });
  getData();
}

const replyMsg = ref('');
async function addMemoReply() {
  if (!clientId.value)
    return;

  await replyMemo(
    { clientId: clientId.value, memoId: targetMemoId.value },
    { clientScheduleId: props.scheduleId, replyContent: replyMsg.value },
  );
  replyMsg.value = '';
  getData();
}

const typeOptions = Object.values(TherapyTypes).map((item, idx) => ({
  label: item,
  value: idx + 1,
}));

// entry
getData();
async function getData() {
  if (!clientId.value)
    return;
  const data = await getMemos(clientId.value);
  memoLogs.value = data;
}
</script>

<template>
  <div class="page">
    <section class="memo_log">
      <template v-if="memoLogs?.length > 0">
        <ul class="memo_log_list">
          <li v-for="session in memoLogs" :key="session.id" class="session" :class="{ active: session.id === targetMemoId }">
            <div class="col q-pa-sm q-bb-md">
              <div class="flex items-center">
                <QIcon name="reply" />
                <span class="q-ml-sm text-weight-medium text-h6">{{ ShiftType[session.toUserShiftType] }}</span>
              </div>
              <span class="date">
                {{ session.createdAt }}
              </span>
            </div>
            <div class="col q-pa-sm">
              <div class="messenger_container">
                <QIcon name="account_circle" size="30px" />
                <span>{{ session.fromUser?.name }} / </span>
                <span>{{ ShiftType[session.fromUserShiftType] }}</span>
              </div>
              <div @click="(targetMemoId = session.id), (messageTo = session.toUserShiftType)">
                <QBtn flat size="sm" icon="forum" padding="8px">
                  <span class="response">{{ session.reply.length }}</span>
                </QBtn>
              </div>
            </div>
            <div class="col q-pa-md">
              <p class="note">
                {{ session.content }}
              </p>
            </div>
          </li>
        </ul>
        <aside class="memo_log_reply" :class="{ show: targetMemoId && sessionDetail }">
          <div class="close" @click="targetMemoId = null">
            <QBtn round size="sm" flat icon="cancel" />
          </div>
          <QList v-if="sessionDetail?.reply?.length > 0" class="reply_list">
            <template v-for="(replyContent, idx) in sessionDetail.reply" :key="idx">
              <QItem class="q-pa-xs">
                <QItemSection>
                  <div class="messenger_container">
                    <QIcon name="account_circle" size="30px" />
                    <span>{{ replyContent.fromUser?.name }} / </span>
                    <span>{{ ShiftType[replyContent.fromUserShiftType] }}</span>
                  </div>
                  <QItemLabel caption class="q-py-md q-px-sm">
                    {{ replyContent.content }}
                  </QItemLabel>
                </QItemSection>

                <QItemSection side top>
                  <QItemLabel caption>
                    {{ replyContent?.createdAt ?? '2024-04-25' }}
                  </QItemLabel>
                </QItemSection>
              </QItem>
              <QSeparator spaced inset class="q-ma-xs" />
            </template>
          </QList>

          <div class="reponse_input">
            <QInput
              v-model="replyMsg"
              filled
              autogrow
            >
              <template #append>
                <QBtn label="留言" color="primary" :disable="!replyMsg || !messageTo" @click="addMemoReply" />
              </template>
            </QInput>
          </div>
          <div />
        </aside>
      </template>
      <template v-else>
        <div class="flex justify-center items-center full-width">
          尚無 memo 資料
        </div>
      </template>
    </section>

    <div class="memo_comment">
      <div class="row q-mb-md items-center">
        <div class="messenger_container">
          <QIcon name="account_circle" size="30px" />
          <span>{{ messageFrom.person }} / </span>
          <span>{{ ShiftType[messageFrom.shiftType] }}</span>
        </div>
        <QSpace />
        <div class="flex items-center ">
          <span>留言給：</span>
          <QSelect
            v-model="messageTo"
            :options="typeOptions"
            dense
            emit-value
            map-options
            outlined
          />
        </div>
      </div>
      <div>
        <QInput
          v-model="newMessage"
          filled
          autogrow
        >
          <template #after>
            <QBtn label="送出" color="primary" :disable="!newMessage || !messageTo" @click="addNewMemo" />
          </template>
        </QInput>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.memo_comment {
  flex: 0;
  padding: 10px 0;
}
.memo_log {
  // border: 1px solid black;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  height: 100%;
  overflow: hidden;
  &_list {
    flex: 1;
    overflow: auto;
    .session {
      border: 1px solid black;

      &:hover {
        // box-shadow: 0 3px 15px 3px rgba(51, 51, 51, 0.5);
        // box-shadow: 0px 4px 10px 0px #00000040;
        // box-shadow: -10px 1px 6px 0 rgba(0, 0, 0, 0.2);
        // border-color: black;
        // border: 0 0 1px 1px;
      }
      &.active {
        background: #e7f1ff;
      }
      .col {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &.note {
          background: lightgray;
        }
        .date {
          font-size: 14px;
          font-weight: 500;
        }
      }
      .response {
        margin-left: 8px;
        font-size: 16px;
      }
    }
  }

  &_reply {
    width: 0;
    flex: 0 1 0;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    overflow: auto;
    &.show {
      width: 40%;
      flex: 0 1 40%;
      transition: all 0.3s ease;
      padding: 10px;
      border: 1px solid black;
      overflow: auto;
    }
    .close {
      text-align: right;
    }
    .reponse_input {
      margin-top: auto;
      padding-top: 16px;
    }
    .reply_list {
      overflow: auto;
      flex: 1;
    }
  }
}

.messenger_container {
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 6px;
  }
}
</style>
