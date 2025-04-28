import { api } from '@/utils/api';

// 薪資報表
export interface SalaryReportParams {
  yearMonth: string;
  spaceIds: number[];
}
export async function exportSalaryReport(params: SalaryReportParams) {
  const response = await api.get(`reports/salary-report`, { params, headers: { responseType: 'blob', Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } });

  const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '薪資報表');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// 測試匯出
export async function exporReportTest() {
  const { data } = await api.get(`reports/testing-export-excel`);
  return data;
}
