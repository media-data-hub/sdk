import jsConfig from "@joshuaavalon/eslint-config-javascript";
import tsConfig from "@joshuaavalon/eslint-config-typescript";
import globals from "globals";
import typescript from "typescript-eslint";

export default [
  { ignores: ["**/node_modules", "**/dist"] },
  {
    ...jsConfig,
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: { globals: { ...globals.node } }
  },
  {
    ...tsConfig,
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        projectService: true,
        tsconfigDirName: import.meta.dirname
      }
    }
  }
];
