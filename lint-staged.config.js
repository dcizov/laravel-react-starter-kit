/** @type {import('lint-staged').Configuration} */
const lintStagedConfig = {
    '**/*.{ts,tsx,js,jsx}': [
        'prettier --write --cache --ignore-path .prettierignore',
        'eslint --fix --cache',
    ],
    '**/*.{md,mdx,json,css}':
        'prettier --write --cache --ignore-path .prettierignore',
    // Added for Laravel
    '**/*.php': 'vendor/bin/pint',
};

export default lintStagedConfig;
