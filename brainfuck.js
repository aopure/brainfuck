const MEMORY_SIZE = 30000;
const CELL_MAX = 256;

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
      const p = loops.pop();

      loopMap[p] = i;
      loopMap[i] = p;
    }
  }
  
  return !openCount;
}

export function run(program, input) {
  const loopMap = {};

  if(!isValid(program, loopMap)) {
    throw Error('Syntax error');
  }

  const memory = new Array(MEMORY_SIZE).fill(0);

  let inputPointer = 0;
  let pointer = 0;

  let output = '';

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
        memory[pointer] = (memory[pointer] + 1 + CELL_MAX) % CELL_MAX;
        break;

      case '-':
        memory[pointer] = (memory[pointer] - 1 + CELL_MAX) % CELL_MAX
        break;

      case '[':
        if (memory[pointer] === 0) {
          i = loopMap[i];
        }
        break;

      case ']': 
        if (memory[pointer] !== 0) {
          i = loopMap[i];
        }
        break;
      
      case '.': 
        output += String.fromCharCode(memory[pointer]);
        break;
      
      case ',': 
        if (inputPointer < input.length) {
          memory[pointer] = input[inputPointer].charCodeAt(0);
          inputPointer++;
        } else {
          memory[pointer] = 0;
        }
        break;

      default: 
        continue;
    }
  }
  
  return output;
}