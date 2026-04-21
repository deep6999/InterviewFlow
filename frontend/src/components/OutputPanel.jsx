function OutputPanel({ output }) {
  const hasMeta =
    output &&
    (output.status ||
      output.exitCode !== undefined ||
      output.time ||
      output.memory);

  const headerTitle = output?.title || "Output";

  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        {headerTitle}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <p className="text-base-content/50 text-sm">
            Click "Run Code" to see the output here...
          </p>
        ) : output.verdict === "accepted" ? (
          <div className="space-y-3">
            {hasMeta && (
              <div className="text-xs text-base-content/70 flex flex-wrap gap-3">
                <span>Status: {output.status || "success"}</span>
                {output.exitCode !== undefined && (
                  <span>Exit Code: {output.exitCode}</span>
                )}
                {output.time && <span>Time: {output.time}s</span>}
                {output.memory && <span>Memory: {output.memory} KB</span>}
              </div>
            )}

            <pre className="text-sm font-mono text-success whitespace-pre-wrap">
              {output.output}
            </pre>
          </div>
        ) : output.verdict === "wrong_answer" ? (
          <div className="space-y-4">
            <p className="text-sm text-warning">{output.error}</p>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60 mb-2">
                Your Output
              </div>
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap">
                {output.output || "No output"}
              </pre>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60 mb-2">
                Expected Output
              </div>
              <pre className="text-sm font-mono text-success whitespace-pre-wrap">
                {output.expectedOutput || "No expected output"}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {hasMeta && (
              <div className="text-xs text-base-content/70 flex flex-wrap gap-3">
                <span>Status: {output.status || "error"}</span>
                {output.exitCode !== undefined && (
                  <span>Exit Code: {output.exitCode}</span>
                )}
                {output.signal !== null && output.signal !== undefined && (
                  <span>Signal: {output.signal}</span>
                )}
                {output.time && <span>Time: {output.time}s</span>}
                {output.memory && <span>Memory: {output.memory} KB</span>}
              </div>
            )}

            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}

            <pre className="text-sm font-mono text-error whitespace-pre-wrap">
              {output.error || "Execution failed."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
