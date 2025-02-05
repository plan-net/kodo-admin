import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
//     todo: this should be restored after removing below
// ...compat.extends("next/core-web-vitals", "next/typescript"),

  ...compat.config({
    extends: ['next'],
    rules: {
      // todo: should be removed
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-img-element": "off",
    },
  }),
  // ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
