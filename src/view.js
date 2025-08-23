
const renderError = (error, elements) => {

    const errorMessage = error.value !== undefined ? error.value.message : error.value
    if (errorMessage) {
        elements.input.classList.add('is-invalid')
    } else {
        elements.input.classList.remove('is-invalid')
    }

    if (elements.feedback.textContent !== '') {
        elements.feedback.textContent = ''
    }
    elements.feedback.textContent = errorMessage
}

const renderProcessState = (elements, process) => {
    switch (process) {
        case 'filling':
            elements.input.disabled = false
            elements.submit.disabled = false
            break

        case 'sending':
            elements.submit.disabled = true
            elements.input.disabled = true
            break

        case 'error':
            elements.submit.disabled = false
            break

        case 'success':
            elements.input.disabled = false
            elements.submit.disabled = false
            break

        default:
            throw new Error(`Unknown process ${process}`)
    }
}

const initView = elements => (path, value) => {
    switch (path) {
        case 'form.error':
            renderError(value, elements)
            break
        case 'form.processState':
            renderProcessState(elements, value)
    }
}

export default initView