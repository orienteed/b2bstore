const config = {
    parser: 'babel-eslint',
    extends: ['@magento'],
    rules: {
        'no-prototype-builtins': 'off',
        'no-undef': 'off',
        'no-useless-escape': 'off',
        'noStrings': 'true'
    }
};

module.exports = config;
