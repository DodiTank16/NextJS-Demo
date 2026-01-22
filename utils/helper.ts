const createLetterSpans = (word: string) => {
  const container = document.createElement("span");
  container.style.display = "inline-block";

  word.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    container.appendChild(span);
  });

  return container;
};

const buildMagneticWord = (word: string) => {
  const wrapper = document.createElement("span");
  wrapper.style.display = "inline-block";
  wrapper.style.position = "relative";
  wrapper.style.whiteSpace = "nowrap";

  const letters: HTMLSpanElement[] = [];

  word.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    span.style.color = "white"; // 🔴 IMPORTANT
    wrapper.appendChild(span);
    letters.push(span);
  });

  return { wrapper, letters };
};

export { createLetterSpans, buildMagneticWord };
