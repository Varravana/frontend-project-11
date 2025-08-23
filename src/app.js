import * as yup from 'yup'
import _ from 'lodash'
import onChange from 'on-change'
import initView from './view.js'
import i18next from 'i18next'
import resources from './locales/index';


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
            error: {},
            isValid: false
        },
        processState: {
            status: '', //filling, sending, error, success
            error: []
        },
        posts: [],
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
                return duplicateUrlCheck(watchState.posts, value);
            })
            .required(),
    })

    const validateForm = (fields) => {
        return schema.validate(fields, { abortEarly: false })
            .then(() => ({}))
            .catch(e => _.keyBy(e.inner, 'path'));
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
        watchState.processState.status = 'sending'
        watchState.form.isValid = false

        validateForm(watchState.form.field)
            .then((error) => {
                watchState.form.error = error;
                if (Object.keys(error).length === 0) {
                    watchState.form.isValid = true
                } else {
                    watchState.form.isValid = false
                }
            })
            .then(() => {
                if (watchState.form.isValid === true) {
                    watchState.posts.push(watchState.form.field.value);
                    elements.input.value = '';
                    watchState.processState.status = 'success'
                } else {
                    watchState.processState.status = 'filling'
                }

            }
            )
            .catch((error) => {
                console.error('Unexpected validation error:', error);
            });


    });

}
export { app }