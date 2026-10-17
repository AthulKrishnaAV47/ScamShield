import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

// Atkinson Hyperlegible was designed by the Braille Institute for low-vision readers.
const body = Atkinson_Hyperlegible({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-body" });

export const metadata = { title: "ScamShield Voice", description: "Scam protection for phone banking" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={body.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
