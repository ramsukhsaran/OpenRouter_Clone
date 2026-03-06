

export abstract class AuthService {
    static async  signUp(email: string, password: string):Promise<string>{
          return "1234567890";
    }
    static async signIn(email: string, password: string):Promise<string>{
        return "toekn-746"
    }
}