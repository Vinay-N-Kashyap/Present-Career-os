/**
 * Runs Python in the browser for lessons, using Pyodide (real CPython compiled to WebAssembly)
 * served from /pyodide/ on PinIT's own site. The first run downloads about 13 MB and takes a few
 * seconds; later runs are fast. Code that runs too long (an endless loop) is stopped and the
 * worker is restarted.
 */
export interface PythonRunResult {
  success: boolean;
  stdout: string;
  error?: string;
  durationMs: number;
  events?: Array<[number, number, Record<string, unknown>]>;
  truncated?: boolean;
}

let worker: Worker | null = null;
let nextId = 1;
let isInitialized = false;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker('/python-worker.js');
    isInitialized = false;
  }
  return worker;
}

function resetWorker() {
  worker?.terminate();
  worker = null;
  isInitialized = false;
}

export function runPythonInBrowser(
  code: string,
  timeoutMs = 15000,
  options?: { trace?: boolean; tracerSource?: string }
): Promise<PythonRunResult> {
  const started = Date.now();
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    return Promise.resolve({ success: false, stdout: '', error: 'Python can only run in the browser.', durationMs: 0 });
  }
  // Allow longer timeout on initial boot while WASM downloads/compiles.
  // Once ready, user code execution is limited to detect endless loops.
  const effectiveTimeoutMs = isInitialized ? Math.min(timeoutMs, 10000) : Math.max(timeoutMs, 25000);
  const id = nextId++;
  const w = getWorker();
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      w.removeEventListener('message', onMessage);
      resetWorker();
      resolve({
        success: false,
        stdout: '',
        error: isInitialized
          ? `Stopped after ${Math.round(effectiveTimeoutMs / 1000)} seconds. Is there an endless loop?`
          : 'Python startup timed out. Check your internet connection and try again.',
        durationMs: Date.now() - started
      });
    }, effectiveTimeoutMs);
    function onMessage(event: MessageEvent) {
      const data = event.data || {};
      if (data.id !== id) return;
      isInitialized = true;
      clearTimeout(timer);
      w.removeEventListener('message', onMessage);
      resolve({
        success: Boolean(data.ok),
        stdout: data.stdout || '',
        error: data.error,
        events: data.events,
        truncated: data.truncated,
        durationMs: Date.now() - started,
      });
    }
    w.addEventListener('message', onMessage);
    w.addEventListener('error', (err) => {
      clearTimeout(timer);
      resetWorker();
      const msg = (err && (err as any).message) || 'Check your internet connection and try again.';
      resolve({ success: false, stdout: '', error: `Python could not start: ${msg}`, durationMs: Date.now() - started });
    }, { once: true });
    w.postMessage({ id, code, trace: options?.trace, tracerSource: options?.tracerSource });
  });
}
