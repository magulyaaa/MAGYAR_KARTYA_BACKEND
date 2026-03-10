const {config}=require('./config/dotenvConfig')
const app=require('./app')
const path = require('path')

const HOST=config.HOST
const PORT=config.PORT
// teszt

app.listen(PORT, HOST, () => {
    console.log(path.join(__dirname, 'card_img', 'makk_also.jpg'))
    console.log(`IP: http://${HOST}:${PORT}`)
})