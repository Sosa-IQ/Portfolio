export function HeadshotPlaceholder() {
  return (
    <figure className="portrait-frame" aria-label="Headshot placeholder">
      <div className="portrait-grid" aria-hidden="true">
        <span className="portrait-orbit orbit-one"></span>
        <span className="portrait-orbit orbit-two"></span>
        <span className="portrait-silhouette"></span>
        <span className="portrait-scan"></span>
      </div>
      <figcaption>
        <span>Portrait pending</span>
        <span>04:05 ratio · clean cutout</span>
      </figcaption>
    </figure>
  );
}
