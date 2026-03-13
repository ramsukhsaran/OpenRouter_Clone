import {prisma} from "db"

const API_KEY_LENGTH = 20;
const ALPHABET_SET = "zxcvbnmasdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP1234567890";

export abstract class ApiKeyService {
    static createRandomApiKey() {
        let suffixKey = "";
        for (let i = 0; i < API_KEY_LENGTH; i++) {
            suffixKey += ALPHABET_SET[Math.floor(Math.random() * ALPHABET_SET.length)]
        }
        return `sk-or-v1-${suffixKey}`
    }

    static async createApiKey(name:string,userId:number): Promise<{
        id: string,
        apiKey: string
    }> {

        const apiKey = ApiKeyService.createRandomApiKey();
        const apiKeyDb = await prisma.apiKey.create({
            data: {
                name, 
                apiKey,
                userId
            }
        })

        return {
            id: apiKeyDb.id.toString(),
            apiKey
        }
    }
}
