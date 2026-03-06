// Model define the data structure and validation for the request and response

import { t} from 'elysia'

export namespace AuthModel {
  export const signInSchema = t.Object({
        email: t.String(),
        password: t.String(),
    })
    export type SignInSchema = typeof signInSchema.static

  export  const signInResponseSchema = t.Object({
       token: t.String(),
    })
    export const signInfailedResponseSchema = t.Object({
        message:t.Literal("Error in signIn")
    })
    export type SignInResponseSchema = typeof signInResponseSchema.static
    export type SignInfailedResponseSchema = typeof signInfailedResponseSchema.static

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

