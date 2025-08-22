
const renderError = (error, elements) => {
    
const errorMessage = error.value !== undefined ? error.value.message : error.value
if(errorMessage) {
    elements.input.classList.add('is-invalid')
} else {
    elements.input.classList.remove('is-invalid')
}

if(elements.feedback.textContent !== '') {
   elements.feedback.textContent = '' 
}
elements.feedback.textContent = errorMessage
}

const initView = elements => (path, value) => {
switch (path) {
    case 'form.error':
        renderError(value, elements)
        break
}
}

export default initView