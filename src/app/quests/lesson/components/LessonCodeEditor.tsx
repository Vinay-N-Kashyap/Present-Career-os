import React from 'react';
import { parseQuestId } from '@/lib/data/curriculumEnricher';
import { getLongLessonLanguage } from '@/lib/data/longLessonTypes';

interface LessonCodeEditorProps {
  questId: string;
  slideIdx: number;
  codeExample?: string;
  mockOutput?: string;
  codeRunning?: boolean;
  codeOutput?: string;
  /** Runs the code as currently written in the editor (students can change it). */
  onRunCode: (code: string) => void;
}

export interface LessonCodeMeta {
  fileName: string;
  commandPrompt: string;
  languageLabel: string;
}

export function resolveLessonCodeMeta(questId: string): LessonCodeMeta {
  const id = (questId || '').toLowerCase();
  const parsedPrefix = parseQuestId(questId || '')?.prefix;
  const fallbackPrefix = id.split(/-d\d+|-day/i)[0] || '';
  const prefix = parsedPrefix || fallbackPrefix;
  const language = prefix ? getLongLessonLanguage(prefix) : undefined;

  if (id.includes('react') || prefix.includes('react')) {
    return { fileName: 'app.tsx', commandPrompt: '$ npx tsx app.tsx', languageLabel: 'React / TSX' };
  }
  if (language === 'sql' || id.includes('sql') || prefix.includes('sql') || prefix.includes('dbms')) {
    return { fileName: 'query.sql', commandPrompt: '$ psql -f query.sql', languageLabel: 'PostgreSQL' };
  }
  if (language === 'cpp' || id.includes('cpp') || id.includes('iot_emb') || prefix.includes('cpp') || prefix.includes('iot_emb')) {
    return { fileName: 'main.cpp', commandPrompt: '$ g++ -O2 main.cpp && ./a.out', languageLabel: 'C++20' };
  }
  if (language === 'bash' || id.includes('bash') || id.includes('linux') || id.includes('git_vcs') || id.includes('devops') || prefix.includes('git_vcs') || prefix.includes('devops')) {
    return { fileName: 'script.sh', commandPrompt: '$ bash script.sh', languageLabel: 'POSIX Bash' };
  }
  if (language === 'typescript' || id.includes('ts-') || prefix.includes('ts') || prefix.includes('next') || prefix.includes('nestjs')) {
    return { fileName: 'main.ts', commandPrompt: '$ npx tsx main.ts', languageLabel: 'TypeScript' };
  }
  if (prefix.startsWith('java') || id.includes('java-')) {
    return { fileName: 'Solution.java', commandPrompt: '$ javac Solution.java && java Solution', languageLabel: 'Java' };
  }
  if (language === 'python' || id.includes('python') || id.includes('-py-') || prefix.endsWith('-py')) {
    return { fileName: 'main.py', commandPrompt: '$ python3 main.py', languageLabel: 'Python 3' };
  }
  return { fileName: 'main.js', commandPrompt: '$ node main.js', languageLabel: 'JavaScript' };
}

