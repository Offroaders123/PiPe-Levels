import type { ByteArrayTag } from "nbtify";

export async function readChunksDat(data: Buffer): Promise<ChunksDat> {
  // console.log(data);

  console.log(data.subarray(0,SECTOR_LENGTH));
  const chunkEntries = readChunkEntries(data);
  // console.log(chunkEntries.slice(13,17));

  const chunks = readChunks(chunkEntries);
  console.log(chunks.slice(13,17));

  return chunks;
}

export interface ChunksDat extends ReadonlyArray<Chunk | null> {
  [index: number]: Chunk | null;
}

export interface Chunk {
  Blocks: ByteArrayTag;
  Data: ByteArrayTag;
  SkyLight: ByteArrayTag;
  BlockLight: ByteArrayTag;
  Biome: ByteArrayTag;
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
  return [data, byteLength - ENTRY_HEADER_LENGTH, data.byteLength];

  const Blocks: ByteArrayTag = new Int8Array();
  const Data: ByteArrayTag = new Int8Array();
  const SkyLight: ByteArrayTag = new Int8Array();
  const BlockLight: ByteArrayTag = new Int8Array();
  const Biome: ByteArrayTag = new Int8Array();
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