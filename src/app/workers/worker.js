self.onmessage = function (e) {
  const { codigo } = e.data;
  try {
    let consoleOutput = "";
    const originalLog = console.log;
    console.log = (...args) => {
      consoleOutput += args.join(" ") + "\n";
      originalLog(...args);
    };

    let resultado = eval(codigo);
    console.log = originalLog;
    self.postMessage(consoleOutput || resultado?.toString() || "❌ No se recibió salida.");
  } catch (error) {
    self.postMessage(`❌ Error: ${error.message}`);
  }
};
