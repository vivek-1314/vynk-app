import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable or adjust the rules as needed
      "@typescript-eslint/no-unused-expressions": "off", // Disable unused expressions rule
      "@typescript-eslint/no-unused-vars": "warn", // Change unused vars to warning instead of error
    },
  },
];

export default eslintConfig;
