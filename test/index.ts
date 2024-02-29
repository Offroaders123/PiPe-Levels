// @ts-expect-error - unused
import { inspect } from "node:util";
import { readDirectory } from "./fs.js";
import { readWorld } from "../src/index.js";

const path = new URL("./world/Hi Mom",import.meta.url);

const files: File[] = await readDirectory(path);
// console.log(files);

const world = await readWorld(files);
// console.log(inspect(world,{ colors: true, depth: 1 }));
console.log(world["entities.dat"]?.data.Entities.map(entity => entity.id));