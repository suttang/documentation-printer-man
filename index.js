const ProgressBar = require('progress')
const { init, close, print } = require('./printer')
const { crawl } = require('./crawl')

const entrypoint = process.env.ENTRY_POINT || 'http://example.com/'
const dest = process.env.DEST || '.'

const main = async () => {
  await init()

  const pages = await crawl(entrypoint)

  // Blank line
  console.log('')

  const progress = new ProgressBar('Print progress |:bar| :percent | :current/:total', {
    width: 50,
    total: pages.length,
    complete: '\u2588',
    incomplete: '\u2591'
  })

  for (const page of pages) {
    const { uri, title } = page
    progress.tick()
    await print(uri, `${dest}/${title}.pdf`)
  }

  await close()
}

main()
