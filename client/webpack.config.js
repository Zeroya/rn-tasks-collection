const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // const config = await createExpoWebpackConfigAsync(
  //   {
  //     ...env,
  //     extensions: [".js", ".jsx", ".ts", ".tsx"],
  //     babel: {
  //       dangerouslyAddModulePathsToTranspile: ["@ui-kitten/components"],
  //     },
  //   },
  //   argv
  // );
  config.resolve = {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  };
  // config.resolve.alias["../Utilities/Platform"] = "react-native-web/dist/exports/Platform";
  return config;
};
