import { readEntitiesDat } from "./entities.js";
import { readLevelDat } from "./level.js";

import type { EntitiesDat } from "./entities.js";
import type { LevelDat } from "./level.js";

export interface World {
  chunks: WorldFileNameMap["chunks.dat"];
  entities: WorldFileNameMap["entities.dat"];
  levelDat: WorldFileNameMap["level.dat"];
  levelDatOld: WorldFileNameMap["level.dat_old"];
}

export async function readWorld(files: File[]): Promise<World> {
  const chunks = await readWorldFile("chunks.dat",files);
  const entities = await readWorldFile("entities.dat",files);
  const levelDat = await readWorldFile("level.dat",files);
  const levelDatOld = await readWorldFile("level.dat_old",files);

  return {
    chunks,
    entities,
    levelDat,
    levelDatOld
  };
}

export interface WorldFileNameMap {
  "chunks.dat": Buffer | null;
  "entities.dat": EntitiesDat | null;
  "level.dat": LevelDat | null;
  "level.dat_old": LevelDat | null;
}

async function readWorldFile<K extends keyof WorldFileNameMap>(name: K, files: File[]): Promise<WorldFileNameMap[K]> {
  const file: File | undefined = files.find(file => file.name === name);
  const arrayBuffer: ArrayBuffer | undefined = await file?.arrayBuffer();
  const buffer: Buffer | null = arrayBuffer !== undefined ? Buffer.from(arrayBuffer) : null;

  if (buffer === null){
    return null;
  }

  switch (name){
    case "chunks.dat": return buffer as WorldFileNameMap[K];
    case "entities.dat": return readEntitiesDat(buffer) as Promise<WorldFileNameMap[K]>;
    case "level.dat": return readLevelDat(buffer) as Promise<WorldFileNameMap[K]>;
    case "level.dat_old": return readLevelDat(buffer) as Promise<WorldFileNameMap[K]>;
  }

  return null;
}