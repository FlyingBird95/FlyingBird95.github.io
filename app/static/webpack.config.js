const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    let isProduction = (argv.mode === 'production');

    let config = {
        // absolute path to the base directory
        context: path.resolve(__dirname, "src"),

        // entry files to compile (relative to the base dir)
        entry: [
            "./js/app.js",
            "./scss/app.scss",
        ],

        // enable development source maps
        // * will be overwritten by 'source-maps' in production mode
        devtool: "inline-source-map",

        // path to store compiled JS bundle
        output: {
            // bundle relative name
            filename: "js/app.js",
            // base build directory
            path: path.resolve(__dirname, "dist"),
            // path to build relative asset links
            publicPath: "../"
        },

        // plugins configurations
        plugins: [
            new CleanWebpackPlugin(),

            // save compiled SCSS into separated CSS file
            new MiniCssExtractPlugin({
                filename: "css/style.css"
            }),

            // copy static assets directory
            new CopyPlugin([
                {from: 'static', to: 'static'},
                {from: 'images', to: 'images'},
                {from: 'fonts', to: 'fonts'}
            ]),

            // provide jQuery and Popper.js dependencies
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                jquery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
            }),
        ],

        // production mode optimization
        optimization: {
            minimizer: [
                // CSS optimizer
                new OptimizeCSSAssetsPlugin(),
                // JS optimizer by default
                new TerserPlugin(),
            ],
        },

        // custom loaders configuration
        module: {
            rules: [
                // styles loader
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader"
                    ],
                },

                // images loader
                {
                    test: /\.(png|jpe?g|gif)$/,
                    loaders: [
                        {
                            loader: "file-loader"
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4
                                },
                                optipng: {enabled: false},
                                gifsicle: {interlaced: false},
                                webp: {quality: 75}
                            }
                        },
                    ],
                },

                // fonts loader
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "fonts/[name].[ext]"
                            }
                        },
                    ],
                },

                // svg inline 'data:image' loader
                {
                    test: /\.svg$/,
                    loader: "svg-url-loader"
                },
            ]
        },
    };

    return config;
};
