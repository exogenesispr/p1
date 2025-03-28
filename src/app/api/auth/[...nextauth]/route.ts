import NextAuth, { NextAuthOptions } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID! as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                await connectDB();

                let dbUser = await User.findOne({ email: user.email })

                return dbUser?.role === 'admin'
            } catch (error) {
                console.error('Error during sign in: ', error);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = 'admin'
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/error',
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };



