const parser = (data) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data)
  console.log(doc)
}
export default parser