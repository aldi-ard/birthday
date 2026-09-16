export interface TimelineEvent {
  id: number
  date: string
  title: string
  description: string
  image: string
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: "12 August 2023",
    title: "The First Meeting",
    description:
      "Di hari itu kita pertama kali bertemu. Waktu itu belum tahu kalau pertemuan sederhana ini bakal jadi awal dari banyak cerita.",
    image: "/timeline/memory-01.webp",
  },

  {
    id: 2,
    date: "27 September 2023",
    title: "Getting Closer",
    description:
      "Entah sejak kapan, ngobrol sama kamu mulai terasa berbeda. Dari yang awalnya biasa saja, perlahan jadi sesuatu yang selalu ditunggu.",
    image: "/timeline/memory-01.webp",
  },

  {
    id: 3,
    date: "14 October 2023",
    title: "Our First Call",
    description:
      "Niatnya cuma telepon sebentar. Tapi ternyata lima menit berubah menjadi percakapan yang jauh lebih lama.",
    image: "/timeline/memory-01.webp",
  },

  {
    id: 4,
    date: "03 November 2023",
    title: "Late to School",
    description:
      "Salah satu momen paling random yang pernah kita lewati. Kita memang telat, tapi setidaknya telatnya bareng.",
    image: "/timeline/memory-01.webp",
  },

  {
    id: 5,
    date: "20 November 2023",
    title: "Our First Photo",
    description:
      "Sebuah foto sederhana. Tapi ternyata menjadi salah satu halaman kecil yang masih ingin aku simpan sampai sekarang.",
    image: "/timeline/memory-01.webp",
  },

  {
    id: 6,
    date: "15 December 2023",
    title: "The Beginning of Us",
    description:
      "Dan akhirnya, cerita kita benar-benar dimulai.",
    image: "/timeline/memory-01.webp",
  },
]