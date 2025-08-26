
const renderError = (error, elements) => {

    const errorMessage = error ? error : undefined

    if (errorMessage) {
        elements.input.classList.add('is-invalid')
        elements.feedback.textContent = ''
        elements.feedback.textContent = errorMessage
    } else if (!errorMessage) {
        elements.input.classList.remove('is-invalid')
        elements.feedback.textContent = ''
    }

}

const renderFeeds = (elements, feed) => {
    const cardBorder = document.createElement('div')
    cardBorder.classList.add('card', 'border-0')
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    const h2 = document.createElement('h2')
    h2.classList.add('card-title', 'h4')
    h2.textContent = 'Фиды'
    cardBody.appendChild(h2)
    cardBorder.appendChild(cardBody)
    const ul = document.createElement('ul')
    ul.classList.add('list-group', 'border-0', 'rounded-0')
    cardBorder.appendChild(ul)

    if (feed.length !== 0) {
        feed.forEach(element => {
            let li = document.createElement('li')
            li.classList.add('list-group-item', 'border-0', 'border-end-0')
            let h3 = document.createElement('h3')
            h3.classList.add('h6', 'm-0')
            h3.textContent = element.title
            let p = document.createElement('p')
            p.classList.add('m-0', 'small', 'text-black-50')
            p.textContent = element.description

            li.appendChild(h3)
            li.appendChild(p)
            ul.appendChild(li)
            elements.feeds.appendChild(cardBorder)
        });

    }

}

const renderPosts = (elements, posts) => {
    const card= document.createElement('div')
    card.classList.add('card', 'border-0')

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    const h2 = document.createElement('h2')
    h2.classList.add('card-title', 'h4')
    h2.textContent = 'Посты'
    cardBody.appendChild(h2)

    const ul = document.createElement('ul')
    ul.classList.add('list-group', 'border-0', 'rounded-0')

    card.appendChild(cardBody)
    card.appendChild(ul)

    if(posts.length !==0) {
        posts.forEach((post) => {
            let li = document.createElement('li')
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')
            
            let a = document.createElement('a')
            a.classList.add('fw-bold')
            a.setAttribute('href', `${post.link}`)
            a.setAttribute('data-id', `${post.feedId}`)
            a.setAttribute('target', '_blank')
            a.textContent = post.title

            let button = document.createElement('button')
            button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
            button.setAttribute('data-id', `${post.feedId}`)
            button.setAttribute('data-bs-toogle', 'modal')
            button.setAttribute('data-bs-target', '#modal')
            button.textContent = 'Просмотр'

            li.appendChild(a)
            li.appendChild(button)
            ul.appendChild(li)
            
        })
        elements.posts.appendChild(card)
    }
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

const initView = (elements) => (path, value) => {
    switch (path) {
        case 'form.error':
            renderError(value, elements)
            break
        case 'processState.status':
            renderProcessState(elements, value)
            break
        case 'feeds':
            renderFeeds(elements, value)
            break
        case 'posts.allPosts':
            renderPosts(elements, value)
            break
    }
}

export default initView