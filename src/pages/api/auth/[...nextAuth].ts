import NextAuth, { AuthOptions } from 'next-auth'
import { OAuthConfig } from 'next-auth/providers/oauth'

declare module 'next-auth/jwt' {
  export interface JWT {
    userId: string
    accessToken: string
  }
}

declare module 'next-auth' {
  export interface Session {
    userId: string
    accessToken: string
  }
}

const notionProvider: OAuthConfig<any> = {
  id: 'notion',
  name: 'Notion',
  type: 'oauth',
  authorization: process.env.NOTION_AUTH_URL,
  clientId: process.env.NOTION_CLIENT_ID,
  clientSecret: process.env.NOTION_CLIENT_SECRET,
  token: 'https://api.notion.com/v1/oauth/token',
  checks: ['pkce', 'state'],
  userinfo: {
    request: context => {
      const userDetails = (context.tokens as any).owner.user
      return {
        sub: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        picture: userDetails.avatar_url,
      }
    },
  },
  profile: profile => ({
    id: profile.sub,
    name: profile.name,
    email: profile.email,
    image: profile.picture,
  }),
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [notionProvider],
  session: { strategy: 'jwt', maxAge: 5 * 365 * 24 * 60 * 60 },
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      // Persist relevant bits of the Notion response on first login
      if (account) {
        token.accessToken = account.access_token as any
      }
      if (user) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token, user }) {
      // Enhance session object with custom Notion properties captured in JWT
      session.accessToken = token.accessToken
      session.userId = token.userId
      return session
    },
  },
}

export default NextAuth(authOptions)
