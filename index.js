const Express = require("express")
const mongoose = require("mongoose")
const Cors = require("cors")
const config = require("config")
const productRouter = require("./routes/Product.routes.js")
const userRouter = require("./routes/Auth.routes.js")

const app = Express()
app.use(Express.json())
app.use(Cors())

const PORT = process.env.PORT || config.get("port")

app.get('/', (req, res) => {
    res.status(200).send("SERVER start!")
})
app.use('/products', productRouter)
app.use('/auth', userRouter)

async function start(){
    try{
    await mongoose.connect((config.get("dbUrl")), {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    app.listen(PORT, () => console.log(`SERVER OPEN ON ${PORT} port`))
    }catch(e){
        console.log(e.message)
    }

}

start()

