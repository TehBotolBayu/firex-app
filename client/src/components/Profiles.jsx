import React from 'react'
import {user} from '../constant'
// import.meta.env.TES

function Profiles() {
  // console.log()
  return (
    <div className='bg-white p-10 w-[500px] mr-10'>
      <h1 className='font-bold text-xl'>Profile</h1>
      <div className='flex my-10 justify-between'>
        <h1>Name</h1>
        <input value={user[0].name} className='shadow-xl border'/>
      </div>
      <div className='flex my-10 justify-between'>
        <h1>Email</h1>
        <input value={user[0].email} className='shadow-xl border'/>
        </div>
      <div className='flex my-10 justify-between'>
      
        <h1>Passworrd</h1>
        <input value={user[0].password} className='shadow-xl border'/>
        </div>
      <div className='flex my-10 justify-between' >
        <h1>Gender</h1>
        <input value={user[0].gender} className='shadow-xl border'/>
      </div>
    </div>

  )
}

export default Profiles