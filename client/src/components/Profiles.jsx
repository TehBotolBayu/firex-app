import React, { useEffect, useState } from 'react'
import {user} from '../constant'
// import.meta.env.TES

function Profiles({id}) {
  const [userData, setuserData] = useState();
  const [loading, setload] = useState(false)
  useEffect(() => {
    const user = async () => {
      setload(false)
      const result = await fetch(`http://localhost:3300/v1/user/${id}`)
      if (!result.ok) {
        throw new Error('Failed to get data');
      }
      const resdata = await result.json();
      console.log(resdata);
      setuserData(resdata)
      setload(true)
    };

    user();
  }, [])
  // console.log()
  return (

    <div className='bg-white p-10 w-[500px] mr-10'>
    {
      (!loading) ? <h1>Loading</h1>:
      <>
      <h1 className='font-bold text-xl'>Profile</h1>
      <div className='flex my-10 justify-between'>
        <h1>Name</h1>
        <input value={userData.data[0].name} className='shadow-xl border'/>
      </div>
      <div className='flex my-10 justify-between'>
        <h1>Email</h1>
        <input value={userData.data[0].email} className='shadow-xl border'/>
        </div>
      {/* <div className='flex my-10 justify-between'>
      
        <h1>Passworrd</h1>
        <input value={userData.data.password} className='shadow-xl border'/>
        </div> */}
      <div className='flex my-10 justify-between' >
        <h1>Gender</h1>
        <input value={userData.data[0].gender} className='shadow-xl border'/>
      </div>
      <div className='flex my-10 justify-between' >
        <h1>Date of Birth</h1>
        <input value={userData.data[0].dateOfBirth} className='shadow-xl border'/>
      </div>
      <div className='flex my-10 justify-between' >
        <h1>Address</h1>
        <input value={userData.data[0].address} className='shadow-xl border'/>
      </div>
      </>
    }
    </div>
  )
}

export default Profiles