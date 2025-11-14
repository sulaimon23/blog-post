const PageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-full max-w-[880px] mx-auto px-4 md:px-0 py-10'>
            {children}
        </div>
    )
}

export default PageLayout