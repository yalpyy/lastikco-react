import { AuthError, PostgrestError } from '@supabase/supabase-js';

export const mapSupabaseError = (error?: PostgrestError | AuthError | null) => {
  if (!error) return 'Bilinmeyen hata';

  if ('status' in error && error.status === 404) {
    return 'Kayıt bulunamadı.';
  }

  if (error.message?.toLowerCase().includes('invalid login')) {
    return 'E-posta veya şifre hatalı.';
  }

  if (error.message?.toLowerCase().includes('permission')) {
    return 'Bu işlem için yetkiniz yok.';
  }

  return error.message || 'Beklenmeyen bir Supabase hatası oluştu.';
};

export class UserFacingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserFacingError';
  }
}
