declare global {
  interface Window {
    Javapoly?: {
      runSnippet: (code: string) => Promise<string>;
    };
    loadPyodide: () => Promise<PyodideInterface>; // ✅ Aseguramos que siempre es una función
  }
}
