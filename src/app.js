import * as yup from 'yup'
import _ from 'lodash'
import onChange from 'on-change'
import initView from './view.js'

const schema = yup.object().shape({
    value: yup.string().url('Ссылка должна быть валидным URL').required('Это обязательное поле'),
})

const validate = (fields) => {
    try {
        schema.validateSync(fields, { abortEarly: false })
        return {}
    }
    catch (e) {
        return _.keyBy(e.inner, 'path')
    }
}



const app = () => {

    const state = {
        form: {
            field: {
                value: '',
            },
            error: {}
        }
    }

const elements = {
    input: document.getElementById('url-input'),
    submit: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('.rss-form')
}

const watchState = onChange(state, initView(elements))

elements.input.addEventListener('input', (e) => {
const value = e.target.value
watchState.form.field.value = value
//const error = validate(watchState.form.field)
//watchState.form.error = error
})

elements.form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const error = validate(watchState.form.field)
    watchState.form.error = error
})

}
export { app }