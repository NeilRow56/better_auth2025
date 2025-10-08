import PublicHeader from './_components/public-header'

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='container mx-auto mt-16 flex w-full px-4'>
      <PublicHeader />

      <main className='py-4'>{children}</main>
    </div>
  )
}
