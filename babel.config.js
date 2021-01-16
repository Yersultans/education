const presets = [['@babel/preset-env', { targets: { node: 'current' } }]]
const ignore = ['server/androidLayout', 'admin']
const plugins = [
  ['@babel/plugin-transform-runtime'],
  [
    'module-resolver',
    {
      root: ['./server'],
      extensions: ['.js', '.json']
    }
  ]
]

module.exports = {
  presets,
  ignore,
  plugins
}
