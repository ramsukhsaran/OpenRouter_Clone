// Model define the data structure and validation for the request and response

import { t} from 'elysia'

export namespace AuthModel {
  export const signInSchema = t.Object({
        email: t.String(),
        password: t.String(),
    })
    export type SignInSchema = typeof signInSchema.static

  export  const signInResponseSchema = t.Object({
        message:t.Literal("SignIn successful"),
    })
    
    export const signInFailedResponseSchema = t.Object({
        message:t.Literal("Invalid email or password")
    })
    
    export type SignInResponseSchema = typeof signInResponseSchema.static
    export type SignInFailedResponseSchema = typeof signInFailedResponseSchema.static

   export const signUpSchema = t.Object({
        email: t.String(),
        password: t.String(),
    })
    export type SignUpSchema = typeof signUpSchema.static

   export const signUpResponseSchema = t.Object({
       id: t.String(),
    })
    export const signUpfailedResponseSchema = t.Object({
        message:t.Literal("Error in signup")
    })
    export type SignUpResponseSchema = typeof signUpResponseSchema.static
    export type SignUpfailedResponseSchema = typeof signUpfailedResponseSchema.static

}

