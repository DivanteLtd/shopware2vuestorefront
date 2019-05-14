
const program = require('commander')
const handle = require('./src/modules/common/commandHandler')

program
  .command('reindex <indexName> ')
  .option('-s --size <size>')
  .option('-p --page <page>')
  .action(function (indexName, cmd) {
    handle(indexName, cmd)
  })

program.parse(process.argv)
