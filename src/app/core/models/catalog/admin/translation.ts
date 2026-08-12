import { Language } from '../../../enums/language';

// Shared by product and category admin upsert requests — description/metaTitle/
// metaDescription are confirmed nullable (explicit null in the POST /admin/products
// translations example). shortDescription is not shown null in that example but is
// presented as freeform optional text alongside them — inferred nullable.
export interface TranslationInput {
  locale: Language;
  name: string;
  shortDescription: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

// Lighter shape used by attribute/attribute-value translations — just locale + name.
export interface NameTranslationInput {
  locale: Language;
  name: string;
}
