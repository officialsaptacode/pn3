import {
  Bricolage_Grotesque,
  Manrope,
  Marcellus,
  Nunito,
  Plus_Jakarta_Sans,
  Quicksand,
  Raleway,
} from "next/font/google";

export const nunito = Nunito({
  preload: true,
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const bricolage = Bricolage_Grotesque({
  preload: true,
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const marcellus = Marcellus({
  preload: true,
  display: "swap",
  subsets: ["latin"],
  weight: ["400"],
});

export const plusJakarta = Plus_Jakarta_Sans({
  preload: true,
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const raleway = Raleway({
  preload: true,
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const manrope = Manrope({
  preload: true,
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});
