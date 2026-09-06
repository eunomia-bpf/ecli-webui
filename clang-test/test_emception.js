const emception = require('emception');
const fs = require('fs');

async function test() {
  await emception.init();
  console.log("Emception initialized.");
  
  const code = 'int main() { return 0; }';
  emception.fileSystem.writeFile('/test.c', code);
  
  try {
    emception.onStdout = (str) => console.log('stdout:', str);
    emception.onStderr = (str) => console.error('stderr:', str);
    
    console.log("Running clang...");
    const exitCode = await emception.run('clang', ['-target', 'bpf', '-c', '/test.c', '-o', '/test.o']);
    console.log("Clang exit code:", exitCode);
    
    if (exitCode === 0) {
      const out = emception.fileSystem.readFile('/test.o');
      console.log("Success! Output size:", out.length);
    }
  } catch(e) {
    console.error("Exception:", e);
  }
}

test();
