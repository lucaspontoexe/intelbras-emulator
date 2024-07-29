import { Router } from "@oak/oak";
import { LoginRequest, RPC2Response } from "./rpc2.d.ts";

export const router = new Router();

router.get("/", (ctx) => ctx.response.body = "tem");

// mover pra outro arquivo?
function generateSession() {
    const bytes = new Int8Array(26);
    crypto.getRandomValues(bytes);
    return bytes.toString();
}

router.post("/RPC2_Login", async (ctx) => {
    const { params, id }: LoginRequest = await ctx.request.body.json();

    // hardcoded pro teste
    const _username = "ademir";
    const _password = "senha";

    // LOGIN 1
    if (!params.password) {
        // response params: generate random uuid
        // create session (26 random A-z 0-9 chars)
        // add session to map, etc
        // store username to cookies. use state?

        // retornar "erro" com o login challenge

        const responseParams = {
            realm: "Login to INTELBRAS EMULATOR 2000",
            random: crypto.randomUUID(),
            encryption: "Default",
        };

        const response: RPC2Response<typeof responseParams> = {
            result: false,
            error: {
                "code": 268632079,
                "message": "Component error: login challenge!",
            },
            params: responseParams,
            id,
            // generate and store session
            session: generateSession(),
        };
        ctx.response.body = response;
        return;

        // LOGIN 2
    } else {
        // check if hashing is correct
        // o código pra isso tem lá no cliente
        // se estiver certo, retorna um keepAliveInterval: 30
    }

    ctx.response.body = "rpc2 login";
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
