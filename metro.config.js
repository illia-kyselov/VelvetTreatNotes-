const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // подключаем трансформер для работы с .svg как с компонентами
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // исключаем .svg из списка обычных ассетов (картинок)
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    // добавляем .svg в список расширений исходников
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
