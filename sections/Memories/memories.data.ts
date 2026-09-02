export interface MemoryPanel {
  id: number
  image: string
  caption?: string
  quote?: string
  layout: "hero" | "split" | "portrait" | "wide"
}

export interface MemoryChapter {
  number: string
  title: string
  subtitle?: string
  panels: MemoryPanel[]
}

export const memoryChapters: MemoryChapter[] = [
  {
    number: "01",
    title: "The Beginning",
    subtitle: "Every story has a first page.",
    panels: [
      {
        id: 1,
        image: "/memories/memory-01.webp",
        caption: "Where it all started.",
        layout: "hero",
      },
      {
        id: 2,
        image: "/memories/memory-02.webp",
        quote: "Some moments quietly become memories.",
        layout: "split",
      },
      {
        id: 3,
        image: "/memories/memory-03.webp",
        caption: "And somehow, this became one of them.",
        layout: "portrait",
      },
    ],
  },

  {
    number: "02",
    title: "Little Moments",
    subtitle: "The small things were never really small.",
    panels: [
      {
        id: 4,
        image: "/memories/memory-04.webp",
        caption: "The moments in between.",
        layout: "wide",
      },
      {
        id: 5,
        image: "/memories/memory-05.webp",
        quote: "Maybe happiness was always hiding here.",
        layout: "split",
      },
      {
        id: 6,
        image: "/memories/memory-06.webp",
        caption: "A memory worth keeping.",
        layout: "portrait",
      },
    ],
  },
]