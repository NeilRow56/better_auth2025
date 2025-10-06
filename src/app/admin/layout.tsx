import Header from '@/components/shared/header'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='container mx-auto mt-16 flex w-full px-4'>
      <Header />

      {children}
    </div>
  )
}
