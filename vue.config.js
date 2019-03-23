module.exports = {
  runtimeCompiler: true,
  chainWebpack: chain => {
    chain.devtool('cheap-module-source-map')
    return chain
  },
}
