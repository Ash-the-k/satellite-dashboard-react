module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              filterSourceMappingUrl: (url, resourcePath) => {
                // Skip source maps for mediapipe packages
                if (resourcePath.includes('@mediapipe')) {
                  return false;
                }
                return true;
              },
            },
            loader: require.resolve('source-map-loader'),
          },
        ],
      },
    ],
  },
};