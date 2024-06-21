"use client"
import { Button } from '@/components/ui/button'
import { SignOutButton, UserButton, useUser } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Header() {
  const path = usePathname();
  const { user, isSignedIn } = useUser();
  useEffect(() => {
    console.log(path)
  }, [])
  return (
    <div className='p-6 px-10 flex justify-between shadow-sm fixed top-0 w-full z-10 bg-white'>
      <div className='flex gap-12 items-center'>
        <Link href={'/'}>
        <Image src={'/logo.svg'} width={150}
          height={150} alt='logo' />
          </Link>
        <ul className='hidden md:flex gap-10'>
          <Link href={'/'} >
            <li className={`'hover:text-primary 
                 font-medium text-sm cursor-pointer'
                 ${path == '/' && 'text-primary'}`}>A vendre</li>
          </Link>
          <Link href={'/rent'} >
            <li className={`'hover:text-primary 
                 font-medium text-sm cursor-pointer'
                 ${path == '/rent' && 'text-primary'}`}>A louer</li>
          </Link>
          <li className='hover:text-primary font-medium text-sm cursor-pointer'>Chercher agent</li>
        </ul>
      </div>
      <div className='flex gap-2 items-center'>
      <Link href={'/add-new-listing'}>
        <Button className="flex gap-2"><Plus className='h-5 w-5' /> Poster votre annonce</Button>
        </Link>
        {isSignedIn ?
        
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image src={user?.imageUrl} 
            width={35} height={35} alt='user profile'
            className='rounded-full'
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
             <Link href={'/user'}>Profile</Link> 
              </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={'/user#/my-listing'}>
              Ma liste
              </Link></DropdownMenuItem>
             
            <DropdownMenuItem> <SignOutButton>Deconnexion</SignOutButton> </DropdownMenuItem>
           
          </DropdownMenuContent>
        </DropdownMenu>

          : 
          <Link href={'/sign-in'}>
          <Button variant="outline">Connexion</Button>
          </Link>
        }

      </div>
    </div>
  )
}

export default Header