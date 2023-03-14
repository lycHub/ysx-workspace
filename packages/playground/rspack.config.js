/**
 * @type {import('@rspack/cli').Configuration}
 */

 module.exports = function (env, argv) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
		context: __dirname,
		entry: {
			main: "./src/main.tsx"
		},
		devtool: isProduction ? false : 'source-map',
		builtins: {
			minifyOptions: {
				dropConsole: isProduction,
			},
			html: [
				{
					template: "./index.html",
					title: 'rust pack'
				}
			]
		},
		module: {
			rules: [
				{
					test: /\.svg$/,
					type: "asset"
				},
				{
					test: /\.scss$/,
					use: 'sass-loader',
					type: 'css',
				}
			]
		}
	};
};
