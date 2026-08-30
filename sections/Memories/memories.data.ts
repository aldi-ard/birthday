export interface Memory {
  id: number
  image: string
  title: string
  description: string
}

export const memories: Memory[] = [
  {
    id: 1,
    image: "/memories/memory-01.jpg",
    title: "The beginning",
    description:
      "Every beautiful story starts with a simple moment.",
  },
  {
    id: 2,
    image: "/memories/memory-02.jpg",
    title: "Little moments",
    description:
      "Some of the smallest moments become the ones we remember the most.",
  },
  {
    id: 3,
    image: "/memories/memory-03.jpg",
    title: "Still remembering",
    description:
      "Time moves forward, but some memories stay with us.",
  },
]