const {Router} = require("express")
const Product = require("../model/Product")
const router = Router()

router.post('/', async (req, res) => {
    const newProduct = req.body
    await Product.create(newProduct, (err, data) => {
        if(err){
            res.status(500).send({message: "Response is invalid"})
        }else{
            res.status(200).send(data)
        }
    })
})

router.get('/', async(req, res) => {
    await Product.find((err, data) => {
        if(err){
            res.status(500).send({message: "Response is invalid"})
        }else{
            res.status(200).send(data)
        }
    })
})

router.delete('/:id', async(req, res) => {
    const prodId = req.params.id
    await Product.findByIdAndDelete(prodId, (err, data) => {
        if(err){
            res.status(500).send({message: "Response is invalid"})
        }else{
            res.status(200).send(data)
        }
    }) 
})

router.patch('/:id', async(req, res) => {
    const prodId = req.params.id
    await Product.findByIdAndUpdate(prodId, {
        name: req.body.name,
        category: req.body.category,
        desc: req.body.desc,
        img: req.body.img,
        price: req.body.price,
        ratting: req.body.ratting
    }, (err, data) => {
        if(err){
            res.status(500).send({message: "Response is invalid"})
        }else{
            res.status(200).send(data)
        }
    })
})

module.exports = router