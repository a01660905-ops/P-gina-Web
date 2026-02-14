import './globals.css';

export const metadata = {
  title: 'San Valentín 💘',
  description: 'Una página cute de San Valentín'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
