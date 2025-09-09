const renderError = (error, elements) => {
  const errorMessage = error ? error : undefined
  if (errorMessage) {
    elements.input.classList.add('is-invalid')
    elements.feedback.textContent = ''
    elements.feedback.textContent = errorMessage
    elements.feedback.classList.remove('text-success')
    elements.feedback.classList.add('text-danger')
  }
  else if (!errorMessage) {
    elements.input.classList.remove('is-invalid')
    elements.feedback.textContent = ''
  }
}

const renderFeeds = (elements, feed, i18n) => {
  elements.feeds.textContent = ''
  const cardBorder = document.createElement('div')
  cardBorder.classList.add('card', 'border-0')
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const h2 = document.createElement('h2')
  h2.classList.add('card-title', 'h4')
  h2.textContent = `${i18n.t('content.feeds.head')}`
  cardBody.appendChild(h2)
  cardBorder.appendChild(cardBody)
  const ul = document.createElement('ul')
  ul.classList.add('list-group', 'border-0', 'rounded-0')
  cardBorder.appendChild(ul)

  if (feed.length !== 0) {
    feed.forEach((element) => {
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
    })
  }
}

const renderPosts = (elements, posts, i18n) => {
  elements.posts.textContent = ''
  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const h2 = document.createElement('h2')
  h2.classList.add('card-title', 'h4')
  h2.textContent = `${i18n.t('content.posts.head')}`
  cardBody.appendChild(h2)

  const ul = document.createElement('ul')
  ul.classList.add('list-group', 'border-0', 'rounded-0')

  card.appendChild(cardBody)
  card.appendChild(ul)

  if (posts.length !== 0) {
    posts.forEach((post) => {
      let li = document.createElement('li')
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

      let a = document.createElement('a')
      a.classList.add('fw-bold')
      a.setAttribute('href', `${post.link}`)
      a.setAttribute('data-id', `${post.id}`)
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
      a.textContent = post.title

      let button = document.createElement('button')
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
      button.setAttribute('data-id', `${post.id}`)
      button.setAttribute('data-bs-toogle', 'modal')
      button.setAttribute('data-bs-target', '#myModal')
      button.textContent = `${i18n.t('content.posts.buttons')}`

      li.appendChild(a)
      li.appendChild(button)
      ul.appendChild(li)
    })
    elements.posts.appendChild(card)
  }
}

const renderVisitPosts = (id) => {
  id.forEach((postId) => {
    let element = document.querySelector(`[data-id="${postId}"]`)
    element.classList.remove('fw-bold')
    element.classList.add('fw-normal')
    element.classList.add('link-secondary')
  })
}

const renderModal = (elements, curentPost, i18n) => {
  const modal = elements.modal

  const title = modal.querySelector('.modal-title')
  title.textContent = curentPost.title

  const text = modal.querySelector('.modal-body')
  text.textContent = curentPost.description

  const buttonReadMore = modal.querySelector('.btn-primary')
  buttonReadMore.innerText = `${i18n.t('modal.readMoreButton')}`
  buttonReadMore.setAttribute('href', curentPost.link)

  const closeButton = modal.querySelector('.btn-secondary')
  closeButton.textContent = `${i18n.t('modal.closeButton')}`
}

const renderProcessState = (elements, process, i18n) => {
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
      elements.input.disabled = false
      break

    case 'success':
      elements.input.disabled = false
      elements.submit.disabled = false
      elements.feedback.textContent = ''
      elements.feedback.textContent = `${i18n.t('loadResult.success')}`
      elements.feedback.classList.remove('text-danger')
      elements.feedback.classList.add('text-success')
      break

    default:
      throw new Error(`Unknown process ${process}`)
  }
}

const renderProcessError = (elements, error) => {
  const errorMessage = error ? error : undefined

  if (errorMessage) {
    elements.feedback.textContent = ''
    elements.feedback.textContent = errorMessage
    elements.feedback.classList.remove('text-success')
    elements.feedback.classList.add('text-danger')
  }
  else if (!errorMessage) {
    elements.feedback.textContent = ''
  }
}

const initView = (elements, i18n) => (path, value) => {
  switch (path) {
    case 'form.error':
      renderError(value, elements)
      break
    case 'processState.status':
      renderProcessState(elements, value, i18n)
      break
    case 'feeds':
      renderFeeds(elements, value, i18n)
      break
    case 'posts.allPosts':
      renderPosts(elements, value, i18n)
      break
    case 'processState.error':
      renderProcessError(elements, value)
      break
    case 'posts.seenPosts':
      renderVisitPosts(value)
      break
    case 'posts.curentPost':
      renderModal(elements, value, i18n)
      break
  }
}

export default initView
