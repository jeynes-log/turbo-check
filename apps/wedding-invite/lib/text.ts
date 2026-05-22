const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })

export function graphemeLength(input: string): number {
  return Array.from(segmenter.segment(input)).length
}

export const MESSAGE_MAX = 100
