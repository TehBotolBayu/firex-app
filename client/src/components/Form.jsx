import React, {useState} from 'react'

function Form({set}) {
    const [userId, setuserId] = useState('');
    const [long, setlong] = useState('');
    const [lat, setlat] = useState('');

    const [email, setemail] = useState('');
    const [name, setname] = useState('');
    const [dateOfBirth, setdateOfBirth] = useState('');
    const [gender, setgender] = useState('');
    const [address, setaddress] = useState('');


    const postUser = async (event) => {
      const data = {
        email,
        password: "1234",
        name,
        dateOfBirth ,
        address
      }
    
    try {
        const response = await fetch('http://localhost:3300/v1/user/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
          throw new Error('Failed to create post');
        }
        console.log('New post:', data);
        const res = await response.json()
        return res;
      } catch (error) {
        console.error('Error:', error.message);
        return error;
      }
    }

    const postSensor = async (uid) => {
        const data = {
            userId: uid,
            longitude:long,
            latitude:lat,
            type: "fire detector 1000"
        }
        
        try {
            const response = await fetch('http://localhost:3300/v1/sensor/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
      
            if (!response.ok) {
              throw new Error('Failed to create post');
            }
      
            console.log('New post:', data);
            return response
          } catch (error) {
            console.error('Error:', error.message);
            return error;
          }
    }

    const post = async () => {
      const {data} = await postUser();
      console.log(data);
      const res = await postSensor(data);
      return console.log(res);
    }

  return (
    <div className='form'>
        <div className='flex my-10 justify-center'>
            <p>Tambah Perangkat Baru</p>
        </div>
        {/* <div className='flex my-10 justify-between'>
            <p>User Id</p>
            <input type='text' onChange={(e) => setuserId(e.target.value)} placeholder='userId'/>
        </div> */}

        <div className='flex my-10 justify-between'>
            <p>email</p>
            <input type='text' onChange={(e) => setemail(e.target.value)} placeholder='email@firex.com'/>
        </div>

        <div className='flex my-10 justify-between'>
            <p>name</p>
            <input type='text' onChange={(e) => setname(e.target.value)} placeholder='nama'/>
        </div>

        <div className='flex my-10 justify-between'>
            <p>date of birth</p>
            <input type='text' onChange={(e) => setdateOfBirth(e.target.value)} placeholder='tanggal lahir'/>
        </div>

        <div className='flex my-10 justify-between'>
            <p>address</p>
            <input type='text' onChange={(e) => setaddress(e.target.value)} placeholder='alamat'/>
        </div>

        <div className='flex my-10 justify-between'>
            <p>Longitude</p>
            <input type='text' onChange={(e) => setlong(e.target.value)} placeholder='longitude'/>
        </div>
        <div className='flex my-10 justify-between'>
            <p>Latitude</p>
            <input type='text' onChange={(e) => setlat(e.target.value)} placeholder='latitude'/>
        </div>
        <div className='flex my-10 justify-center'>
            <button 
            className='p-4 bg-blue-300 text-white' 
            onClick={() => post()}>
                Daftarkan Perangkat
            </button>
            <button 
            className='p-4 bg-primary text-white ml-4' 
            onClick={() => set(prev => !prev)}>
                Batalkan
            </button>
        </div>
    </div>
  )
}

export default Form