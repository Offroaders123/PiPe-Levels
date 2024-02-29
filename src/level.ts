import { read } from "nbtify";

import type { Format, NBTData, IntTag, LongTag, StringTag } from "nbtify";
import type { Player } from "../Region-Types/dist/bedrock/entity.js";

export const LEVEL_DAT_FORMAT = {
  rootName: "",
  endian: "little",
  compression: null,
  bedrockLevel: true
} as const satisfies Format;

export interface LevelDat extends NBTData {
  GameType: IntTag<GameMode>;
  LastPlayed: LongTag;
  LevelName: StringTag;
  Platform: IntTag<Platform>;
  Player: Player; // may need to be adjusted to only include types for this older version
  RandomSeed: LongTag;
  SizeOnDisk: LongTag;
  SpawnX: IntTag;
  SpawnY: IntTag;
  SpawnZ: IntTag;
  StorageVersion: IntTag<StorageVersion>;
  Time: LongTag;
  dayCycleStopTime: LongTag;
  spawnMobs: IntTag<0 | 1>; // not ByteTag, yeah weird I know, maybe it was going to be to do with difficulty originally? :)
}

export type GameMode = 0 | 1;

export type Platform = 2;

export type StorageVersion = 3;

export async function readLevelDat(data: Buffer): Promise<NBTData<LevelDat>> {
  const levelDat: NBTData<LevelDat> = await read<LevelDat>(data,LEVEL_DAT_FORMAT);
  return levelDat;
}