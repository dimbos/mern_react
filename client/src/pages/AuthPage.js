import React, {useState, useEffect} from 'react';
import {useHttp} from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const AuthPage = () => {
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const changeHandler = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const registerHandler = async () => {
        try{
            const data = await request('/api/auth/register', 'POST', {...form});
            message(data.message);
        }
        catch(e){

        }
    }



    return (
        <div className="row">
                <h1>Страница входа</h1>
            <div className="col s6 offset-s3">
                <h1>Сокращение ссылок</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>

                        <div className="input-field">
                            <input placeholder="Введите e-mail" id="email" type="text" className="yellow-input" name="email" onChange={changeHandler}/>
                            <label htmlFor="email">E-mail</label>
                        </div>

                        <div className="input-field">
                            <input placeholder="Введите пароль" id="password" type="password" className="yellow-input" name="password" onChange={changeHandler}/>
                            <label htmlFor="email">Пароль</label>
                        </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn yellow darken-4" style={{marginRight:"10px"}} disabled={loading}>Войти</button>
                        <button className="btn grey lighten-1 black-text" onClick={registerHandler} disabled={loading}>Регистрация</button>

                        
                    </div>
                </div>
            </div>
        </div>
    )
}