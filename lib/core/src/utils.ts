// Trim dots from the start and end of a string, i.e ".foo.bar." -> "foo.bar"
// sourced from https://stackoverflow.com/a/55292366/7753036
export const trimDots = (text: string) => {
  let start = 0
  let end = text.length

  while (start < end && text[start] === '.') ++start

  while (end > start && text[end - 1] === '.') --end

  return start > 0 || end < text.length ? text.substring(start, end) : text
}
