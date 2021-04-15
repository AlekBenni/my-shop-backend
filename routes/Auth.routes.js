const Router = require("express")
const User = require("../model/User")
const {check, validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/auth.middleware")

const router = Router()

    //  Регистрация пользователя

    router.post('/registration',
    [
        //  Задаём параметры валидации
        check("name", "Мыло некорректное").isLength({min:3}),
        check("email", "Мыло некорректное").isEmail(),
        check("password", "Пароль некорректный").isLength({min:3}),
    ],
async(req, res) => {

    try{

        //  Проверка на валидацию
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message: "Некорректные данные"})
        }

        //  Получаю данные из тела запроса
        const {name, email, password, avatar} = req.body

        //  Ищем в базе есть ли такой пользователь
        const candidate = await User.findOne({email})

        //  Если такой пользователь есть выведем это на фронт
        if(candidate){
            return res.status(400).json({message: "Такой пользователь уже существует"})
        }

        //  Если такого пользователя нет, захэшируем ему пароль
        const hashPassword = await bcrypt.hash(password, 5)

        //  После создаём пользователя
        const user = new User({name, email, password: hashPassword, avatar})

        //  Сохраняем пользователя в базу
        await user.save()

        //  Отправляем отчёт о созданном пользователе
        res.status(200).json({message: "Пользователь создан"})

    }
    catch(e){
        console.log(`Проблема в регистрации пользователя ${e}`)
    }

})

    //  Логинизация пользователя

    router.post('/login', async(req, res) => {
        try{
            //  Достаём данные из тела запроса
            const {email, password} = req.body
    
            //  Проверяем есть ли такой пользователь в базе
            const user = await User.findOne({email})
            if(!user){
                return res.status(400).json({message: "Такой пользователь не найден"})
            }
    
            //  Если найден - сравним его пароли
            const isValid = await bcrypt.compareSync(password, user.password)
    
            //  Если пароль не валидный - отправим его на фронт
            if(!isValid){
                return res.status(400).json({message: "Пароли не совпадают"})
            }
    
            //  Если совпадают пароли - настроим токен с заданием секретного ключа
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})  
    
            //  Вернём на фронт токен с данными пользователя
            return res.json({
                token, 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
            })
        }
        catch(e){
            console.log(e)
            res.send({message: "server error"})
        }
    })  

        //  Авторизация пользователя
    router.get('/auth', authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.id})
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })

module.exports = router