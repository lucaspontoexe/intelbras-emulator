import { assertEquals } from "https://deno.land/std@0.213.0/assert/assert_equals.ts";
import { makePWHash } from "./gen-session.ts";

Deno.test({
    name: "it generates an md5 uppercase hash",
    fn() {
        // hash for salada:balada
        const expected = "B85D898504007DDC62242F6D62FE1D16";
        const hash = makePWHash("salada", "balada");
        assertEquals(expected, hash);
    },
});
