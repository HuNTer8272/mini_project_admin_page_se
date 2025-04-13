import { NextResponse } from "next/server";
import { prisma } from "@/helper/db"; 

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    console.log(email, password);
    const user = await prisma.system_user.findUnique({
        where: { sys_email:email },
      });
    // const user = await prisma.system_user.findUnique({
    //     where: { sys_email:"hassaan9264@gmail.com", AND : {sys_pass   :"hassaan123"} },
    //   });
      

    console.log(user)
    if (!user) {
      return NextResponse.json({ error: "You are not a registered user" }, { status: 401 });
    }

    if(user.sys_pass !== password){
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    if (user.sys_role !== "ADMIN") {
      return NextResponse.json({ error: "You are not an admin" }, { status: 403 });
    }

    return NextResponse.json({ message: "Login successful", user }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
