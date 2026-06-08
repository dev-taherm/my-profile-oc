import type { Locale } from "@/lib/constants";
import en from "./dictionaries/en.json";
import ar from "./dictionaries/ar.json";

const dictionaries = { en, ar } as const;

export type Dictionary = typeof en;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] as Dictionary;
}
