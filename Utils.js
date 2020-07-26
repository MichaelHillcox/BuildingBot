module.exports.scanForReference = (msg) => {
  matches = []
  
  reg = /^#[0-9]+| #[0-9]+/gm
  while ((m = reg.exec(msg)) !== null) {
    // console.log(m)
    if (m.index === reg.lastIndex) {
      reg.lastIndex++;
    }
    
    m.forEach((match) => {
      if (match && !matches.includes(match.trim())) {
        matches.push(match.trim())
      }
    });
  }
  
  return matches
}