import React, { useState, useEffect } from 'react'
import {dummyPublishedCreationData} from '../assets/assets'
import {useNavigate} from 'react-router-dom';
import {useUser} from '@clerk/clerk-react'

const Community = () => {
    const [creations, setCreations] = useState([]);
    const navigate = useNavigate();
    const {user} = useUser();

    const fetchCreations = async () => {
        setCreations(dummyPublishedCreationData);
    }

    useEffect( () => {
        fetchCreations();
    }, [])

  return (
    <section id='community' className='bg-zinc-950 px-4 sm:px-20 xl:px-32 py-14'>
        <div className='flex items-end justify-between gap-6'>
            <div>
                <h2 className='text-2xl font-semibold tracking-tight text-zinc-100'>Published by users</h2>
                <p className='mt-1 max-w-lg text-zinc-400 text-sm'>Images people chose to share with the community.</p>
            </div>
            <button
                className='shrink-0 text-sm font-medium text-zinc-300 hover:text-white underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-300 transition-colors'
                onClick={() => user && navigate("/ai/community")}
            >
                View all
            </button>
        </div>

        <div className='mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
            {creations.map((item) => (
                <img key={item.id} src={item.content} alt="User creation" className='w-full aspect-[4/3] object-cover rounded-md border border-zinc-800' />
            ))}
        </div>
    </section>
  )
}

export default Community
