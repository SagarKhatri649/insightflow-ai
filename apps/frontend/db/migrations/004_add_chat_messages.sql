BEGIN;

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_item_id UUID NOT NULL
    REFERENCES public.workspace_items(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL,
  role VARCHAR NOT NULL
    CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX chat_messages_workspace_item_id_created_at_idx
  ON public.chat_messages (workspace_item_id, created_at);

COMMIT;
