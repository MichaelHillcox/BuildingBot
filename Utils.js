module.exports.scanForReference = (msg) => {
  matches = []
  
  reg = /#[0-9]+/gm
  while ((m = reg.exec(msg)) !== null) {
    if (m.index === reg.lastIndex) {
      reg.lastIndex++;
    }
    
    m.forEach((match) => !matches.includes(match) && matches.push(match));
  }
  
  return matches
}