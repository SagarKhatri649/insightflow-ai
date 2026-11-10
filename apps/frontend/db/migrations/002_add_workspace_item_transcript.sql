BEGIN;

ALTER TABLE public.workspace_items
ADD COLUMN transcript TEXT;

COMMIT;
