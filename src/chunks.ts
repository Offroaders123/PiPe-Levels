export interface ChunksDat {}

export async function readChunksDat(data: Buffer): Promise<ChunksDat> {
  // console.log(data);

  console.log(data.subarray(0,SECTOR_LENGTH));
  const chunkIndices = readChunkIndicies(data);
  console.log(chunkIndices.slice(0,20));
}

export const SECTOR_LENGTH = 4096;

export const CHUNK_INDICIES_OFFSET = 0;
export const CHUNK_INDEX_LENGTH = 4;

export interface ChunkIndex {
  sectors: number;
  offset: number;
}

export function readChunkIndicies(data: Buffer): ChunkIndex[] {
  const chunkIndicies: ChunkIndex[] = [];

  for (let i = CHUNK_INDICIES_OFFSET; i < SECTOR_LENGTH; i += CHUNK_INDEX_LENGTH){
    const sectors: number = data.readUInt8(i) * SECTOR_LENGTH;
    const offset: number = (data.readUInt32LE(i) >> 8) * SECTOR_LENGTH;
    chunkIndicies.push({ sectors, offset });
  }

  return chunkIndicies;
}