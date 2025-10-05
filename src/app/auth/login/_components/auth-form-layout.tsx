'use client'

import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SignUpForm from './sign-up-form'
import SignInForm from './sign-in-form'

function AuthFormLayout() {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <div className='mt-48 flex'>
      <div className='bg-card w-full max-w-md rounded-lg border p-5 shadow-sm'>
        {/* <h1 className="text-2xl font-bold text-center mb-6">Welcome!</h1> */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='mb-4 grid w-full grid-cols-2'>
            <TabsTrigger value='login'>Login</TabsTrigger>
            <TabsTrigger value='register'>Register</TabsTrigger>
          </TabsList>
          <TabsContent value='login'>
            <SignInForm />
          </TabsContent>
          <TabsContent value='register'>
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AuthFormLayout
