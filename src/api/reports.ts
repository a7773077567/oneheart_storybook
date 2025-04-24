import { api } from '@/utils/api';

// 薪資報表
export interface SalaryReportParams {
  yearMonth: string;
  spaceIds: number[];
}
export async function exportSalaryReport(params: SalaryReportParams) {
  const { data } = await api.get(`reports/salary-report`, { params });
  return data;
}

// 測試匯出
export async function exporReportTest() {
  const { data } = await api.get(`reports/testing-export-excel`);
  return data;
}
