module.exports = api => {
    const isTest = api.env('test');
    
    return {
        presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript'
        ],
        plugins: [
            !isTest && 'react-refresh/babel',
            '@babel/plugin-transform-runtime'
        ].filter(Boolean)
    };
}; 