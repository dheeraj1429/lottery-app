import NextAuth from 'next-auth/next';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
   pages: {
      signIn: '/auth/login',
   },
   session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
   },
   providers: [
      CredentialsProvider({
         name: 'credentials',
         credentials: {},

         async authorize(credentials) {
            const { email, password } = credentials as {
               email: string;
               password: string;
            };

            const response = await fetch(
               `${process.env.NEXT_APP_BACKEND_URL}/auth/signIn`,
               {
                  method: 'POST',
                  body: JSON.stringify({
                     email,
                     password,
                  }),
                  headers: {
                     'Content-type': 'application/json; charset=UTF-8',
                  },
               },
            );

            const data = await response.json();

            if (!data) throw new Error('Invalid credentials');

            if (!!data && !data?.success) {
               throw new Error(JSON.stringify(data));
            }

            return {
               id: data?._id,
               accessToken: data?.accessToken,
               email: data?.account?.email,
               avatar: data?.account?.avatar,
               _id: data?.account?._id,
            };
         },
      }),
   ],
   secret: process.env.NEXT_APP_SECRET,
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.id = user?.id;
            token.accessToken = user?.accessToken;
            token.email = user?.email;
            token.avatar = user?.avatar;
            token._id = user?._id;
         }
         return token;
      },
      async session({ session, token }) {
         if (token && session.user) {
            session.user.accessToken = token.accessToken;
            session.user.email = token.email;
            session.user.avatar = token.avatar;
            session.user._id = token._id;
         }

         return session;
      },
   },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
