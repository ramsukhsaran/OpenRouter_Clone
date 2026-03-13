import {t} from 'elysia'

export namespace ApiKeyModel {
    export const createApikeySchema = t.Object({
       name:t.String()
    })
    
    export type createApikeySchema = typeof createApikeySchema.static
    export const createApiKeyResponse = t.Object({
        id:t.String(),
        apiKey:t.String(),
    })
    export type createApiKeyResponse = typeof createApiKeyResponse.static

    export const diableApiKeySchema = t.Object({
        id:t.String()
    })
    export const disableApiKeySchema = typeof diableApiKeySchema.static
    
    export const disableApiKeyResponseSchema = t.Object({
        message:t.Literal("Disabled api key successfully")
    })

    export type disableApiKeyResponseSchema = typeof disableApiKeyResponseSchema.static


    export const getApiKeysResponseSchema = t.Object({
        name:t.String(),
        apiKey:t.String(),
        lastUsed:t.String(),
        creditConsumed:t.Number(),
    })

    export type getApiKeysResponseSchema = typeof getApiKeysResponseSchema.static

    export const deleteApiKeyResponseSchema = t.Object({
        message: t.Literal("Api key deleted successfully")
    })

    export type deleteApiKeyResponseSchema = typeof deleteApiKeyResponseSchema.static;
}