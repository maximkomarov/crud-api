import path from 'path';
import { fileURLToPath } from 'url';

// Compute __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js', // Ensure this is the output file you want
    library: {
      type: 'module', // Specify output format as ES module
    },
    chunkFormat: 'module', // Ensure ESM chunk format
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  experiments: {
    outputModule: true, // Enable output as ES module
  },
  mode: isProduction ? 'production' : 'development',
};

export default config;
