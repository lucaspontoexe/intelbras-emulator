import { Context } from "@oak/oak";
import { generateSessionToken, makePWHash } from "./gen-session.ts";
import { LoginRequest, RPC2Response } from "./rpc2.d.ts";

const local_username = "ademir";
const local_password = "senha";

interface Session {
    username: string;
    random: string;
}
const sessions = new Map<string, Session>();

const validSessions = new Set<string>();

export async function LoginMiddleware(ctx: Context) {
    const session = generateSessionToken();
    const realm = "Login to INTELBRAS EMULATOR 2000";
    const random = crypto.randomUUID();

    const req_body: LoginRequest = await ctx.request.body.json();

    if (req_body.params.password === "") {
        // 1st login. store session etc
        sessions.set(session, { username: req_body.params.userName, random });

        const loginChallengeParams = { realm, random, encryption: "Default" };

        const response: RPC2Response<typeof loginChallengeParams> = {
            result: false,
            error: {
                "code": 268632079,
                "message": "Component error: login challenge!",
            },
            params: loginChallengeParams,
            id: req_body.id,
            // generate and store session
            session,
        };
        ctx.response.body = response;
        return;
    } else {
        // 2nd login. get session
        const session_vars = sessions.get(req_body.session!);
        if (typeof session_vars === "undefined") {
            ctx.response.body =
                ({
                    result: false,
                    error: { code: -2, message: "session invalid etc" },
                    id: req_body.id
                }) as RPC2Response<null>;
            return;
        }

        const expectedHash = makePWHash(
            req_body.params.userName,
            session_vars.random,
            makePWHash(local_username, realm, local_password),
        );

        const isPasswordCorrect = req_body.params.password === expectedHash;

        if (!isPasswordCorrect) {
            // TODO: erro wrong password etc
            ctx.response.status = 401;
            ctx.response.body = { "NotifyMethod": "1.0" };
            return;
        }

        // se estiver certo, retorna um keepAliveInterval: 30
        // add session to map, etc (ctx.state?)
        validSessions.add(req_body.session!);
        const response: RPC2Response<Record<string, number>> = {
            result: true,
            params: { keepAliveInterval: 30 },
            id: req_body.id,
            session: req_body.session!,
        };
        ctx.response.body = response;
        return;
    }
}
