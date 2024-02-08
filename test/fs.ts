import { readFile as readfile, readdir } from "node:fs/promises";

import type { Dirent } from "node:fs";

export async function readDirectory(path: string | URL): Promise<File[]> {
  const entries: Dirent[] = await readdir(path,{ withFileTypes: true });
  const fileEntries: Dirent[] = entries.filter(entry => entry.isFile());
  const files: File[] = await Promise.all(fileEntries.map(readFile));
  return files;
}

async function readFile(entry: Dirent): Promise<File> {
  const path: string = `${entry.path}/${entry.name}`;
  const data: Buffer = await readfile(path);
  const file = new File([data],entry.name);
  return file;
}