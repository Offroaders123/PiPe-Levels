import { read } from "nbtify";

import type { Format, NBTData } from "nbtify";

export const LEVEL_DAT_FORMAT = {
  rootName: "",
  endian: "little",
  compression: null,
  bedrockLevel: 3
} as const satisfies Format;

export interface LevelDat extends NBTData {}

export async function readLevelDat(data: Buffer): Promise<NBTData> {
  const levelDat: LevelDat = await read(data,LEVEL_DAT_FORMAT);
  return levelDat;
}