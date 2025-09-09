import _ from 'lodash'

const itemCheck = (state, data) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, 'text/html')
  const items = doc.querySelectorAll('item')

  const parsedItems = Array.from(items).map((item) => {
    const itemId = _.uniqueId()
    let titleElement = item.querySelector('title')
    let linkElement = item.querySelector('guid')
    let descriptionElement = item.querySelector('description')

    let title = titleElement.textContent ? titleElement.textContent : titleElement.innerHTML || ''
    let link = linkElement.textContent ? linkElement.textContent : linkElement.innerHTML || ''
    let description = descriptionElement.textContent ? descriptionElement.textContent : descriptionElement.innerHTML || ''

    const cleanTitle = title.replace(/<!\[CDATA\[(.*?)\]\]>$/g, '$1').trim()
    const cleanLink = link.replace(/<!\[CDATA\[(.*?)\]\]>$/g, '$1').trim()
    const cleanDescription = description.replace('\x3C!--[CDATA[', '').replace(']]-->', '').trim()

    return {
      id: itemId,
      title: cleanTitle,
      link: cleanLink,
      description: cleanDescription,
    }
  })
  const oldTitles = state.posts.allPosts.map((item) => {
    item.title
  })

  parsedItems.forEach((item) => {
    const isAdded = _.includes(oldTitles, item.title)
    if (!isAdded) {
      state.posts.allPosts.push(item)
    }
  })
}

export default itemCheck
