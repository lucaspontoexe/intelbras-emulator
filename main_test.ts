import { assertEquals } from "jsr:@std/assert";
import { add } from "./main.ts";

Deno.test(function addTest() {
  console.log("somou, ó")
  assertEquals(add(2, 3), 5);
});
