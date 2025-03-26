import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='w-full h-screen flex items-center justify-center'>
      <Sidebar />
      {children}
    </main>
  );
}
