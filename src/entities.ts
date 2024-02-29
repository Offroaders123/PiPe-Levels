import { read } from "nbtify";

import type { Format, NBTData } from "nbtify";

export const ENTITIES_DAT_FORMAT = {
  rootName: "",
  endian: "little",
  compression: null,
  bedrockLevel: false
} as const satisfies Format;

export interface EntitiesDat extends NBTData {
  type: string;
  a: number;
  b: number;
  byteLength: number;
}

export async function readEntitiesDat(data: Buffer): Promise<EntitiesDat> {
  const type: string = data.subarray(0,3).toString();
  const a: number = data.readUInt8(3);
  const b: number = data.readUInt32LE(4);
  const byteLength: number = data.readUInt32LE(8);
  const nbt: NBTData = await read(data.subarray(12),ENTITIES_DAT_FORMAT);
  const entitiesDat: EntitiesDat = Object.assign(nbt,{ type, a, b, byteLength });
  return entitiesDat;
}