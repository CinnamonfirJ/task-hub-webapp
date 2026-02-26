export default function BeforeAfterComparison() {
  return (
    <div className='max-w-[1000px] mx-auto px-4 relative flex flex-col md:flex-row items-stretch gap-6 md:gap-0'>
      {/* Before Section */}
      <div className='flex-1 bg-[#F5F5F5] rounded-[24px] p-8 md:p-10 relative z-0'>
        <div className='mb-6'>
          <span className='bg-[#E5E7EB] text-[#6B7280] text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-wider uppercase'>
            BEFORE
          </span>
        </div>
        <div className='space-y-4'>
          {[
            "Jumping between apps to find the right service is exhausting.",
            "Hidden fees and middlemen inflate costs unfairly.",
            "No way to verify who you're hiring or their track record.",
            "Waiting days for quotes when you need help now.",
          ].map((item, idx) => (
            <div key={idx} className='flex items-start gap-3'>
              <div className='w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5'>
                <div className='w-2.5 h-0.5 bg-[#6B7280] rounded-full' />
              </div>
              <span className='text-[#6B7280] text-[14px] font-normal leading-relaxed'>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Central Arrow Button - Desktop */}
      <div className='hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#7C3AED] rounded-full items-center justify-center shadow-lg'>
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M5 12H19M19 12L12 5M19 12L12 19'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>

      {/* Mobile Arrow */}
      <div className='md:hidden flex justify-center -my-3 relative z-10'>
        <div className='w-12 h-12 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-lg rotate-90'>
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M5 12H19M19 12L12 5M19 12L12 19'
              stroke='white'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
      </div>

      {/* After Section */}
      <div className='flex-1 bg-[#7C3AED] rounded-[24px] p-8 md:p-10 text-white relative z-0'>
        <div className='mb-6'>
          <span className='bg-white/10 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-wider uppercase border border-white/20'>
            AFTER
          </span>
        </div>
        <div className='space-y-4'>
          {[
            "One unified platform for all services",
            "Transparent, fair pricing",
            "Verified profiles with real reviews",
            "Instant bids from local taskers",
          ].map((item, idx) => (
            <div key={idx} className='flex items-start gap-3'>
              <div className='w-5 h-5 rounded-full bg-[#A78BFA] flex items-center justify-center shrink-0 mt-0.5'>
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 12 12'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M10 3L4.5 8.5L2 6'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <span className='text-white text-[14px] font-normal leading-relaxed'>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
