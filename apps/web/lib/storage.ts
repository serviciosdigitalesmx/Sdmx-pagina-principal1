import { supabase } from './supabase';
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage.from('recepcion').upload(`${folder}/${fileName}`, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('recepcion').getPublicUrl(`${folder}/${fileName}`);
  return publicUrl;
}
