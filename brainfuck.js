import { readFileSync } from 'fs'

const MEMORY_SIZE = 30000;
const CELL_MAX = 255;

function isValid(program, loopMap) {
  const loops = [];
  let openCount = 0;
  for(let i = 0; i < program.length; i++) {
    const char = program[i];
    if(char === '[') {
      loops.push(i);
      openCount++;
      continue;
    } 
    
    if(char === ']') {
      if(openCount === 0) return false;
      openCount--;
      loopMap[loops.pop()] = i;
    }
  }
  
  return !openCount;
}

function executeProgram(program, input, loopMap) {
  const memory = new Array(MEMORY_SIZE).fill(0);
  const loops = [];

  let inputPointer = 0;
  let pointer = 0;

  for (let i = 0; i < program.length; i++) {
    const char = program[i];

    switch (char) {
      case '>':
        pointer++;
        if(pointer >= MEMORY_SIZE) throw Error('Memory pointer incremented above its limit');
        break;

      case '<':
        if(pointer === 0) throw Error('Memory pointer decremented below 0');
        pointer--;
        break;

      case '+':
        memory[pointer]++;
        if (memory[pointer] > CELL_MAX) memory[pointer] = 0;
        break;

      case '-':
        memory[pointer]--;
        if (memory[pointer] < 0) memory[pointer] = CELL_MAX;
        break;

      case '[':
        if (memory[pointer] === 0) {
          i = loopMap[i];
        } else {
          loops.push(i);
        }
        break;

      case ']': 
        if (memory[pointer] === 0) {
          if (loopMap[loops[loops.length-1]] === i) loops.pop(); 
        } else {
          i = loops[loops.length-1];
        }
        break;
      
      case '.': 
        process.stdout.write(String.fromCharCode(memory[pointer]));
        break;
      
      case ',': 
        if (inputPointer < input.length) {
          memory[pointer] = input[inputPointer].charCodeAt(0);
          inputPointer++;
        } else {
          memory[pointer] = 0;
        }
        break

      default: 
        continue;
    }
  }
}

function main() {
  if (process.argv.length < 3) {
    console.log(`Usage brainfuck.js code.bf "input"`);
    return 1;
  }
  
  const program = readFileSync(process.argv[2]).toString();
  const input = process.argv[3] !== undefined ? process.argv[3] : '';  

  const loopMap = {};

  if(!isValid(program, loopMap)) {
    console.log('The program is invalid');
    return 1;
  }
  
  executeProgram(program, input, loopMap);
}

main();