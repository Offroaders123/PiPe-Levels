export interface ChunksDat {}

export async function readChunksDat(data: Buffer): Promise<ChunksDat> {
  // console.log(data);
  const chunkIndex = data.subarray(0,4096);
  console.log(chunkIndex);

  for (let i = 0; i < 4096; i += 4){
    const sectors: number = chunkIndex.readUInt8(i);
    const offset: number = chunkIndex.readUInt32LE(i) >> 8;
    console.log({ sectors, offset });
    if (i > 18 * 4) break;
  }
}