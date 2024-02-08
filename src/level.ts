import { read } from "nbtify";

import type { Format, NBTData } from "nbtify";

export const LEVEL_DAT_FORMAT = {
  rootName: "",
  endian: "little",
  compression: null,
  bedrockLevel: 3
} as const satisfies Format;

export interface LevelDat extends NBTData {}

export async function readLevelDat(data: Uint8Array): Promise<NBTData> {
  return read(data,LEVEL_DAT_FORMAT);
}