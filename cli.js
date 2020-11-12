var program = require('commander');
const api = require('./index.js')
program
  .version('0.1.0')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  
 

program
  .command('add')
  .description('clone a repository into a newly created directory')
  .action((source, destination) => {
    api.add()
  });

  program.parse(process.argv);

