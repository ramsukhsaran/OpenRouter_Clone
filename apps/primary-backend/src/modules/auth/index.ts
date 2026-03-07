import { Elysia } from "elysia";
import { AuthModel } from "./models";
import { AuthService } from "./service";

import jwt from "@elysiajs/jwt";

export const auth = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name:'jwt',
      secret:process.env.JWT_SECRET!,
    })
  )
  .post(
    "/signup",
    async ({ body, status }) => {
      try {
        const userid = await AuthService.signUp(body.email, body.password);
        return {
          id: userid,
        };
      } catch (error) {
        console.log("Error in signup", error);
        return status(400, {
          message: "Error in signup",
        });
      }
    },
    {
      body: AuthModel.signUpSchema,
      response: {
        200: AuthModel.signUpResponseSchema,
        400: AuthModel.signUpfailedResponseSchema,
      },
    },
  )
  .post(
    "/signin",
    async ({ jwt, body, cookie: { auth }, status }) => {
      const { correctDetails, userId } = await AuthService.signIn(body.email, body.password);
      if (correctDetails && userId) {
        const value = await jwt.sign({ userId })
        auth.set({
          value,
          httpOnly: true,
          maxAge: 60 * 60 * 24, // 1 day
        })

        return {
          message: "SignIn successful"
        }
      } else {
        return status(400, {
          message: "Invalid email or password"
        })
      }
    },
    {
      body: AuthModel.signInSchema,
      response: {
        200: AuthModel.signInResponseSchema,
        400: AuthModel.signInFailedResponseSchema
      },
    },
  );
