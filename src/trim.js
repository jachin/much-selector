// Regex explained: https://regexr.com/4v6jg
const trim = (str, c = '\\s') =>
  str.replace(new RegExp(`^([${c}]*)(.*?)([${c}]*)$`), '$2')

export default trim;
