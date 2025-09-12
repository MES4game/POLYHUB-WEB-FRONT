import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            }
        },
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "variable",
                    modifiers: ["global"],
                    format: ["UPPER_CASE"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: ["variable", "parameter", "property", "parameterProperty"],
                    format: ["snake_case"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: ["variable", "parameter", "property", "parameterProperty"],
                    types: ["function"],
                    format: ["camelCase", "PascalCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: ["function", "method", "accessor"],
                    format: ["camelCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: "enumMember",
                    format: ["UPPER_CASE"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: "import",
                    format: ["UPPER_CASE", "camelCase", "PascalCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                // For basic type property, like className in JSX or property of style
                {
                    selector: "property",
                    format: ["camelCase"],
                    filter: {
                        regex: "^(webpackHot)|(className)|(maxHeight)|(textAlign)$",
                        match: true
                    },
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                }
            ],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true
                }
            ]
        }
    },
    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            }
        },
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: ["variable", "parameter", "property", "parameterProperty"],
                    types: ["function"],
                    format: ["camelCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                }
            ]
        }
    },
    {
        plugins: {
            react: reactPlugin
        },
        files: ["**/*.{jsx,tsx}"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            }
        },
        settings: {
            react: {
                version: "detect"
            }
        },
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: ["variable", "parameter", "property", "parameterProperty"],
                    types: ["function"],
                    format: ["camelCase", "PascalCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                }
            ],
            "react/function-component-definition": [
                "error",
                {
                    namedComponents: "arrow-function",
                    unnamedComponents: "arrow-function"
                }
            ],
            "react/react-in-jsx-scope": "off"
        }
    },
    {
        files: ["**/*.{js,jsx}"],
        extends: [tseslint.configs.disableTypeChecked]
    }
);
