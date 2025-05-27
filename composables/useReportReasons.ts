import { useState, useAsyncData } from '#app';
import type { ReportReason } from '~/types/types';

export function useReportReasons() {
  // useState zapewnia współdzielenie stanu między wszystkimi komponentami
  const reasons = useState<ReportReason[]>('report-reasons', () => []);

  // useAsyncData pobiera dane tylko raz (cache na serwerze i kliencie)
  const { pending, error } = useAsyncData('reports-topics', async () => {
    if (reasons.value.length) return reasons.value; // już pobrane
    const { postReason } = await useFetchWithAuth<{ postReason: ReportReason[] }>('/reports/reason', {
      params: { reason: 'post' }
    });
    reasons.value = postReason || [];
    return reasons.value;
  });

  return { reasons, pending, error };
}
