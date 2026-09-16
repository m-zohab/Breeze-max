import './globals.css';

export const metadata = {
  title: 'Breeze Max | HVAC Services in Dallas–Fort Worth',
  description:
    'Precision comfort, engineered for Texas heat. 24/7 HVAC repair, maintenance, and installation across the Dallas–Fort Worth metro.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