export function LessonCodeEditor({
  questId,
  slideIdx,
  codeExample,
  codeRunning,
  codeOutput,
  onRunCode,
}: LessonCodeEditorProps) {
  const [code, setCode] = React.useState(codeExample || '');
  const [copied, setCopied] = React.useState(false);

  // A new slide brings new code.
  React.useEffect(() => {
    setCode(codeExample || '');
    setCopied(false);
  }, [codeExample, slideIdx]);

  if (!codeExample) return null;

  const { fileName, commandPrompt, languageLabel } = resolveLessonCodeMeta(questId);

  const edited = code !== codeExample;
  const rows = Math.min(Math.max(code.split('\n').length, 3), 18);
  const isErrorOutput = Boolean(
    codeOutput &&
      (codeOutput.startsWith('[Error]') ||
        codeOutput.startsWith('[STDERR]') ||
        codeOutput.startsWith('[Stderr]') ||
        codeOutput.startsWith('Execution failed:') ||
        codeOutput.startsWith('Runtime Exception:') ||
        codeOutput.startsWith('TypeScript compilation failed'))
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!codeRunning) {
        onRunCode(code);
      }
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const indent = '    ';
      const newCode = code.substring(0, start) + indent + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + indent.length;
      }, 0);
    } else if (e.key === 'Enter') {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const lines = code.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      const match = currentLine.match(/^(\s+)/);
      if (match) {
        e.preventDefault();
        const baseIndent = match[1];
        const trimmed = currentLine.trim();
        const extraIndent = trimmed.endsWith(':') || trimmed.endsWith('{') ? '    ' : '';
        const fullIndent = baseIndent + extraIndent;
        const newCode = code.substring(0, start) + '\n' + fullIndent + code.substring(textarea.selectionEnd);
        setCode(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + fullIndent.length;
        }, 0);
      }
    }
  };

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div id="slide-code-execution-block" data-testid="lesson-code-editor" style={{ marginTop: 8 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg2)',
        padding: '6px 12px',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span data-testid="lesson-code-filename" style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {fileName}{edited ? ' • edited' : ''}
          </span>
          <span
            data-testid="lesson-code-lang-badge"
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: 'var(--t3)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              padding: '1px 7px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {languageLabel}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            data-testid="btn-copy-code"
            onClick={handleCopyCode}
            title="Copy code snippet"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              color: 'var(--t2)',
              fontSize: 10.5,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          {edited && (
            <button
              type="button"
              data-testid="btn-reset-code"
              onClick={() => setCode(codeExample)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: 'var(--text)',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              ↺ Reset
            </button>
          )}
          <button
            type="button"
            data-testid="btn-run-code"
            onClick={() => onRunCode(code)}
            disabled={codeRunning}
            title="Run code (Ctrl+Enter)"
            style={{
              background: codeRunning ? 'rgba(255,255,255,0.1)' : 'var(--success)',
              color: codeRunning ? 'var(--t2)' : 'var(--success-btn-fg, #ffffff)',
              fontSize: 10.5,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 6,
              cursor: codeRunning ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'background 0.2s'
            }}
          >
            {codeRunning ? '⏳ Running...' : '▶ Run Code'}
          </button>
        </div>
      </div>
      <textarea
        data-testid="lesson-code-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={rows}
        aria-label="Lesson code. You can change it and press Run Code."
        style={{
          display: 'block',
          width: '100%',
          boxSizing: 'border-box',
          resize: 'vertical',
          background: 'var(--bg3)',
          padding: '14px 18px',
          borderBottomLeftRadius: codeOutput ? 0 : 12,
          borderBottomRightRadius: codeOutput ? 0 : 12,
          fontSize: 12.5,
          lineHeight: 1.55,
          fontFamily: 'var(--font-mono)',
          color: 'var(--t1)',
          border: '1px solid var(--border)',
          borderTop: 'none',
          margin: 0,
          outline: 'none',
          whiteSpace: 'pre',
          overflowX: 'auto',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
        }}
      />
      {codeOutput && (
        <div
          data-testid="lesson-code-output"
          data-output-status={isErrorOutput ? 'error' : 'ok'}
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderTop: 'none',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            padding: '10px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: isErrorOutput ? 'var(--danger)' : 'var(--success)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: 6, fontSize: 10.5 }}>
            <span data-testid="lesson-code-prompt">{commandPrompt}</span>
            <span style={{ color: isErrorOutput ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
              {isErrorOutput ? 'Error Output' : 'Output'}
            </span>
          </div>
          {/* Keep every space, so tables and lined-up columns stay aligned; scroll sideways if too wide. */}
          <div style={{ whiteSpace: 'pre', overflowX: 'auto' }}>{codeOutput}</div>
        </div>
      )}
    </div>
  );
}
