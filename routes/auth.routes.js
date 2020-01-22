const {Router} = require('express');
const User = require('../models/user'); // подключаем модель пользователя
const router = Router();
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

// /api/auth/register
router.post(
    '/register', 
    [
        check('email', 'Некорректный e-mail').isEmail(),
        check('password', 'Мигимальная длина пароля символов').isLength({min: 6})
    ],
    async (req, res)=>{
    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }
        const{email, password} = req.body;

        const condidate = await User.findOne({email});

        if(condidate){
            return res.status(400).json({message: 'Такой пользователь уже есть!'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hashedPassword})

        await user.save();

        res.status(201).json({message: 'Пользователь создан'});


 
    } catch(e){
        res.status(500).json({message: 'Ошибка попробуйте снова!'})
    }
});

// /api/auth/login
router.post('/login', 
[
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Ввдите пароль').exists()
],
async(req, res) => {
    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }

        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: 'Пользователь не найден'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: 'Неверный пароль попробуйте снова!'});
        }

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        res.json({token, userId: user.id});


    } catch(e){
        res.status(500).json({message: 'Ошибка попробуйте снова!'})
    }
});

module.exports = router;