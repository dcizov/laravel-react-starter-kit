/** @type {import('lint-staged').Configuration} */
const lintStagedConfig = {
    '**/*.{ts,tsx,js,jsx}': [
        'prettier --write --cache --ignore-path .prettierignore',
        'eslint --fix --cache',
        () => 'tsc --noEmit',
    ],
    '**/*.{md,mdx,json}':
        'prettier --write --cache --ignore-path .prettierignore',
    // Added for Laravel
    '**/*.php': 'vendor/bin/pint',
};

export default lintStagedConfig;
