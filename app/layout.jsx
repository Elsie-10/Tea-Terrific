import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Tea-Terrific Bakery",
  description: "Order fresh artisan baked goods online — delivered to your door.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <SessionWrapper>
          <CartProvider>{children}</CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
