import './globals.css';

export const metadata = {
  title: 'Controle de Gastos',
  description: 'Sistema de controle de despesas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
