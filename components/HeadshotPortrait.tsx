import Image from "next/image";

export function HeadshotPortrait() {
  return (
    <figure className="portrait-frame">
      <div className="portrait-grid">
        <span className="portrait-orbit orbit-one" aria-hidden="true"></span>
        <span className="portrait-orbit orbit-two" aria-hidden="true"></span>
        <Image
          alt="Jancarlos Sosa wearing a gray suit and striped tie"
          className="portrait-image"
          fill
          priority
          sizes="(max-width: 720px) 320px, 390px"
          src="/images/jancarlos-sosa-portrait.webp"
        />
        <span className="portrait-scan" aria-hidden="true"></span>
      </div>
      <figcaption>
        <span>Jancarlos Sosa</span>
        <span>AI Engineer</span>
      </figcaption>
    </figure>
  );
}
