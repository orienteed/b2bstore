const config = {
    parser: 'babel-eslint',
    extends: ['@magento'],
    rules: {
        'no-prototype-builtins': 'off',
        'no-undef': 'off',
        'no-useless-escape': 'off',
        'react/jsx-no-literals': [
            'error',
            {
                allowedStrings: ['allowed'],
                // Use ignoreProps: false to catch label/title/alt text, etc.
                // Has the downside of erroring on "id" and other string props.
                ignoreProps: true,
                noStrings: true,
                noAttributeStrings: true
            }
        ]
    }
};

module.exports = config;
