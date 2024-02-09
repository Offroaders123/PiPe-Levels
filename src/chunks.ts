export async function readChunksDat(data: Buffer): Promise<ChunksDat> {
  // console.log(data);

  console.log(data.subarray(0,SECTOR_LENGTH));
  const chunkEntries = readChunkEntries(data);
  console.log(chunkEntries.slice(13,17));
}

export interface ChunksDat extends ReadonlyArray<Chunk | null> {
  [index: number]: Chunk;
}

export interface Chunk {}

export const SECTOR_LENGTH = 4096;

export const CHUNK_INDICIES_OFFSET = 0;
export const CHUNK_INDEX_LENGTH = 4;

export const CHUNKS_LENGTH = 1024;

export interface ChunkEntries extends ReadonlyArray<Entry> {
  [index: number]: Entry;
}

export interface Entry {
  data: Uint8Array | null;
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
    const entry: Uint8Array | null = entryLength !== 0 ? data.subarray(entryOffset,entryOffset + entryLength) : null;
    chunkEntries[index] = { data: entry, index, byteOffset: entryOffset, byteLength: entryLength };
  }

  return chunkEntries;
}