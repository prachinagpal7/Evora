import React from 'react'
import {PricingTable} from '@clerk/clerk-react'

const Plan = () => {
  return (
    <section id='plans' className='bg-zinc-950 px-4 sm:px-20 xl:px-32 py-14'>
      <h2 className='text-2xl font-semibold tracking-tight text-zinc-100'>Plans</h2>
      <p className='mt-1 max-w-lg text-zinc-400 text-sm'>Start free. Upgrade when you need more.</p>

      <div className='mt-6 max-w-2xl'>
        <PricingTable collapseFeatures />
      </div>
    </section>
  )
}

export default Plan

