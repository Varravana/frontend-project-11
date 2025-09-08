import * as yup from 'yup'
import _ from 'lodash'
import onChange from 'on-change'
import initView from './view.js'
import i18next from 'i18next'
import resources from './locales/index';
import axios from 'axios';
import parser from './parser.js'
import itemCheck from './itemsCheck.js'


const duplicateUrlCheck = (list, value) => {
    const result = _.includes(list, value)
    if (result === false) {
        return true
    } else { return false }
};

const isValidRss = (value) => {
    if (value.includes('feed') || value.includes('rss')) {
        return true
    } else {return false}
}



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
            error: null
        },
        posts: {
            allPosts: [], //{ id, title, link, description}
            curentPost: {}, //текущий пост
            seenPosts: [] //просмотренные посты id уникальные const set = new Set()
        },
        feeds: [],
        links: []
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
                return duplicateUrlCheck(watchState.links, value);
            })
     //       .test("isValidRss", `${i18n.t('form.errors.validation.rssValid')}`, (value) => {
     //           return value.includes('feed');
      //      })
            .required(),
    })

    const validateForm = (fields) => {
        return schema.validate(fields, { abortEarly: false })
            .then(() => null)
            .catch(e => e.message);
    }
    // загрузка данных

    const loadData = (rssLink) => {
        watchState.processState.status = 'sending'
        watchState.form.field.value = ''
        const addProxy = () => {
            const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
            urlWithProxy.searchParams.set('url', rssLink);
            urlWithProxy.searchParams.set('disableCache', 'true')
            return urlWithProxy.toString()
        }
        const newUrl = addProxy()
        axios.get(newUrl)
            //axios.get(`https://allorigins.hexlet.app/raw?url=${encodeURIComponent(rssLink)}`,) 

            .then((response) => {
                watchState.processState.error = null
                const htmlData = response.data.contents;
                const result = parser(htmlData)
                watchState.processState.status = 'success'
                watchState.feeds.push(result.feed)
                watchState.posts.allPosts = [...watchState.posts.allPosts, ...result.items]
            })
            .catch(error => {
                console.log(error)
                watchState.processState.status = 'error'
                watchState.processState.error = `${i18n.t('loadResult.networkError')}`
            })


    }
    //элементы
    const elements = {
        input: document.getElementById('url-input'),
        submit: document.querySelector('[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        form: document.querySelector('.rss-form'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
        modal: document.querySelector('#myModal')
    }

    const watchState = onChange(state, initView(elements, i18n))

    //проверка раз в 5 секунд
    const repeatTask = () => {
        if (watchState.links.length !== 0) {
            watchState.links.forEach((link) => {
                itemCheck(watchState, link)
            })
        }
        setTimeout(repeatTask, 5000);
    }
    repeatTask()

    //события
    elements.input.addEventListener('input', (e) => {
        watchState.processState.status = 'filling'
        const value = e.target.value
        watchState.form.field.value = value
    })

    elements.posts.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-id')) {
            const id = e.target.getAttribute('data-id')
            if (!watchState.posts.seenPosts.includes(id)) {
                watchState.posts.seenPosts.push(id);
            }
            if (e.target.hasAttribute('data-bs-toogle')) {
                const index = watchState.posts.allPosts.findIndex((post) => post.id === id)
                if (index !== -1) {
                    watchState.posts.curentPost = watchState.posts.allPosts[index]
                }
                const modalWindow = new bootstrap.Modal(elements.modal)
                modalWindow.show()
            }
        }

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
                    if (isValidRss(watchState.form.field.value))
                   { watchState.links.push(url)
                    watchState.form.isValid = true
                    elements.input.value = ''
                    watchState.processState.status = 'sending'
                    loadData(url)} else {watchState.form.error = `${i18n.t('form.errors.validation.rssValid')}`}

                }
                
            })
    });

}
export { app }