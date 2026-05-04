-- WCC Storage Buckets
-- 動画ファイルの格納と署名付き URL 配信: docs/WCC_ARCHITECTURE.md セクション 7.3 に基づく
--
-- deliveries バケット:
--   - private (公開 URL なし)
--   - 運営者がアップロード、署名付き URL で顧客に配信 (有効期限付き)

insert into storage.buckets (id, name, public)
values ('deliveries', 'deliveries', false)
on conflict (id) do nothing;

-- 運営者: アップロード・更新・削除
create policy "operator_upload_deliveries"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'deliveries');

create policy "operator_update_deliveries"
  on storage.objects for update to authenticated
  using (bucket_id = 'deliveries');

create policy "operator_delete_deliveries"
  on storage.objects for delete to authenticated
  using (bucket_id = 'deliveries');

-- 運営者: 読み取り (署名付き URL 生成のために必要)
create policy "operator_read_deliveries"
  on storage.objects for select to authenticated
  using (bucket_id = 'deliveries');
