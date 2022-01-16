const { run } = require('runjs')
const chalk = require('chalk')
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../vue.config.js')
const app = express();
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
    const report = rawArgv.includes('--report')

    run(`vue-cli-service build ${args}`)

    const port = 9526
    const publicPath = config.publicPath

    app.use(
        publicPath,
        express.static('./dist')
    )

    if (process.env.HOST) {
        app.use(createProxyMiddleware('/api', {
            target: process.env.HOST,
            ws: true,
            changeOrigin: true
        }));
    }

    app.listen(port, function () {
        console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))
        if (report) {
            console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`))
        }

    })
} else {
    run(`vue-cli-service build ${args}`)
}