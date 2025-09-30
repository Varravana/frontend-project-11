import _ from 'lodash'

const parser = (data) => {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(data, 'text/html')

    if (doc.querySelector('parsererror')) {
      throw new Error('Ошибка парсера')
    }

    const feedTitle = doc.querySelector('channel > title')

    const cleanTitle = feedTitle.textContent.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')

    const feedDescriptionBlock = doc.querySelector('channel > description')
    let feedDescription = ''

    if (feedDescriptionBlock) {
      feedDescription = feedDescriptionBlock.innerHTML ? feedDescriptionBlock.innerHTML : feedDescriptionBlock.textContent
    }

    const cleanDescription = feedDescription
      .replace('\x3C!--[CDATA[', '')
      .replace(']]-->', '')

    const feedId = _.uniqueId()
    const feedInfo = {
      id: feedId,
      title: cleanTitle,
      description: cleanDescription,
    }

    const items = doc.querySelectorAll('item')
    const parsedItems = Array.from(items).map((item) => {
      const itemId = _.uniqueId()

      let titleElement = item.querySelector('title')
      let linkElement = item.querySelector('guid')
      let descriptionElement = item.querySelector('description')

      let title = titleElement.textContent ? titleElement.textContent : titleElement.innerHTML || ''
      let link = linkElement.textContent ? linkElement.textContent : linkElement.innerHTML || ''
      let description = descriptionElement.textContent ? descriptionElement.textContent : descriptionElement.innerHTML || ''

      const cleanTitle = title
        .replace(/<!\[CDATA\[(.*?)\]\]>$/g, '$1')
        .trim()

      const cleanLink = link
        .replace(/<!\[CDATA\[(.*?)\]\]>$/g, '$1')
        .trim()

      const cleanDescription = description
        .replace('\x3C!--[CDATA[', '')
        .replace(']]-->', '')
        .trim()

      return {
        id: itemId,
        title: cleanTitle,
        link: cleanLink,
        description: cleanDescription,
      }
    })

    return {
      feed: feedInfo,
      items: parsedItems,
      status: 'success',
    }
  }
  catch (error) {
    console.error('Ошибка сети:', error.message)
    return {
      status: 'Ошибка сети',
      error: error.message,
    }
  }
}

export default parser
