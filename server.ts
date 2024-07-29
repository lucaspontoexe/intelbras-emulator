import { Application } from "@oak/oak";
import { router } from "./routes.ts";

const app = new Application();

app.use(router.routes());

await app.listen({ port: 8000 });
