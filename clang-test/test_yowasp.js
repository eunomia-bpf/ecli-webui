const { commands } = require('@yowasp/clang');
const fs = require('fs');

async function test() {
  const code = 'int main() { return 0; }';
  
  try {
    const files = {
      'test.c': code
    };
    const outFiles = await commands.clang(['-target', 'wasm32', '-c', 'test.c', '-o', 'test.o'], files);
    console.log("Returned:", outFiles);
    if (outFiles && outFiles['test.o']) {
      console.log("Success: test.o generated! Size:", outFiles['test.o'].length);
    } else {
      console.log("Failed: test.o not generated!");
    }
  } catch(e) {
    console.log("Exception:", e);
    if (e.files) {
        console.log("Files:", Object.keys(e.files));
    }
  }
}

test();
