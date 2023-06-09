/**
 * @type {import('@rspack/cli').Configuration}
 */

 module.exports = function (env, argv) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
		context: __dirname,
		entry: "./src/main.tsx",
		devtool: isProduction ? false : 'source-map',
		builtins: {
			minifyOptions: {
				dropConsole: isProduction,
			},
			html: [
				{
					template: "./index.html",
					title: 'rust pack',
					scriptLoading: 'module'
				}
			],
			copy: {
				patterns: ['public']
			}
		},
		module: {
			rules: [
				{
					test: /\.svg$/,
					type: "asset"
				},
				{
					test: /\.scss$/,
					use: ['postcss-loader', 'sass-loader'],
					type: 'css',
				}
			]
		},
		devServer: {
			historyApiFallback: true,
			proxy: {
				'/chatgptapi': {
					target: 'https://leads.dev.zeiss.com.cn',
					changeOrigin: true,
				},
			},
		},
	};
};
