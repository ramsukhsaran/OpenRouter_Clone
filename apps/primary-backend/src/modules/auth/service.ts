import { prisma } from "db";
import {jwt} from "@elysiajs/jwt";

export abstract class AuthService {
  static async signUp(email: string, password: string): Promise<string> {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: await Bun.password.hash(password),
      },
    });

    return user.id.toString();
  }
  static async signIn(email: string, password: string): Promise<{correctDetails:boolean,userId?:string}> {
     const user = await prisma.user.findFirst({
        where:{email:email}
     })
     if(!user){
        return {correctDetails:false}
     }
     if(!await Bun.password.verify(password,user.password)){
        return {correctDetails:false}
     }
     return {correctDetails:true,userId:user.id.toString()}
  }
}
