const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isTest = process.env.NODE_ENV === 'test';
    
    // Load environment variables
    const envFile = isTest ? '.env.test' : '.env';
    const envConfig = dotenv.config({ path: path.resolve(__dirname, envFile) }).parsed || {};

    return {
        mode: isProduction ? 'production' : 'development',
        entry: './src/index.tsx',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js',
            publicPath: '/',
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            fallback: {
                "buffer": require.resolve("buffer/"),
                "util": require.resolve("util/"),
                "stream": require.resolve("stream-browserify"),
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                templateParameters: {
                    PUBLIC_URL: ''
                }
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { 
                        from: 'public',
                        to: '',
                        globOptions: {
                            ignore: ['**/index.html']
                        }
                    }
                ]
            }),
            !isTest && !isProduction && new ReactRefreshWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env': JSON.stringify({
                    ...envConfig,
                    PUBLIC_URL: ''
                })
            })
        ].filter(Boolean),
        devServer: {
            static: {
                directory: path.join(__dirname, 'public')
            },
            compress: true,
            port: 3000,
            hot: true,
            historyApiFallback: true,
        }
    };
}; 