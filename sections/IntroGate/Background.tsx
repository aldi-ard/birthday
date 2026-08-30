import React from "react"

interface BackgroundProps {
    children : React.ReactNode
}
function Background({children}: BackgroundProps) {
  return (
    <div className="h-screen w-screen bg-black flex justify-center relative items-center ">
        <div className="w-70 h-50 bg-pink-800 blur-3xl absolute rounded-full">
        </div>
        <div className="relative z-10">
            {children}
        </div>
    </div>
  )
}

export default Background