import { Command } from "commander";

const program = new Command();

program
  .version('0.0.1', '-v, --vers', 'output the current version');

program.parse(process.argv);

const options = program.opts();