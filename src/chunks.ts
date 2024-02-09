export const SECTOR_LENGTH = 4096;

export const CHUNK_INDICIES_OFFSET = 0;
export const CHUNK_INDEX_LENGTH = 4;

export interface ChunksDat {}

export async function readChunksDat(data: Buffer): Promise<ChunksDat> {
  // console.log(data);
  const chunkIndex = data.subarray(0,4096);
  console.log(chunkIndex);

  // chunk indicies parsing
  for (let i = CHUNK_INDICIES_OFFSET; i < SECTOR_LENGTH; i += CHUNK_INDEX_LENGTH){
    const sectors: number = chunkIndex.readUInt8(i) * SECTOR_LENGTH;
    const offset: number = (chunkIndex.readUInt32LE(i) >> 8) * SECTOR_LENGTH;
    console.log({ sectors, offset });
    if (i > 18 * CHUNK_INDEX_LENGTH) break;
  }
}