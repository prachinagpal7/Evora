const Testimonial = () => {
    const dummyTestimonialData = [
        {
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
            name: 'John Doe',
            title: 'Marketing Director, TechCorp',
            content: 'ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.',
            rating: 4,
        },
        {
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
            name: 'Jane Smith',
            title: 'Content Creator, TechCorp',
            content: 'ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
            name: 'David Lee',
            title: 'Content Writer, TechCorp',
            content: 'ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.',
            rating: 4,
        },
    ]

    return (
        <div className='px-4 sm:px-20 xl:px-32 py-32 relative bg-gradient-to-b from-black via-slate-900 to-black overflow-hidden'>
            {/* Gradient orbs */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/15 to-cyan-500/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-pink-500/10 rounded-full blur-3xl" />

            <div className='text-center relative z-10 mb-16'>
                <h2 className='text-5xl sm:text-5.5xl font-black text-white mb-6'>Loved by Creators</h2>
                <p className='text-gray-300 max-w-3xl mx-auto text-xl'>Hear from the innovators transforming their creative workflows with our AI-powered platform.</p>
            </div>
            <div className='flex flex-wrap mt-16 justify-center gap-8'>
                {dummyTestimonialData.map((testimonial, index) => (
                    <div key={index} className='p-4 max-w-sm rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 hover:border-cyan-500/40 hover:from-white/10 hover:to-white/8 hover:-translate-y-4 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 cursor-pointer group overflow-hidden relative'>
                        {/* Gradient glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-purple-500/0 group-hover:from-cyan-500/15 group-hover:via-blue-500/10 group-hover:to-purple-500/15 transition-all duration-500" />

                        <div className="flex items-center gap-1 relative z-10 mb-4 group-hover:gap-2 transition-all">
                            {Array(5).fill(0).map((_, idx) => (
                                <svg key={idx} className={`w-5 h-5 transition-all duration-300 ${idx < testimonial.rating ? 'text-yellow-400 group-hover:scale-110' : 'text-gray-600 group-hover:text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                        </div>
                        <p className='text-gray-300 text-base my-6 leading-relaxed relative z-10 font-medium group-hover:text-white group-hover:text-lg transition-all duration-300'>"{testimonial.content}"</p>
                        <div className='h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6 group-hover:via-cyan-500/40 transition-all duration-500' />
                        <div className='flex items-center gap-4 relative z-10'>
                            <img src={testimonial.image} className='w-12 h-12 object-cover rounded-full ring-2 ring-cyan-500/30 group-hover:ring-cyan-400/60 group-hover:scale-110 transition-all duration-300' alt='' />
                            <div className='text-sm'>
                                <h3 className='font-bold text-white group-hover:text-cyan-300 transition-colors duration-300'>{testimonial.name}</h3>
                                <p className='text-gray-500 text-xs group-hover:text-gray-400 transition-colors duration-300'>{testimonial.title}</p>
                            </div>
                        </div>

                        {/* Bottom accent bar */}
                        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial;
