BEGIN;

ALTER TABLE public.workspace_items
ADD COLUMN summary TEXT;

COMMIT;
