const puppeteer = require('puppeteer')

const browserOptions = {
  headless: true,
  args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox']
}
const pageOptions = {
  viewport: {
    width: 1600,
    height: 1200
  },
  goto: {
    waitUntil: 'networkidle',
    networkIdleTimeout: 2000
  },
  pdf: {
    format: 'A4',
    printBackground: true
  }
}

let browser
let page

const init = () => {
  return puppeteer.launch(browserOptions).then((b) => {
    browser = b
    return browser.newPage()
  }).then((p) => {
    page = p
    page.on('console', (...args) => console.log(...args))
    page.on('error', (error) => {
      console.log(error)
      browser.close()
    })

    page.setViewport(pageOptions.viewport)
    page.emulateMedia('print')
  })
}

const close = () => {
  return browser.close()
}

const print = (uri, path = null) => {
  return page.goto(uri, pageOptions.goto).then(() => {
    const options = Object.assign({ path }, pageOptions.pdf)
    return page.pdf(options)
  })
}

module.exports = {
  init,
  close,
  print
}
