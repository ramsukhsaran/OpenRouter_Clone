import { Elysia } from "elysia";
import {auth as authApp} from "./modules/auth";

const app = new Elysia().use(authApp).listen(4000);

console.log(
  `🦊 Elysia server is running at ${app.server?.hostname}:${app.server?.port}`
);

/* 
 auth =>signup, signin
 api-key=> create api key, get apikey, delete api-key, disable api-key
 model=> get all the supported models, get model details, provider etc
 payment => rzp/stripe
*/
