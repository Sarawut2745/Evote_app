import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        name: { label: "Username", type: "text" },
        posonal_number: { label: "Posonal Number", type: "password" }
      },
      async authorize(credentials) {
        const { name, posonal_number } = credentials;

        // ตรวจสอบว่า credentials ถูกส่งมาอย่างถูกต้องหรือไม่
        if (!name || !posonal_number) {
          console.error("Username or posonal_number is missing");
          return null;
        }

        try {
          await connectMongoDB();

          // ค้นหาผู้ใช้จากชื่อ
          const user = await User.findOne({ name });

          // ถ้าหากไม่พบผู้ใช้ ให้คืนค่า null
          if (!user) {
            console.error("User not found");
            return null;
          }

          // ตรวจสอบว่ามี posonal_number ในฐานข้อมูล
          if (!user.posonal_number) {
            console.error("Posonal number missing in database");
            return null;
          }

          // ตรวจสอบว่า posonal_number ตรงกับที่ฐานข้อมูลหรือไม่
          if (posonal_number !== user.posonal_number) {
            console.error("Invalid posonal_number");
            return null;
          }

          // คืนค่าข้อมูลผู้ใช้
          return {
            id: user._id,
            name: user.name,
            role: user.role,
            user_type: user.user_type,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          user_type: user.user_type,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          user_type: token.user_type,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      if (url === "/api/auth/signout") {
        return baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
