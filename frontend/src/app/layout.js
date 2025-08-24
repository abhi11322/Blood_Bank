import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <meta name="viewport" content="width=device-width, initial-scale=1" />

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="site-wrapper">
        {children}
        <footer className="footer">
          <p>© 2025 Blood Donor System. All rights reserved.</p>
        </footer>
        </div>
      </body>
    </html>
  );
}
