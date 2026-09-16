export const birthdayConfig = {
  // =========================
  // PERSON
  // =========================

  person: {
    name: "Nana Onana",
    nickname: "Nana",
  },

  // =========================
  // BIRTHDAY
  // =========================

  birthday: {
    date: "17 September 2026",
    target: "2026-09-17T00:00:00",
  },

  // =========================
  // HERO
  // =========================

  hero: {
    eyebrow: "For someone special",
    title: "Happy Birthday",
    subtitle: "A little experience made just for you.",
  },

  // =========================
  // TIMELINE
  // =========================

  timeline: [
    {
      date: "The beginning",
      title: "The first time we met",
      description:
        "Sometimes the smallest moments become the beginning of something beautiful.",
      image: "/images/timeline/01.jpg",
    },

    {
      date: "A little closer",
      title: "Getting to know you",
      description:
        "Little conversations slowly turned into moments worth remembering.",
      image: "/images/timeline/02.jpg",
    },

    {
      date: "One special moment",
      title: "Our first call",
      description:
        "A simple call, but somehow it became one of those moments that stayed.",
      image: "/images/timeline/03.jpg",
    },

    {
      date: "Together",
      title: "Late nights",
      description:
        "Some of the best memories were made when we were supposed to be sleeping.",
      image: "/images/timeline/04.jpg",
    },
  ],

  // =========================
  // LETTER
  // =========================

  letter: {
    greeting: "Dear Dea,",

    content:
      "Today is a little reminder of how special you are and how many beautiful moments are still waiting for you.",

    closing: "With love,",
  },

  // =========================
  // VOICE NOTE
  // =========================

  voiceNote: {
    audio: "/audio/birthday-message.mp3",

    title: "A little message for you",

    description:
      "Some things are better heard than written.",
  },

  // =========================
  // COUNTDOWN
  // =========================

  countdown: {
    eyebrow: "Just a little longer",
    title: "Until your special day",
    footer: "Every second brings us a little closer.",
    finished: "The wait is over",
  },

  // =========================
  // FINALE
  // =========================

  finale: {
    eyebrow: "And finally...",

    title: "Happy Birthday",

    message:
      "May this new chapter bring you beautiful moments, genuine happiness, and countless reasons to smile.",

    signature: "Made with love",
  },

  // =========================
  // PHOTOBOOTH
  // =========================

  photobooth: {
    title: "Three little moments",

    description:
      "Take three little moments from today and turn them into something worth keeping.",

    instruction: {
      first: "Just smile. This is the first one ♡",
      second: "One more. Make this one fun.",
      third: "Last one. Make it count.",
    },

    labels: ["01", "02", "03"],
  },

  // =========================
  // SEO / METADATA
  // =========================

  meta: {
    title: "Happy Birthday, Dea Chintya",

    description:
      "A little birthday experience made with love.",
  },
} as const