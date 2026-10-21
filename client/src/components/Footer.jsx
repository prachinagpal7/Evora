import React from 'react'
import logo_name from '../assets/logo_name.png';

const Footer = () => {
  return (
    <footer className='bg-zinc-950 px-4 sm:px-20 xl:px-32 pb-0 pt-6'>
      <div className='flex flex-col sm:flex-row items-center justify-end gap-4 text-sm text-zinc-500 '>
        {/* <img src={logo_name} alt="Evora" className='h-7 w-auto' /> */}
        <p>© {new Date().getFullYear()} Evora. Built by Prachi.</p>
      </div>
    </footer>
  )
}

export default Footer