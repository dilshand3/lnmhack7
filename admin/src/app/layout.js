import "./globals.css";

export const metadata = {
  title: "Admin",
  description: "Only for virtualCare verified Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}