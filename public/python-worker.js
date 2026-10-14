/* Runs student Python in the browser with Pyodide (self-hosted in /pyodide/, see
 * scripts/utils/copy-pyodide.cjs). One run at a time. The page terminates this worker on a
 * timeout (for example an endless loop) and starts a new one. */
let pyodideReady = null;

async function getPyodide() {
  if (!pyodideReady) {
    pyodideReady = (async () => {
      // 1. Try local self-hosted pyodide first (/pyodide/)
      try {
        if (typeof loadPyodide === 'undefined') {
          importScripts('/pyodide/pyodide.js');
        }
        if (typeof loadPyodide === 'function') {
          return await loadPyodide({ indexURL: '/pyodide/' });
        }
      } catch (_localErr) {
        // Local files not deployed or returned 404, fall back to official CDN
      }

      // 2. Fallback to official Pyodide CDN
      try {
        if (typeof loadPyodide === 'undefined') {
          importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
        }
        if (typeof loadPyodide === 'function') {
          return await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' });
        }
        throw new Error('loadPyodide unavailable from CDN');
      } catch (cdnErr) {
        throw new Error('Pyodide engine failed to start: ' + ((cdnErr && cdnErr.message) || String(cdnErr)));
      }
    })();
  }
  return pyodideReady;
}

self.onmessage = async (event) => {
  const { id, code, trace, tracerSource } = event.data || {};
  const out = [];
  try {
    const pyodide = await getPyodide();
    pyodide.setStdout({ batched: (line) => out.push(line) });
    pyodide.setStderr({ batched: (line) => out.push(line) });

    if (trace && tracerSource) {
      const tg = pyodide.globals.get('dict')();
      pyodide.runPython(tracerSource, { globals: tg });
      const g = pyodide.globals.get('dict')();
      g.set('__name__', '__main__');

      let traceError = '';
      try {
        const runFn = tg.get('run');
        runFn(code, g);
      } catch (err) {
        const message = String((err && err.message) || err);
        const lines = message.trim().split('\n');
        traceError = lines[lines.length - 1] || message;
      }

      let events = [];
      let truncated = false;
      try {
        const evPy = tg.get('EV');
        events = evPy.toJs({ dict_converter: Object.fromEntries });
        const statePy = tg.get('STATE');
        const stateJs = statePy.toJs({ dict_converter: Object.fromEntries });
        truncated = Boolean(stateJs.trunc);
      } finally {
        tg.destroy();
        g.destroy();
      }

      self.postMessage({
        id,
        ok: !traceError,
        stdout: out.join('\n'),
        error: traceError || undefined,
        events,
        truncated,
      });
      return;
    }

    // A fresh namespace for every run, so one run's variables never leak into the next.
    const globals = pyodide.globals.get('dict')();
    globals.set('__name__', '__main__');
    try {
      await pyodide.runPythonAsync(code, { globals });
    } finally {
      globals.destroy();
    }
    self.postMessage({ id, ok: true, stdout: out.join('\n') });
  } catch (err) {
    const message = String((err && err.message) || err);
    // Keep only the useful last line of a Python traceback, e.g. "NameError: name 'x' is not defined".
    const lines = message.trim().split('\n');
    self.postMessage({ id, ok: false, stdout: out.join('\n'), error: lines[lines.length - 1] || message });
  }
};
