import { Elysia } from 'elysia'
import { AuthModel } from './models'
import { AuthService } from './service'


export const auth = new Elysia({ prefix: '/auth' })
  .post(
    '/signup',
    async ({ body }) => {
      const userid = await AuthService.signUp(body.email, body.password);
      return {
        id: userid,
      };
    },
    {
      body: AuthModel.signUpSchema,
      response: {
        200: AuthModel.signUpResponseSchema,
        400: AuthModel.signUpfailedResponseSchema,
      },
    },
  )
  .post('/signin', async ({ body }) => {
    const token = await AuthService.signIn(body.email, body.password);
    return {
      token: token,
    };
  }, {
    body: AuthModel.signInSchema,
    response: {
      200: AuthModel.signInResponseSchema,
      400: AuthModel.signInfailedResponseSchema,
    },
  });