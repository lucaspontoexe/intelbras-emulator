import { Application } from "@oak/oak";
import { router } from "./routes.ts";
import { superoak } from "superoak";
import { LoginRequest } from "./rpc2.d.ts";

const app = new Application();
app.use(router.routes());
let id = 0;

Deno.test("o get request funciona", async () => {
    const request = await superoak(app);
    await request.get("/").expect("tem");
});

Deno.test("o primeiro login acontece", async () => {
    const soak = await superoak(app);

    const body: LoginRequest = {
        method: "global.login",
        params: {
            userName: "ademir",
            password: "",
            clientType: "Web3.0",
            loginType: "Direct",
        },
        id: id++,
        session: undefined,
    };

    // o superoak é paia
    // quem testa os testes?
    await soak.post("/RPC2_Login")
        .send(JSON.stringify(body)).expect(200, /login challenge/);
});
