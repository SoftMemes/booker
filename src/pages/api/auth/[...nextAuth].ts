import NextAuth from 'next-auth'
import { OAuthConfig } from 'next-auth/providers/oauth'

const notionProvider: OAuthConfig<any> = {
  id: 'notion',
  name: 'Notion',
  type: 'oauth',
  authorization: process.env.NOTION_AUTH_URL,
  clientId: process.env.NOTION_CLIENT_ID,
  clientSecret: process.env.NOTION_CLIENT_SECRET,
  requestTokenUrl: 'https://api.notion.com/v1/oauth/token',
  idToken: true,
  checks: ['pkce', 'state'],
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    }
  },
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [notionProvider],
}

export default NextAuth(authOptions)
