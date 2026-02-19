const {config}=require('./config/dotenvConfig')
const app=require('./app')

const HOST=config.HOST
const PORT=config.PORT

app.listen(PORT, HOST, () => {
    console.log(`IP: http://${HOST}:${PORT}`)
})