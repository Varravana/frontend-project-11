import _ from 'lodash'

const parser = (data) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, 'text/html')
  const feedTitle = doc.title
  const cleanTitle = feedTitle.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
  const feedDescriptionBlock = doc.querySelector('channel > description')
  let feedDescription = ''
  if (!feedDescriptionBlock) {
    feedDescription = ''
  }
  else {
    feedDescription = feedDescriptionBlock.innerHTML ? feedDescriptionBlock.innerHTML : feedDescriptionBlock.textContent
  }
  const cleanDescription = feedDescription.replace('\x3C!--[CDATA[', '').replace(']]-->', '')
  const feedId = _.uniqueId()
  const feedInfo = { id: feedId, title: cleanTitle, description: cleanDescription }

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
      // feedId: feedId,
      id: itemId,
      title: cleanTitle,
      link: cleanLink,
      description: cleanDescription,
    }
  })

  const feedElements = { feed: feedInfo, items: parsedItems }

  return feedElements
}
export default parser
