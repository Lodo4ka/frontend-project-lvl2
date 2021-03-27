import { Command } from 'commander';

const program = new Command();

program
  .version('0.0.1', '-v, --vers', 'output the current version')
  .arguments('[type]')
  .option('-f, --format [type]', 'output format');

program.parse(process.argv);

program.opts();
