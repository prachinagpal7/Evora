import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import { ArrowRight } from 'lucide-react'
import { AiToolsData } from '../assets/assets'

const AiTools = () => {
    const navigate = useNavigate()
    const {user} = useUser()
    const { openSignIn } = useClerk()
  return (
    <section id='tools' className='bg-zinc-950 px-4 sm:px-20 xl:px-32 py-14'>
      <h2 className='text-2xl font-semibold tracking-tight text-zinc-100'>What you can make</h2>
      <p className='mt-1 max-w-lg text-zinc-400 text-sm'>Sign in, pick a tool and generate.</p>

      <ul className='mt-6 divide-y divide-zinc-800 border-y border-zinc-800'>
        {AiToolsData.map((tool, index) => (
          <li key={index}>
            <button
              onClick={() => user ? navigate(tool.path) : openSignIn()}
              className='group w-full flex items-center gap-5 py-3 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400'
            >
              <tool.Icon className='w-3 h-3 shrink-0 text-zinc-500 group-hover:text-cyan-400 transition-colors' />
              <span className='w-48 shrink-0 font-medium text-zinc-100'>{tool.title}</span>
              <span className='hidden sm:block flex-1 text-sm text-zinc-400'>{tool.description}</span>
              <ArrowRight className='ml-auto w-4 h-4 text-zinc-600 group-hover:text-zinc-100 transition-colors' />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AiTools
