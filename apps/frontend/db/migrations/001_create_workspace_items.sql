BEGIN;

CREATE TABLE public.workspace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size BIGINT,
  status VARCHAR NOT NULL DEFAULT 'uploaded',
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX workspace_items_user_id_idx
  ON public.workspace_items (user_id);

CREATE INDEX workspace_items_status_idx
  ON public.workspace_items (status);

CREATE INDEX workspace_items_post_id_idx
  ON public.workspace_items (post_id);

COMMIT;
