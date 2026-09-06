const { Emception } = require('./node_modules/.pnpm/emception@1.0.15/node_modules/emception/emception.js');

async function test() {
  const emception = new Emception();
  emception.onprint = console.log;
  emception.onprintErr = console.error;
  
  await emception.init();
  console.log("Emception initialized.");
  
  const code = 'int main() { return 0; }';
  emception.fileSystem.writeFile('/test.c', code);
  
  try {
    console.log("Running clang...");
    const result = await emception.run('clang', '-target', 'bpf', '-c', '/test.c', '-o', '/test.o');
    console.log("Clang exit code:", result.returncode);
    if (result.returncode === 0) {
      const out = emception.fileSystem.readFile('/test.o');
      console.log("Success! Output size:", out.length);
    }
  } catch(e) {
    console.error("Exception:", e);
  }
}

test();
