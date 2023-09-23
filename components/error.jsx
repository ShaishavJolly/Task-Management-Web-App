import Link from 'next/link'
import React from 'react'

const error = ({message,route}) => {
  return (
<div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
    <div className=" bg-white p-8 text-center">
    <h1 className="mb-4 text-4xl font-bold">Server Error!</h1>
    <p className="text-gray-600">Oops! {message}</p>
    <button onClick={()=>window.location.reload()} className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">Try again</button>
  </div>
</div>
  )
}

export default error