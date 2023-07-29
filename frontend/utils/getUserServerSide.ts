import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { ApiVerifyToken, ResponseGetUserServerSide } from "../types/Auth";
import { User } from "../types/User";
import { api } from "./api";

export const getUserServerSide = async (ctx: GetServerSidePropsContext): Promise<ResponseGetUserServerSide | undefined> => {
    const token_access = getCookie('access', { req: ctx.req, res: ctx.res })

    if (!token_access) return undefined

    try {
        const verify: ApiVerifyToken = await api('auth/verify-token', 'get', '', token_access as string)

        return {
            jwt: token_access as string,
            user: verify.user
        }
    } catch (error) {
        return undefined
    }
}