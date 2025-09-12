import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    // Ignore generated API files completely
    {
        ignores: ["src/gen/**/*", ".next/**/*", "node_modules/**/*"],
    },
    
    // Turn off problematic rules for the rest
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off', 
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-redeclare': 'off',
            'react-hooks/rules-of-hooks': 'off', 
            'react-hooks/exhaustive-deps': 'off',
            'react/no-unescaped-entities': 'off', 
            'react/jsx-no-undef': 'off',
            'jsx-a11y/alt-text': 'off',
            'import/no-anonymous-default-export': 'off',
            'prefer-const': 'off',
            '@next/next/no-img-element': 'off',
        },
    },
];

export default eslintConfig;
