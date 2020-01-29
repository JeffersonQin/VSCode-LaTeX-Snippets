const webpack = require("webpack")
const path = require('path')

module.exports = {
    entry    : {
        demo : path.resolve(__dirname, 'example/src/demo.js')
    },
    output   : {
        path : path.resolve(__dirname, 'example/build/')
    },
    module  : {
        rules : [
            {
                test    : /\.js?$/,
                exclude : /node_modules/,
                use     : {
                    loader  : 'babel-loader',
                    options : {
                        presets : [
                            ['@babel/env', {
                                targets : {
                                    ie : 11
                                }
                            }]
                        ]
                    }
                }
            },
        ]
    },
    devtool: process.env.NODE_ENV === "development" ? "inline-source-map" : false
}