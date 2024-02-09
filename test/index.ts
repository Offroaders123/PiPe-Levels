import { writeFile } from "node:fs/promises";
import { inspect } from "node:util";
import { write } from "nbtify";
import { readDirectory } from "./fs.js";
import { readWorld } from "../src/index.js";

const path = new URL("./world/Hi Mom",import.meta.url);

const files: File[] = await readDirectory(path);
// console.log(files);

const world = await readWorld(files);
console.log(inspect(world,{ colors: true, depth: 1 }));

const debugged: Uint8Array = await write(world,{ compression: "gzip" });
console.log(debugged);

await writeFile("./debug.nbt",debugged);