export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold">Dashboard CodePadawan</h1>
      </nav>
      <main className="container mx-auto p-8">
        {children}
      </main>
    </div>
  )
}