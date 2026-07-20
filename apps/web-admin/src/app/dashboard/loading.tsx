import { LoadingState } from '@/components/base/states';

export default function DashboardLoading() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <LoadingState label="Cargando módulo..." />
    </div>
  );
}
