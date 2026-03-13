import Elysia, { t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { ApiKeyModel } from "./models";
import {ApiKeyService} from "./service"
export const app = new Elysia({ prefix: "api-keys" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .resolve(async ({ cookie: { auth }, status, jwt }) => {
    if (!auth) return status(401);

    const decode = await jwt.verify(auth.value as string);
    if (!decode) return status(401);
    return {
      userId: decode.userId as string,
    };
  }) // middleware in Elysia is resolved before the route handlers, so you can perform any necessary setup or checks here
  .post("/", async ({ userId, body }) => {
        const { apiKey, id } = await ApiKeyService.createApiKey(body.name, Number(userId))
        return {
            id,
            apiKey
        }
    }, {
        body: ApiKeyModel.createApikeySchema,
        response: {
            200: ApiKeyModel.createApiKeyResponse
        }
    })
   .get("/", async ({ userId }) => {
        const apiKeys = await ApiKeyService.getApiKeys(Number(userId));
        // Map DB fields to response schema fields
        return apiKeys.map((key: any) => ({
            name: key.name,
            apiKey: key.apiKey,
            lastUsed: key.lastUsed ? key.lastUsed.toISOString() : "",
            creditConsumed: key.creditConsumed ?? 0
        }))
    }, {
        response: {
            200: t.Array(ApiKeyModel.getApiKeysResponseSchema)
        }
    })
  .post("/disable", () => {})
  .delete("/:id", () => {});
