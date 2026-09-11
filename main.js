import { run } from './brainfuck'
import { readFileSync } from 'fs' 

function main() {
  if (process.argv.length < 3) {
    console.log(`Usage main.js code.bf "input"`);
    return 1;
  }
  
  const program = readFileSync(process.argv[2]).toString();
  const input = process.argv[3] !== undefined ? process.argv[3] : '';  
  
  const output = run(program, input);
  console.log(output);
}

main();