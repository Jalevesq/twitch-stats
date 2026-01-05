'use server'

import {TwitchUserCreateInput} from "@/app/_generated/prisma/models/TwitchUser";
import prisma from "@/lib/prisma";

export async function exchangeTwitchToken(code: string): Promise< { user?: Pick<TwitchUserCreateInput, 'id' | 'login' | 'displayName' | 'profileImage'> }> {
  const tokenResponse = await getToken(code);
  const tokenData = await tokenResponse.json()

  const userResponse = await getUser(tokenData.access_token)
  const userData = await userResponse.json()
  const user = userData.data[0]

  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)

  await saveUserInDb(user, tokenData, expiresAt)
  console.log(`Tokens saved for user: ${user.login} (${user.id})`)

  return {
      user: {
          id: user.id,
          login: user.login,
          displayName: user.display_name,
          profileImage: user.profile_image_url,
      },
  }
}

async function getToken(code: string) {
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.TWITCH_CLIENT_ID!,
            client_secret: process.env.TWITCH_CLIENT_SECRET!,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.TWITCH_REDIRECT_URI!,
        }),
    })

    if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json()
        console.error('Twitch token exchange failed:', errorData)
        throw new Error('Twitch token exchange failed')
    }
    return tokenResponse;
}

async function getUser(accessToken: string) {
    const userResponse = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': process.env.TWITCH_CLIENT_ID || '',
        },
    })

    if (!userResponse.ok) {
        throw new Error('Failed to fetch user info')
    }

    return userResponse;
}

async function saveUserInDb(user, tokenData, expiresAt: Date) {
    await prisma.twitchUser.upsert({
        where: {
            id: user.id,
        },
        update: {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresAt: expiresAt,
            scope: Array.isArray(tokenData.scope) ? tokenData.scope.join(' ') : tokenData.scope,
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
            scope: Array.isArray(tokenData.scope) ? tokenData.scope.join(' ') : tokenData.scope,
            login: user.login,
            displayName: user.display_name,
            profileImage: user.profile_image_url,
        },
    })
}