const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })

export function graphemeLength(input: string): number {
  return Array.from(segmenter.segment(input)).length
}

export function truncateByGrapheme(input: string, max: number): string {
  const segments = Array.from(segmenter.segment(input))
  if (segments.length <= max) return input
  return segments
    .slice(0, max)
    .map((s) => s.segment)
    .join("")
}

export const MESSAGE_MAX = 100
export const NAME_MAX = 20
