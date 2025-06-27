import type { RouteRecordRaw } from 'vue-router';
import type { PermissionEvents } from '@/const/permission';
import { useSalaryReportStore } from '@/stores';

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'home',
    redirect: { name: 'dashboard' },
    meta: {
      label: '首頁',
      requiredAuth: true,
      permission: true,
      icon: 'o_home',
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/home/Dashboard.vue'),
        meta: {
          label: '儀表板',
          requiredAuth: true,
        },
        children: [
          {
            path: 'traffic-light-overview/:userId-:userName',
            component: () => import('@/views/home/TrafficLightOverview.vue'),
            name: 'trafficLightOverview',
            props: true,
            meta: {
              label: '紅綠燈分數詳情',
              requiredAuth: true,
            },
          },
          {
            path: 'traffic-light-overview/referral-count/:userId-:userName',
            component: () => import('@/views/home/indicator/ReferralCountDetail.vue'),
            name: 'referralCountDetail',
            props: true,
            meta: {
              label: '轉介數計分詳情',
              requiredAuth: true,
            },
          },
          {
            path: 'traffic-light-overview/return-visit-rate/:userId-:userName',
            component: () => import('@/views/home/indicator/ReturnVisitRateDetail.vue'),
            name: 'returnVisitRateDetail',
            props: true,
            meta: {
              label: '回診率計分詳情',
              requiredAuth: true,
            },
          },
          {
            path: 'traffic-light-overview/execution-count/:userId-:userName',
            component: () => import('@/views/home/indicator/ExecutionCountDetail.vue'),
            name: 'executionCountDetail',
            props: true,
            meta: {
              label: '執行數計分詳情',
              requiredAuth: true,
            },
          },
          {
            path: 'traffic-light-overview/personal-revenue/:userId-:userName',
            component: () => import('@/views/home/indicator/PersonalRevenueDetail.vue'),
            name: 'personalRevenueDetail',
            props: true,
            meta: {
              label: '個人營業額計分詳情',
              requiredAuth: true,
            },
          },
          {
            path: 'traffic-light-overview/education-point/:userId-:userName',
            component: () => import('@/views/home/indicator/EducationPointDetail.vue'),
            name: 'educationPointDetail',
            props: true,
            meta: {
              label: '教育積分詳情',
              requiredAuth: true,
            },
          },
          {
            path: 'traffic-light-overview/google-comment-count/:userId-:userName',
            component: () => import('@/views/home/indicator/GoogleCommentCountDetail.vue'),
            name: 'googleCommentCountDetail',
            props: true,
            meta: {
              label: 'Google評論計分詳情',
              requiredAuth: true,
            },
          },
        ],
      },
      {
        path: 'salary-report',
        name: 'salary-report',
        component: () => import('@/views/home/salaryReport/Index.vue'),
        redirect: { name: 'salaryReportDetails' },
        meta: {
          label: '薪資詳情',
          requiredAuth: true,
          permissions: ['VIEW_THERAPIST_SALARY_REPORT'],
        },
        children: [
          {
            path: 'authentication',
            name: 'salaryReportAuthentication',
            component: () => import('@/views/home/salaryReport/Authentication.vue'),
            meta: {
              requiredAuth: true,
              permissions: ['VIEW_THERAPIST_SALARY_REPORT'],
            },
          },
          {
            path: 'details',
            name: 'salaryReportDetails',
            component: () => import('@/views/home/salaryReport/Details.vue'),
            meta: {
              requiredAuth: true,
              permissions: ['VIEW_THERAPIST_SALARY_REPORT'],
            },
            beforeEnter: () => {
              const salaryReportStore = useSalaryReportStore();
              if (salaryReportStore.isAuthenticated) {
                return;
              }
              return { name: 'salaryReportAuthentication' };
            },
          },
        ],
      },
      {
        path: '',
        name: 'personalAppointments',
        component: () => import('@/views/home/PersonalAppointmentsView.vue'),
        meta: {
          label: '個人預約列表',
          requiredAuth: true,
        },
      },
      {
        path: 'user-settings',
        component: () => import('@/views/home/UserSettingsView.vue'),
        name: 'userSettings',
        meta: {
          label: '個人設定',
          requiredAuth: true,
        },
      },
      {
        path: 'points-bonus-manage',
        name: 'pointsNBonus',
        component: () => import('@/views/home/pointsNBonus/Index.vue'),
        redirect: { name: 'googleReview' },
        meta: {
          label: '積分與獎金管理',
          requiredAuth: true,
          permissions: ['VIEW_POINTS_BONUS'],
        },
        children: [
          {
            path: 'google-review',
            name: 'googleReview',
            component: () => import('@/views/home/pointsNBonus/GoogleReviewView.vue'),
            meta: {
              label: 'Google評論管裡',
              requiredAuth: true,
              permissions: ['VIEW_GOOGLE_REVIEW'],
            },
          },
          {
            path: 'education-points',
            name: 'educationPoints',
            component: () => import('@/views/home/pointsNBonus/EducationPointsView.vue'),
            meta: {
              label: '教育積分管理',
              requiredAuth: true,
              permissions: ['READ_EDUCATION_REVIEW'] as PermissionEvents[],
            },
          },
          {
            path: 'relocation-bonus',
            name: 'relocationBonus',
            component: () => import('@/views/home/pointsNBonus/RelocationBonus.vue'),
            meta: {
              label: '外派獎金',
              requiredAuth: true,
              permissions: ['VIEW_RELOCATE_BONUS'] as PermissionEvents[],
            },
          },
          {
            path: 'writing-allowance',
            name: 'writingAllowance',
            component: () => import('@/views/home/pointsNBonus/WritingAllowance.vue'),
            meta: {
              label: '寫作津貼',
              requiredAuth: true,
              permissions: ['VIEW_RELOCATE_BONUS'] as PermissionEvents[],
            },
          },
          {
            path: 'training-allowance',
            name: 'trainingAllowance',
            component: () => import('@/views/home/pointsNBonus/TrainingAllowance.vue'),
            meta: {
              label: '培訓津貼',
              requiredAuth: true,
              permissions: ['VIEW_TRAINING_ALLOWANCE'] as PermissionEvents[],
            },
          },
          {
            path: 'support-bonus',
            name: 'supportBonus',
            component: () => import('@/views/home/pointsNBonus/SupportBonus.vue'),
            meta: {
              label: '支援獎金',
              requiredAuth: true,
              permissions: ['VIEW_TRAINING_ALLOWANCE'] as PermissionEvents[],
            },
          },
        ],
      },
      {
        path: 'bonus-issue',
        name: 'bonusIssue',
        component: () => import('@/views/bonus/BonusOverview.vue'),
        redirect: { name: 'coachQuarterBonus' },
        meta: {
          label: '獎金發放',
          requiredAuth: true,
          permissions: ['VIEW_BONUS_ISSUE'],
        },
        children: [
          {
            path: 'coach-quarter-bonus',
            name: 'coachQuarterBonus',
            component: () => import('@/views/bonus/CoachQuarterBonus.vue'),
            meta: {
              label: '教練季獎金',
              requiredAuth: true,
              permissions: ['VIEW_BONUS_ISSUE'],
            },
          },
        ],
      },
    ],
  },
];
