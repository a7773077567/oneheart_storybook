import { Dialog } from 'quasar';
import { OConfirmDialog } from '@/components/shared';

export async function useDialog(dialogProps: InstanceType<typeof OConfirmDialog>['$props']) {
  const { onOk, onCancel, hide } = Dialog.create({
    component: OConfirmDialog,
    componentProps: {
      ...dialogProps,
      persistent: true,
    },
  });

  return { onOk, onCancel, hide }
  ;
}
