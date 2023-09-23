import React from 'react'
import { MdDelete } from 'react-icons/md';
import Link from 'next/link';

const TaskCard = ({id,name,progress,description, onDelete,tags}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-gray-500 text-sm">{progress}</p>
      <p className="mt-2">{description}</p>
      <div className='mt-2 flex space-x-2'>
      {
        tags.map((tag,index)=>{
          return <p key={index} className="px-2 py-1 text-sm rounded-md bg-blue-300">{tag}</p>
        })
      }
      </div>
      <Link href={`/task/${id}`}><button className='text-sm absolute bottom-3 right-10 rounded-md py-1 px-2 bg-indigo-800 hover:bg-indigo-950 text-white'>View Details</button></Link>
      <button onClick={onDelete} className="text-red-500 hover:text-red-700 text-3xl absolute bottom-3 right-2">
      <MdDelete />
      </button>
    </div>
  )
}

export default TaskCard