import { Dialog } from 'quasar';
import { OConfirmDialog } from '@/components/shared';
import { ref } from 'vue';

interface ConfirmParam {
  title: string;
  content: string;
  okLabel?: string;
  cancelLabel?: string;
}
export async function useConfirm({
  title,
  content,
}: ConfirmParam) {
  const modelValue = ref(true);
  const { onOk, onCancel, hide } = Dialog.create({
    component: OConfirmDialog,
    componentProps: {
      title,
      content,
      persistent: true,
      modelValue: modelValue.value,
    },
  });

  return { onOk, onCancel, hide }
  ;
}
