-- Persist the campaign audience source so a campaign can be sent later.
-- csvUrl: a reachable URL for the CSV (S3 or any host).
-- csvText: the raw CSV content, uploaded inline from the admin panel.
ALTER TABLE "campaigns" ADD COLUMN "csvUrl" TEXT;
ALTER TABLE "campaigns" ADD COLUMN "csvText" TEXT;

-- The template score now comes from Cloudflare CLEF instead of Laya.
ALTER TABLE "sms_templates" RENAME COLUMN "layaScore" TO "spamScore";
