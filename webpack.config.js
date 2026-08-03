const path = require('path');

module.exports = function (options, webpack) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      alias: {
        '@app/shared': path.resolve(__dirname, 'libs/shared/src'),
      },
    },
  };
};
