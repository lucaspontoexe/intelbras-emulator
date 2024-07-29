import { Application } from "@oak/oak";
const app = new Application();

app.use(async (ctx, next) => {

    // a gente consegue interceptar qualquer request
    // daí a gente cria uma validação de login, keepalive etc
    const url = ctx.request.url.href;
    console.log("entraram em", url);
    if (url.includes("/ala")) {
        ctx.response.body = "eita";
        ctx.response.status = 201;
        return;
    }
    await next();
});

app.use((ctx) => {
    ctx.response.body = "ih ala";
});

await app.listen({ port: 8000 });
