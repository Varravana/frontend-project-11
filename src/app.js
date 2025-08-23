import * as yup from 'yup'
import _ from 'lodash'
import onChange from 'on-change'
import initView from './view.js'


const duplicateUrlCheck = (list, value) => {
const result =  _.includes(list, value)
if(result === false) {
    return true
} else {return false}
};

const app = () => {

    const state = {
        form: {
            field: {
                value: '',
            },
            error: {}
        },
        rssList: []
    }

    const schema = yup.object().shape({
    value: yup
    .string()
    .url('Ссылка должна быть валидным URL')
    .test("Unique", "Такой URL уже добавлен", (value) => {
      return duplicateUrlCheck(state.rssList, value);
    })
    .required('Это обязательное поле'),
})

const validate = (fields) => {
  return schema.validate(fields, { abortEarly: false })
    .then(() => ({}))  
    .catch(e => _.keyBy(e.inner, 'path'));  
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

})

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  watchState.form.error = {};

  validate(watchState.form.field) 
    .then((error) => {
      watchState.form.error = error;
      if (Object.keys(error).length === 0) {
        state.rssList.push(watchState.form.field.value);
        elements.input.value = '';
      }
    })
    .catch((error) => {
    
      console.error('Unexpected validation error:', error);
    });
});

}
export { app }