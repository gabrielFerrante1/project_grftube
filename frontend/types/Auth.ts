import { User } from "./User";

export interface ApiDoLogin {
    user: User;
    refresh: string;
    access: string
}


export type ApiDoRegister = ApiDoLogin;

export interface ApiVerifyToken {
    user: User;
} 


export type ResponseGetUserServerSide = {
    jwt: string;
    user: User
}
