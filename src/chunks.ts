export async function readChunksDat(data: Buffer): Promise<ChunksDat> {
  // console.log(data);

  console.log(data.subarray(0,SECTOR_LENGTH));
  const chunkIndices = readChunkIndicies(data);
  console.log(chunkIndices.slice(13,17));
}

export const SECTOR_LENGTH = 4096;

export const CHUNK_INDICIES_OFFSET = 0;
export const CHUNK_INDEX_LENGTH = 4;

export const CHUNKS_LENGTH = 1024;

export interface ChunkDat extends ReadonlyArray<Entry> {
  [index: number]: Entry;
}

export interface Entry {
  data: Uint8Array | null;
  index: number;
  sectors: number;
  offset: number;
  length: number;
}

export function readChunkIndicies(data: Buffer): ChunkDat {
  const chunkIndicies: ChunkDat = Object.seal(Array.from<ChunkDat[number]>({ length: CHUNKS_LENGTH }));

  for (let i = CHUNK_INDICIES_OFFSET; i < SECTOR_LENGTH; i += CHUNK_INDEX_LENGTH){
    const index: number = i / CHUNK_INDEX_LENGTH;
    const sectors: number = data.readUInt8(i) * SECTOR_LENGTH;
    const offset: number = (data.readUInt32LE(i) >> 8) * SECTOR_LENGTH;
    const length: number = offset !== 0 ? data.readUInt32LE(offset) : 0;
    const entry: Uint8Array | null = length !== 0 ? data.subarray(offset,offset + length) : null;
    chunkIndicies[index] = { data: entry, index, sectors, offset, length };
  }

  return chunkIndicies;
}