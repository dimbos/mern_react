const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');

const app = express();


app.use('/api/auth', require('./routes/auth.routes.js')); //middleware

const PORT = config.get('port') || 5000;

async function start(){
    try{
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        } );
        app.listen(PORT, () => console.log(`Сервер запущен ${PORT}`));
    } catch(e){
        console.log('Ошибка связи', e.message);
        process.exit(1);
    }
}


start();

