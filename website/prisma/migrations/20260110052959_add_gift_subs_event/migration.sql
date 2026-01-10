-- CreateTable
CREATE TABLE "twitch_resubs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channelId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "subscriberName" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "message" TEXT,
    "cumulativeMonths" INTEGER NOT NULL,
    "streakMonths" INTEGER,
    "durationMonths" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitch_resubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitch_gift_subs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channelId" TEXT NOT NULL,
    "gifterId" TEXT,
    "gifterName" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "tier" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "cumulativeTotal" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitch_gift_subs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "twitch_resubs_channelId_idx" ON "twitch_resubs"("channelId");

-- CreateIndex
CREATE INDEX "twitch_resubs_createdAt_idx" ON "twitch_resubs"("createdAt");

-- CreateIndex
CREATE INDEX "twitch_gift_subs_channelId_idx" ON "twitch_gift_subs"("channelId");

-- CreateIndex
CREATE INDEX "twitch_gift_subs_createdAt_idx" ON "twitch_gift_subs"("createdAt");
