import katex from "katex";

function Math({ tex, display = false }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
  });
  const Tag = display ? "div" : "span";
  return (
    <Tag
      className={display ? "my-4 overflow-x-auto" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default Math;
