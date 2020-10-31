const scanForReference = (msg: string) => {
  const matches: string[] = [];
  const reg = /^#[0-9]+| #[0-9]+/gm;

  let m;
  while ((m = reg.exec(msg)) !== null) {
    if (m.index === reg.lastIndex) {
      reg.lastIndex += 1;
    }

    m.forEach((match) => {
      if (match && !matches.includes(match.trim())) {
        matches.push(match.trim());
      }
    });
  }

  return matches;
};

export default scanForReference;
