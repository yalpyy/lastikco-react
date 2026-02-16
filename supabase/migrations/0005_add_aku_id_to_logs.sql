-- logs tablosuna aku_id kolonu eklenmesi
-- Akü işlemlerinin de geçmiş/log takibi yapılabilmesi için

alter table public.logs
    add column if not exists aku_id bigint references public.aku(id) on delete set null;

create index if not exists idx_logs_aku on public.logs (aku_id);

comment on column public.logs.aku_id is 'İlişkili akü. NULL = akü ile ilgili değil.';
