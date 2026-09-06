const { Emception } = require('./node_modules/emception/emception.js');
async function test() {
  const emception = new Emception();
  await emception.init();
  try {
    emception.fileSystem.mkdir('/bpf');
    console.log("mkdir success");
  } catch(e) {
    console.error("mkdir error:", e);
  }
}
test();
