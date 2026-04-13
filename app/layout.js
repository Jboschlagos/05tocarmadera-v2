import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Tocar Madera | Artesanos de Chile",
  description:
    "Conectamos con las historias detrás de los talleres de madera chilenos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
