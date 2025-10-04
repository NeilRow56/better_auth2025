import Header from '@/components/shared/header'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center p-6 md:p-10'>
      <Header />
      <div className='mt-12 w-full max-w-xs md:max-w-lg'>{children}</div>
    </div>
  )
}
