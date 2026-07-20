import { supabaseAdmin } from '@white-label/database';

export async function userHasPermission(
  role: string | null | undefined,
  permission: string,
): Promise<boolean> {
  const [resource, action] = permission.split('.', 2);
  if (!role || !resource || !action) return false;

  const { data, error } = await supabaseAdmin
    .from('permissions')
    .select('id')
    .eq('role', role)
    .eq('resource', resource)
    .eq('action', action)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}
