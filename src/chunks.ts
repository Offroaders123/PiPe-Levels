import { BiomeResource, BlockResource } from "region-types/dist/pi/index.js";

export async function readChunksDat(data: Buffer): Promise<ChunksDat> {
  // console.log(data);

  console.log(data.subarray(0,SECTOR_LENGTH));
  const chunkEntries = readChunkEntries(data);
  // console.log(chunkEntries.slice(13,17));

  const chunks = readChunks(chunkEntries);
  // console.log(chunks.slice(13,17));

  return chunks;
}

export interface ChunksDat extends ReadonlyArray<Chunk | null> {
  [index: number]: Chunk | null;
}

export interface Chunk {
  Blocks: (keyof typeof BlockResource)[];
  Data: Uint8Array;
  SkyLight: Uint8Array;
  BlockLight: Uint8Array;
  Biome: (keyof typeof BiomeResource)[];
}

export function readChunks(entries: ChunkEntries): ChunksDat {
  const chunksDat: ChunksDat = Object.seal(Array.from<ChunksDat[number]>({ length: CHUNKS_LENGTH }));

  for (const [i,entry] of entries.entries()){
    chunksDat[i] = readEntry(entry);
  }

  return chunksDat;
}

export const ENTRY_HEADER_LENGTH = 4;

export function readEntry(entry: Entry): Chunk | null {
  let { data } = entry;
  if (data === null) return null;
  const byteLength: number = data.readUint32LE(0);
  data = data.subarray(ENTRY_HEADER_LENGTH,byteLength);

  const Blocks: (keyof typeof BlockResource)[] = [...data.subarray(0,0x8000)].map(id => BlockResource[id]! as keyof typeof BlockResource);
  const Data = new Uint8Array(data.subarray(0x8000,0x8000 + 0x4000));
  const SkyLight = new Uint8Array(data.subarray(0xc000,0xc000 + 0x4000));
  const BlockLight = new Uint8Array(data.subarray(0x10000,0x10000 + 0x4000));
  const Biome: (keyof typeof BiomeResource)[] = [...data.subarray(0x14000,0x14000 + 0x100)].map(id => BiomeResource[id]! as keyof typeof BiomeResource);
  return { Blocks, Data, SkyLight, BlockLight, Biome };
}

export const SECTOR_LENGTH = 4096;

export const CHUNK_INDICIES_OFFSET = 0;
export const CHUNK_INDEX_LENGTH = 4;

export const CHUNKS_LENGTH = 1024;

export interface ChunkEntries extends ReadonlyArray<Entry> {
  [index: number]: Entry;
}

export interface Entry {
  data: Buffer | null;
  index: number;
  byteOffset: number;
  byteLength: number;
}

export function readChunkEntries(data: Buffer): ChunkEntries {
  const chunkEntries: ChunkEntries = Object.seal(Array.from<ChunkEntries[number]>({ length: CHUNKS_LENGTH }));

  for (let i = CHUNK_INDICIES_OFFSET; i < SECTOR_LENGTH; i += CHUNK_INDEX_LENGTH){
    const index: number = i / CHUNK_INDEX_LENGTH;
    const entryLength: number = data.readUint8(i) * SECTOR_LENGTH;
    const entryOffset: number = (data.readUint32LE(i) >> 8) * SECTOR_LENGTH;
    const entry: Buffer | null = entryLength !== 0 ? data.subarray(entryOffset,entryOffset + entryLength) : null;
    chunkEntries[index] = { data: entry, index, byteOffset: entryOffset, byteLength: entryLength };
  }

  return chunkEntries;
}