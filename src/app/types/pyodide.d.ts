declare global {
  interface Window {
    loadPyodide: () => Promise<PyodideInterface>;
  }
}

export interface PyodideInterface {
  runPython: (code: string) => any;
  runPythonAsync: (code: string) => Promise<any>;
}

export {};
