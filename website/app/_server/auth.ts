"use server";

import { cookies } from "next/headers";
import { TwitchUserCreateInput } from "@/app/_generated/prisma/models/TwitchUser";
import { createSession } from "@/app/_lib/session";
import prisma from "@/app/_lib/prisma";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const COOKIE_SESSION = "twitch_oauth_state";

export async function startTwitchOAuth() {
  const state = crypto.randomUUID();

  (await cookies()).set(COOKIE_SESSION, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  const params = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID!,
    redirect_uri: process.env.TWITCH_REDIRECT_URI!,
    response_type: "code",
    scope: process.env.TWITCH_SCOPES!,
    state,
  });

  return `https://id.twitch.tv/oauth2/authorize?${params}`;
}

export async function exchangeTwitchToken(
  code: string,
  state: string,
): Promise<{
  user?: Pick<
    TwitchUserCreateInput,
    "id" | "login" | "displayName" | "profileImage"
  >;
}> {
  const storedState = (await cookies()).get("twitch_oauth_state")?.value;
  (await cookies()).delete("twitch_oauth_state");
  if (!storedState || storedState !== state) {
    throw new Error("Invalid state");
  }

  const tokenResponse = await getToken(code);
  const tokenData = await tokenResponse.json();
  const userResponse = await getUser(tokenData.access_token);
  const userData = await userResponse.json();
  const user = userData.data[0];

  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

  await saveUserInDb(user, tokenData, expiresAt);
  console.log(`Account saved for user: ${user.login} (${user.id})`);

  await createSession(user.id);

  return {
    user: {
      id: user.id,
      login: user.login,
      displayName: user.display_name,
      profileImage: user.profile_image_url,
    },
  };
}

async function getToken(code: string) {
  const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: process.env.TWITCH_REDIRECT_URI!,
    }),
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json();
    console.error("Twitch token exchange failed:", errorData);
    throw new Error("Twitch token exchange failed");
  }
  return tokenResponse;
}

async function getUser(accessToken: string) {
  const userResponse = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID || "",
    },
  });

  if (!userResponse.ok) {
    throw new Error("Failed to fetch user info");
  }

  return userResponse;
}

export async function destroySession() {
  const sessionId = (await cookies()).get("session_id")?.value;

  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
  }

  (await cookies()).delete("session_id");
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
async function saveUserInDb(user, tokenData, expiresAt: Date) {
  await prisma.twitchUser.upsert({
    where: {
      id: user.id,
    },
    update: {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: expiresAt,
      scope: Array.isArray(tokenData.scope)
        ? tokenData.scope.join(" ")
        : tokenData.scope,
      login: user.login,
      displayName: user.display_name,
      profileImage: user.profile_image_url,
      updatedAt: new Date(),
    },
    create: {
      id: user.id,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: expiresAt,
      scope: Array.isArray(tokenData.scope)
        ? tokenData.scope.join(" ")
        : tokenData.scope,
      login: user.login,
      displayName: user.display_name,
      profileImage: user.profile_image_url,
    },
  });
}
