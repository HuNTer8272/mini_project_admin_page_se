    import { PrismaClient } from "@prisma/client";
    export const prisma = new PrismaClient();

    const SystemUser = {
        sys_email:"hassaan9264@gmail.com",
        sys_pass:"hassaan123",
        sys_role:"ADMIN",
        sys_name:"hassaan"
    } 

    await prisma.system_user.create({
        data:SystemUser
    });

    const system_user = await prisma.system_user.findMany();
    console.log(system_user)

// const user = await prisma.system_user.findUnique({
//     where: { sys_email:"hassaan9264@gmail.com", AND : {sys_pass   :"hassaan123"} },
//   });

// console.log(user)

// const home_events = await prisma.event_page_events.findMany()
// console.log(home_events)