import NextAuth from "next-auth/next";  // นำเข้า NextAuth สำหรับการจัดการการยืนยันตัวตน
import CredentialsProvider from "next-auth/providers/credentials";  // ใช้ Provider สำหรับการเข้าสู่ระบบด้วยข้อมูลที่ผู้ใช้กรอกเอง
import { connectMongoDB } from "../../../../../lib/mongodb";  // ฟังก์ชันเชื่อมต่อกับ MongoDB
import User from "../../../../../models/user";  // โมเดลของผู้ใช้ใน MongoDB

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",  // ชื่อของ Provider นี้
      credentials: {
        name: { label: "Username", type: "text" },  // ฟิลด์สำหรับชื่อผู้ใช้
        posonal_number: { label: "Posonal Number", type: "password" }  // ฟิลด์สำหรับรหัสผ่าน (posonal_number)
      },
      async authorize(credentials) {  // ฟังก์ชันที่ใช้ตรวจสอบข้อมูลที่กรอก
        const { name, posonal_number } = credentials;

        // ตรวจสอบว่ามีการกรอกข้อมูลครบถ้วนหรือไม่
        if (!name || !posonal_number) {
          console.error("Username or posonal_number is missing");  // ถ้าไม่ครบถ้วนจะแสดงข้อความผิดพลาด
          return null;
        }

        try {
          await connectMongoDB();  // เชื่อมต่อกับ MongoDB

          // ค้นหาผู้ใช้จากชื่อผู้ใช้ในฐานข้อมูล
          const user = await User.findOne({ name });

          // ถ้าผู้ใช้ไม่พบ ให้คืนค่า null
          if (!user) {
            console.error("User not found");
            return null;
          }

          // ตรวจสอบว่าในฐานข้อมูลมี posonal_number หรือไม่
          if (!user.posonal_number) {
            console.error("Posonal number missing in database");
            return null;
          }

          // ตรวจสอบว่ารหัสผ่านที่กรอกตรงกับที่เก็บในฐานข้อมูลหรือไม่
          if (posonal_number !== user.posonal_number) {
            console.error("Invalid posonal_number");
            return null;
          }

          // คืนค่าข้อมูลผู้ใช้ที่ผ่านการยืนยันตัวตนแล้ว
          return {
            id: user._id,
            name: user.name,
            role: user.role,
            user_type: user.user_type,
          };
        } catch (error) {
          console.error("Authentication error:", error);  // แสดงข้อผิดพลาดในการยืนยันตัวตน
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",  // ใช้ JWT ในการจัดการ session
  },
  secret: process.env.NEXTAUTH_SECRET,  // รหัสลับสำหรับการเข้ารหัส session
  pages: {
    signIn: "/login",  // กำหนดหน้าที่ใช้สำหรับการเข้าสู่ระบบ
    signOut: "/",  // กำหนดหน้าที่ใช้สำหรับการออกจากระบบ
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // ถ้ามีผู้ใช้ ให้เพิ่มข้อมูลผู้ใช้ใน token
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
      // เพิ่มข้อมูลจาก token เข้าไปใน session
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
        // ถ้าออกจากระบบให้รีไดเรคไปที่หน้าหลัก
        return baseUrl;
      }
      // รีไดเรคไปที่ URL ที่ผู้ใช้ต้องการ (หาก URL นั้นไม่ตรงกับ baseUrl)
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);  // สร้าง handler สำหรับ NextAuth

export { handler as GET, handler as POST };  // ส่งออก handler สำหรับคำขอ GET และ POST
