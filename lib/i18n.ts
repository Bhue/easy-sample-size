export type Dict = Record<string, string>

const en: Dict = {
  appTitle: 'Easy Sample Size',
}

const dictionaries: Record<string, Dict> = { en }

export function useDict(locale: string = 'en'): Dict {
  return dictionaries[locale] ?? en
}

