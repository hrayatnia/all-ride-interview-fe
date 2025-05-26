const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv');

// Load the appropriate .env file based on NODE_ENV
const getEnvPath = () => {
  const env = process.env.NODE_ENV || 'development';
  const paths = [
    `.env.${env}.local`,
    `.env.${env}`,
    '.env.local',
    '.env'
  ];
  
  for (const filepath of paths) {
    try {
      const envConfig = dotenv.config({ path: filepath });
      if (envConfig.parsed) {
        console.log(`Loaded environment variables from ${filepath}`);
        return filepath;
      }
    } catch (err) {
      console.log(`No ${filepath} file found`);
    }
  }
  return '.env';
};

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
              plugins: [
                isDevelopment && 'react-refresh/babel'
              ].filter(Boolean),
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    fallback: {
      path: false,
      fs: false,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new Dotenv({
      path: getEnvPath(),
      systemvars: true, // Load all system variables as well
      safe: true, // Load '.env.example' to verify the '.env' variables are all set
      defaults: false, // Load '.env.defaults' as the default values if empty
    }),
    // Fallback values for required environment variables
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV || 'development',
        REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
        REACT_APP_TITLE: process.env.REACT_APP_TITLE || 'All Ride User Management',
        REACT_APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
        REACT_APP_ENABLE_MOCK_API: process.env.REACT_APP_ENABLE_MOCK_API === 'true',
        REACT_APP_ENABLE_DEBUG_MODE: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
      }),
    }),
  ].filter(Boolean),
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
    },
    port: 3000,
    hot: true,
    liveReload: false,
    open: true,
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    compress: true,
  },
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
}; 