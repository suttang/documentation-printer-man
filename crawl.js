const cheerio = require('cheerio')
const Crawler = require('simplecrawler')

const crawl = (entrypoint) => {
  return new Promise((resolve) => {
    const crawler = new Crawler(entrypoint)
    const collection = []

    // Setup crawler options
    crawler.supportedMimeTypes = [/^text\/html/i]
    crawler.downloadUnsupported = false
    crawler.interval = 100

    crawler.on('fetchcomplete', (queueItem, responseBuffer) => {
      const $ = cheerio.load(responseBuffer.toString())
      console.log(`Page detected: ${queueItem.url}`)
      collection.push({
        uri: queueItem.url,
        title: $('title').text()
      })
    })

    crawler.on('complete', () => {
      crawler.removeAllListeners()
      resolve(collection)
    })

    crawler.start()
  })
}

module.exports = {
  crawl
}
