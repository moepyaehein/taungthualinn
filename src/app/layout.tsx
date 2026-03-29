import "./globals.css";

export const metadata = {
  title: "တောင်သူအလင်း — AI စိုက်ပျိုးရေး စျေးကွက် ပလက်ဖောင်း",
  description: "တောင်သူအလင်း — မြန်မာ့စိုက်ပျိုးရေးအတွက် AI စျေးကွက်ပလက်ဖောင်း",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
