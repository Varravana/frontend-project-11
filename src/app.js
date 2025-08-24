import * as yup from 'yup'
import _ from 'lodash'
import onChange from 'on-change'
import initView from './view.js'
import i18next from 'i18next'
import resources from './locales/index';
import axios from 'axios';


const duplicateUrlCheck = (list, value) => {
    const result = _.includes(list, value)
    if (result === false) {
        return true
    } else { return false }
};

const app = () => {
    //переводчик
    const i18n = i18next.createInstance();
    i18n.init({
        lng: 'ru',
        debug: true,
        resources: {
            ru: resources.ru
        },
    }).then(() => {
        console.log('Инициализация завершена');
    }).catch((error) => {
        console.error('Ошибка инициализации:', error);
    });

    //статус
    const state = {
        form: {
            field: {
                value: '',
            },
            error: null,
            isValid: true
        },
        processState: {
            status: '', //filling, sending, error, success
            error: []
        },
        posts: {
            alPosts: [], //{id, text}
            curentPost: '', //id текущий пост
            seenPosts: [] //просмотренные посты id уникальные const set = new Set()
        },
        feeds: [],
    }

    // валидация формы
    yup.setLocale({
        string: {
            required: `${i18n.t('form.errors.validation.required')}`,
            url: `${i18n.t('form.errors.validation.url')}`,
            //unique: `${i18n.t('form.errors.validation.unique')}`
        }
    })

    const schema = yup.object().shape({
        value: yup
            .string()
            .url()
            .test("unique", `${i18n.t('form.errors.validation.unique')}`, (value) => {
                return duplicateUrlCheck(watchState.feeds, value);
            })
            .required(),
    })

    const validateForm = (fields) => {
        return schema.validate(fields, { abortEarly: false })
            .then(() => null)
            .catch(e => e.message);
    }
    // загрузка данных

    const loadData = (url) => {
        watchState.processState.status = 'sending'
        watchState.feeds.push(url);
        //watchState.form.field.value = ''
        axios.get(url)
        .then((data) => {
            console.log(data)
            watchState.processState.status = 'success'
        })
        .catch(error => {
            console.log(error)
            watchState.processState.status = 'error'
            watchState.processState.error = error
        })
        
        
    }
    //элементы
    const elements = {
        input: document.getElementById('url-input'),
        submit: document.querySelector('[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        form: document.querySelector('.rss-form')
    }

    const watchState = onChange(state, initView(elements))

    //события
    elements.input.addEventListener('input', (e) => {
        watchState.processState.status = 'filling'
        const value = e.target.value
        watchState.form.field.value = value
    })

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        let url = watchState.form.field.value
        validateForm(watchState.form.field)
            .then((error) => {
                watchState.form.error = error;
                if (error) {
                    watchState.form.isValid = false
                    watchState.processState.status = 'filling'
                } else {
                    watchState.form.isValid = true
                    elements.input.value = ''
                    loadData(url)

                }
            })
    });

}
export { app }