export function SystemDiagram() {
  return (
    <div className="system-diagram" aria-label="A simplified agent system: input becomes context, a reasoning loop uses tools, and a human approval gate precedes action">
      <div className="diagram-stage stage-input"><span>01</span><strong>Observe</strong><small>voice · screen · event</small></div>
      <div className="diagram-line"><i></i></div>
      <div className="diagram-core">
        <span className="core-orbit"></span>
        <span className="core-pulse"></span>
        <strong>Reason</strong>
        <small>context + tools</small>
      </div>
      <div className="diagram-line"><i></i></div>
      <div className="diagram-stage stage-gate"><span>03</span><strong>Approve</strong><small>human control point</small></div>
      <div className="diagram-line"><i></i></div>
      <div className="diagram-stage stage-action"><span>04</span><strong>Act</strong><small>traceable outcome</small></div>
    </div>
  );
}
