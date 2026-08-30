import { Playfair_Display, Inter, Yellowtail , Tangerine} from "next/font/google";

export const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair-display",
    display: "swap",
    weight: ["400", "500", "600", "700", "800", "900"]
})

export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap"
}) 

export const yellowtail = Yellowtail({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-yellowtail",
    display: "swap"
})  

export const tangerine = Tangerine({
    weight : '400'
})