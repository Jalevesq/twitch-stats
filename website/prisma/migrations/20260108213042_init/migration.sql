-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitch_follows" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channelId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followerName" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitch_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitch_subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channelId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "subscriberName" TEXT NOT NULL,
    "isGift" BOOLEAN NOT NULL DEFAULT false,
    "gifterId" TEXT,
    "gifterName" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "tier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitch_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitch_cheers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channelId" TEXT NOT NULL,
    "cheererId" TEXT,
    "cheererName" TEXT,
    "bits" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitch_cheers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitch_streams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channelId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "streamType" TEXT,
    "startedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitch_streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitch_raids" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channelId" TEXT NOT NULL,
    "raiderId" TEXT NOT NULL,
    "raiderName" TEXT NOT NULL,
    "viewers" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitch_raids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitch_redemptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channelId" TEXT NOT NULL,
    "redeemerId" TEXT NOT NULL,
    "redeemerName" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "rewardTitle" TEXT NOT NULL,
    "rewardCost" INTEGER NOT NULL,
    "userInput" TEXT,
    "redeemedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitch_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitch_channel_updates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twitch_channel_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "twitch_follows_channelId_idx" ON "twitch_follows"("channelId");

-- CreateIndex
CREATE INDEX "twitch_follows_followedAt_idx" ON "twitch_follows"("followedAt");

-- CreateIndex
CREATE INDEX "twitch_subscriptions_channelId_idx" ON "twitch_subscriptions"("channelId");

-- CreateIndex
CREATE INDEX "twitch_subscriptions_createdAt_idx" ON "twitch_subscriptions"("createdAt");

-- CreateIndex
CREATE INDEX "twitch_cheers_channelId_idx" ON "twitch_cheers"("channelId");

-- CreateIndex
CREATE INDEX "twitch_cheers_createdAt_idx" ON "twitch_cheers"("createdAt");

-- CreateIndex
CREATE INDEX "twitch_streams_channelId_idx" ON "twitch_streams"("channelId");

-- CreateIndex
CREATE INDEX "twitch_streams_createdAt_idx" ON "twitch_streams"("createdAt");

-- CreateIndex
CREATE INDEX "twitch_raids_channelId_idx" ON "twitch_raids"("channelId");

-- CreateIndex
CREATE INDEX "twitch_raids_createdAt_idx" ON "twitch_raids"("createdAt");

-- CreateIndex
CREATE INDEX "twitch_redemptions_channelId_idx" ON "twitch_redemptions"("channelId");

-- CreateIndex
CREATE INDEX "twitch_redemptions_createdAt_idx" ON "twitch_redemptions"("createdAt");

-- CreateIndex
CREATE INDEX "twitch_channel_updates_channelId_idx" ON "twitch_channel_updates"("channelId");

-- CreateIndex
CREATE INDEX "twitch_channel_updates_createdAt_idx" ON "twitch_channel_updates"("createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
