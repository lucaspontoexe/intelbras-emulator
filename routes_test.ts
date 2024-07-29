import { Application } from "@oak/oak";
import { router } from "./routes.ts";
import { superoak } from "superoak";

const app = new Application();
app.use(router.routes());

Deno.test("o get request funciona", async () => {
    const request = await superoak(app);
    await request.get("/").expect("tem");
});

