import { Context } from "@oak/oak";
import { generateSessionToken, makePWHash } from "./gen-session.ts";
import { LoginRequest, RPC2Request, RPC2Response } from "./rpc2.d.ts";
import { GetFocusStatusResponseParams } from "./zoom.d.ts";

const local_username = "ademir";
const local_password = "senha";

interface Session {
    username: string;
    random: string;
}
const sessions = new Map<string, Session>();
const validSessions = new Set<string>();

const zoomMotorSteps = 2259;
const focusMotorSteps = 2750;

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
            ctx.response.body = ({
                result: false,
                error: { code: -2, message: "session invalid etc" },
                id: req_body.id,
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

// export async function CheckSession(ctx: Context, next: Next) {
//     const shouldCheck = ctx.request.url.pathname === "/RPC2";
//     const req_body: RPC2Request<unknown> = await ctx.request.body.json();
//     const sessionIsInvalid = !req_body.session ||
//         !validSessions.has(req_body.session);

//     if (shouldCheck && sessionIsInvalid) {
//         console.log("abriram sessão inválida aqui");
//         // handle invalid or non-existent session
//         ctx.response.body = { result: false } as RPC2Response<null>;
//         return;
//     }
//     // aqui também seria espaço pra checar o keepAlive
//     // se a sessão não expirou
//     await next();
// }

export async function RPC2Middleware(ctx: Context) {
    const req_body: RPC2Request<unknown> = await ctx.request.body.json();
    let response: RPC2Response<unknown>;

    // check for invalid session token
    const sessionIsInvalid = !req_body.session ||
        !validSessions.has(req_body.session);

    if (sessionIsInvalid) {
        console.log("abriram sessão inválida aqui");
        // handle invalid or non-existent session
        ctx.response.body = { result: false } as RPC2Response<null>;
        return;
    }

    switch (req_body.method) {
        case "devVideoInput.getFocusStatus":
            // get current zoom/focus value;
            // if tiimeout/lerping is active, status is "autofocus"
            // format body params, get types etc

            response = {
                result: true,
                params: {
                    status: {
                        Status: "Normal",
                        Zoom: 1000,
                        Focus: 1000,
                        FocusMotorSteps: focusMotorSteps,
                        ZoomMotorSteps: zoomMotorSteps,
                        AutofocusPeak: 0,
                    },
                },
                id: req_body.id,
                session: req_body.session,
            } as RPC2Response<GetFocusStatusResponseParams>;
            break;

        case "devVideoInput.adjustFocus":
            /**
             * call lerpzoom function,
             * create timeouts
             * format body etc
             */
            response = { result: true, params: {} } as RPC2Response<
                unknown
            >;
            break;

        case "devVideoInput.autoFocus":
            // por enquanto é not-implemented
            response = { result: true, params: {} } as RPC2Response<
                unknown
            >;
            break;

        case "global.keepAlive":
            // aí tem interação com o rpc login
            // a gente ainda não implementou a lógica do keepAlive
            // então eu acho que dá pra fazer uma resposta dummy mesmo
            response = { result: true, params: {} } as RPC2Response<
                unknown
            >;
            break;

        default:
            response = {
                result: false,
                error: { code: -3, message: "not implemented" },
                params: {},
                id: req_body.id,
                session: req_body.session,
            } as RPC2Response<never>;
            break;
    }
    ctx.response.body = response;
}
