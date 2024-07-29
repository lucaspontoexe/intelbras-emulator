import { Router } from "@oak/oak";
import { LoginRequest, RPC2Response } from "./rpc2.d.ts";
import { generateSessionToken, makePWHash } from "./gen-session.ts";

export const router = new Router();

router.get("/", (ctx) => ctx.response.body = "tem");

router.post("/RPC2_Login", async (ctx) => {
    const { params, id, session }: LoginRequest = await ctx.request.body.json();

    // hardcoded pro teste
    const _username = "ademir";
    const _password = "senha";

    const loginChallengeParams = {
        realm: "Login to INTELBRAS EMULATOR 2000",
        random: crypto.randomUUID(),
        encryption: "Default",
    };
    // LOGIN 1
    if (!params.password) {
        // response params: generate random uuid
        // create session (26 random A-z 0-9 chars)
        // retornar "erro" com o login challenge

        const response: RPC2Response<typeof loginChallengeParams> = {
            result: false,
            error: {
                "code": 268632079,
                "message": "Component error: login challenge!",
            },
            params: loginChallengeParams,
            id,
            // generate and store session
            session: generateSessionToken(),
        };
        ctx.response.body = response;
        return;

        // LOGIN 2
    } else {
        const expectedHash = makePWHash(
            params.userName,
            loginChallengeParams.random,
            makePWHash(_username, loginChallengeParams.realm, _password),
        );

        const isPasswordCorrect = params.password === expectedHash;

        // check if hashing is correct
        // o código pra isso tem lá no cliente

        if (!isPasswordCorrect) {
            // TODO: erro wrong password etc
            ctx.response.status = 401;
            ctx.response.body = { "NotifyMethod": "1.0" };
            return;
        }

        // se estiver certo, retorna um keepAliveInterval: 30
        // add session to map, etc (ctx.state?)
        const response: RPC2Response<Record<string, number>> = {
            result: true,
            params: { keepAliveInterval: 30 },
            id,
            session: session as string,
        };
        ctx.response.body = response;
        return;
    }

    // ctx.response.body = "rpc2 login";
});

router.get(
    "/RPC2_Notify_Method",
    (ctx) => ctx.response.body = { "NotifyMethod": "1.0" },
);

router.post("/RPC2", (ctx) => {
    // criar um middleware pra ver se tá tudo certo com
    // login / sessão / timeout
    ctx.response.body = "rpc2";
});
