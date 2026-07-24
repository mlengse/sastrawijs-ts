import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginJest from "eslint-plugin-jest";

export default tseslint.config(
  // Global ignores
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  // Base recommended rules
  eslint.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Prettier config (disables conflicting rules)
  eslintConfigPrettier,

  // Source files config
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      "prefer-const": ["error", { destructuring: "all" }],
    },
  },

  // Test files config
  {
    files: ["src/__tests__/**/*.ts"],
    ...eslintPluginJest.configs["flat/recommended"],
    ...eslintPluginJest.configs["flat/style"],
    rules: {
      ...eslintPluginJest.configs["flat/recommended"].rules,
      ...eslintPluginJest.configs["flat/style"].rules,
    },
  }
);
