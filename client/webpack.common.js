const path = require('path');

module.exports = {
    // mode: 'development', // development build or production build
    // devtool: 'inline-source-map', // source maps provide useful information durning development
    entry: './src/app.js', // Webpack will initilally look here
    output: {
        path: path.resolve(__dirname, 'dist'), // The output file path
        filename: 'bundle.js' // Output file name
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"],
        // Add support for TypeScripts fully qualified ESM imports.
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    module: {
        rules: [
            // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }
        ]
    },
    // watch: true // Reload when changes have been made to the source code.
}