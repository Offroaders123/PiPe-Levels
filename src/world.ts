import { readChunksDat } from "./chunks.js";
import { readEntitiesDat } from "./entities.js";
import { readLevelDat } from "./level.js";

import type { ChunksDat } from "./chunks.js";
import type { EntitiesDatFile } from "./entities.js";
import type { LevelDatFile } from "./level.js";

export interface World extends WorldFileNameMap {}

export async function readWorld(files: File[]): Promise<World> {
  const chunks = await readWorldFile("chunks.dat",files);
  const entities = await readWorldFile("entities.dat",files);
  const levelDat = await readWorldFile("level.dat",files);
  const levelDatOld = await readWorldFile("level.dat_old",files);

  return {
    "chunks.dat": chunks,
    "entities.dat": entities,
    "level.dat": levelDat,
    "level.dat_old": levelDatOld
  };
}

export interface WorldFileNameMap {
  "chunks.dat": ChunksDat | null;
  "entities.dat": EntitiesDatFile | null;
  "level.dat": LevelDatFile | null;
  "level.dat_old": LevelDatFile | null;
}

async function readWorldFile<K extends keyof WorldFileNameMap>(name: K, files: File[]): Promise<WorldFileNameMap[K]> {
  const file: File | undefined = files.find(file => file.name === name);
  const arrayBuffer: ArrayBuffer | undefined = await file?.arrayBuffer();
  const buffer: Buffer | null = arrayBuffer !== undefined ? Buffer.from(arrayBuffer) : null;

  if (buffer === null){
    return null;
  }

  switch (name){
    case "chunks.dat": return readChunksDat(buffer) as Promise<WorldFileNameMap[K]>;
    case "entities.dat": return readEntitiesDat(buffer) as Promise<WorldFileNameMap[K]>;
    case "level.dat": return readLevelDat(buffer) as Promise<WorldFileNameMap[K]>;
    case "level.dat_old": return readLevelDat(buffer) as Promise<WorldFileNameMap[K]>;
  }

  return null;
}