import { RoleType } from '@/api/user';

export type PermissionEvents = 'READ_HANDOVER' | 'EDIT_COACH_OPERATION_TARGET' | 'VIEW_USER_SETTING';
type CanDo = Partial<{ readonly [key in PermissionEvents]: boolean }>;

export const RolePermissions: { [role in RoleType]: CanDo } = {
  [RoleType['系統管理者']]: {
    READ_HANDOVER: true,
    EDIT_COACH_OPERATION_TARGET: false,
    VIEW_USER_SETTING: true,
  },
  [RoleType['院長']]: {
    READ_HANDOVER: true,
    EDIT_COACH_OPERATION_TARGET: false,
    VIEW_USER_SETTING: true,
  },
  [RoleType['副院長']]: {
    READ_HANDOVER: true,
    EDIT_COACH_OPERATION_TARGET: false,
    VIEW_USER_SETTING: true,
  },
  [RoleType['店長']]: {
    READ_HANDOVER: true,
    EDIT_COACH_OPERATION_TARGET: true,
    VIEW_USER_SETTING: false,
  },
  [RoleType['副店長']]: {
    READ_HANDOVER: true,
    EDIT_COACH_OPERATION_TARGET: true,
    VIEW_USER_SETTING: false,
  },
  [RoleType['櫃檯']]: {
    READ_HANDOVER: true,
    EDIT_COACH_OPERATION_TARGET: false,
    VIEW_USER_SETTING: false,
  },
  [RoleType['教練組長']]: {
    READ_HANDOVER: false,
    EDIT_COACH_OPERATION_TARGET: true,
    VIEW_USER_SETTING: false,
  },
  [RoleType['教練']]: {
    READ_HANDOVER: false,
    EDIT_COACH_OPERATION_TARGET: false,
    VIEW_USER_SETTING: false,
  },
  [RoleType['物理治療師']]: {
    READ_HANDOVER: false,
    EDIT_COACH_OPERATION_TARGET: false,
    VIEW_USER_SETTING: false,
  },
  [RoleType['物理治療師組長']]: {
    READ_HANDOVER: false,
    EDIT_COACH_OPERATION_TARGET: false,
    VIEW_USER_SETTING: false,
  },
};
