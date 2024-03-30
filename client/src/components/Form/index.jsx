import React, {useEffect, useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifySuccess = () => toast.success('Berhasil menambahkan data!', { autoClose: 5000 });

function Form({table, set, mode, sid, data}) {
    const [userId, setuserId] = useState('');
    const [long, setlong] = useState('');
    const [lat, setlat] = useState('');
    const [type, settype] = useState('');
    const [lokasi, setlokasi] = useState('');
    const [loaduser, setloaduser] = useState(true);
    const [user, setUser] = useState([]);
    const [uid, setUid] = useState(0);
    const [render, setrender] = useState(0.0)

    // notifySuccess();
    // const [email, setemail] = useState('');
    // const [name, setname] = useState('');
    // const [dateOfBirth, setdateOfBirth] = useState('');
    // const [gender, setgender] = useState('');
    // const [address, setaddress] = useState('');

    const getUser = async () => {
      setloaduser(true)
      try {
        const response = await fetch('http://localhost:3300/v1/user');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setUser(jsonData.data);

        setloaduser(false)
      } catch (error) {
        console.log(error);
        setloaduser(true)
      }
    }

    useEffect(() => {
      getUser();
    }, [render])

    useEffect(() => {
      const useredit = () => {
        let userid = data[sid].userId;
        user.forEach((e, i) => {
          if(e._id == userid){
            setUid(i)
          }
        })
      }
      useredit();
    }, [user])

    useEffect(() => {
      return () => {
        setlong(data[sid].longitude);
        setlat(data[sid].latitude);
        settype(data[sid].type);
        setlokasi(data[sid].lokasi)
      }
    }, [data])
    

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

    const updateSensor = async (uid) => {
      const editid = String(data[sid]._id);
        const formData = {
            userId: uid,
            longitude:long,
            latitude:lat,
            type: type,
            lokasi: lokasi
        }
        try {
            const response = await fetch(`http://localhost:3300/v1/sensor/${editid}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
              });

            if (!response.ok) {
              throw new Error('Failed to edit data');
            }
            
            console.log('Edited post:', formData);
            notifySuccess();
            setrender(Date.now() * Math.random());
            table(prev => !prev)

            return response
          } catch (error) {
            console.log(error);
          }
    }

    const postSensor = async (uid) => {
        const postdata = {
            userId: uid,
            longitude:long,
            latitude:lat,
            type: type,
            lokasi: lokasi
        }
        
        try {
            const response = await fetch('http://localhost:3300/v1/sensor/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(postdata)
            });
      
            if (!response.ok) {
              throw new Error('Failed to create post');
            }
      
            console.log('New post:', postdata);
            notifySuccess();
            setrender(Date.now() * Math.random());
            table(prev => !prev)
            return response
          } catch (error) {
            console.error('Error:', error.message);
            return error;
          }
    }

    const post = async () => {
      if(mode == "add"){
        const res = await postSensor(user[uid]._id);
        return console.log(res);
      } else {
        const res = await updateSensor(user[uid]._id);
        return console.log(res);
      }
    }


    const formUser = () => {
      return (
        <>
        <div className='flex my-10 justify-between'>
        <p className='mr-2'>User Name</p>
        <select onChange={(e) => setUid(e.target.value)}>
          {
            (loaduser)? <p>Loading</p> :
            user.map((e, i) => <option value={i}>{e.name}</option> )
          }
        </select>
      </div>
          {
            (loaduser)? <p>Loading</p> :
            <>
              <div className='flex my-10 justify-between'>
                <p className='mr-2'>email</p>
                <input type='text' disabled={true} value={user[uid].email} />
              </div>
              <div className='flex my-10 justify-between'>
                <p className='mr-2'>gender</p>
                <input type='text' disabled={true} value={user[uid].gender} />
              </div>
            </>
          }
      </>
      )
    }
    
    const formUserEdit = () => {

      return (
        <>
        <div className='flex my-10 justify-between'>
        <p className='mr-2'>User Name</p>
        <select onChange={(e) => setUid(e.target.value)}>
          {
            (loaduser)? <p>Loading</p> :
            user.map((e, i) => {
              if(i == uid){
                return <option value={i} selected>{e.name}</option> 
              } else {
                return <option value={i}>{e.name}</option> 
              }
            })
          }
        </select>
      </div>
          {
            (loaduser)? <p>Loading</p> :
            <>
              <div className='flex my-10 justify-between'>
                <p className='mr-2'>email</p>
                <input type='text' disabled={true} value={user[uid].email} />
              </div>
              <div className='flex my-10 justify-between'>
                <p className='mr-2'>gender</p>
                <input type='text' disabled={true} value={user[uid].gender} />
              </div>
            </>
          }
      </>
      )
    }

  return (
    <div className='min-w-[100vw] min-h-[100vh] w-full h-full bg-black/50 absolute top-0 left-0 '>
        <ToastContainer 
        position='top-left'
        />
    <div className='form'>
        <div className='flex my-10 justify-center'>
            <p>{
            (mode === "add")?
            "Tambah Perangkat Baru":
            "Ubah Perangkat"
            }</p>
        </div>
        {
          (mode === "add") ? formUser() : formUserEdit()
        }
        <div className='flex my-10 justify-between'>
            <p className='mr-2'>Longitude</p>
            {
              (mode === "add")?
              <input type='text' onChange={(e) => setlong(e.target.value)} placeholder='longitude'/> :
              <input type='text' onChange={(e) => setlong(e.target.value)} defaultValue={data[sid].longitude}/>
            }
        </div>
        <div className='flex my-10 justify-between'>
            <p className='mr-2'>Latitude</p>
            {
              (mode === "add")?
            <input type='text' onChange={(e) => setlat(e.target.value)} placeholder='latitude'/> :
            <input type='text' onChange={(e) => setlat(e.target.value)} defaultValue={data[sid].latitude}/>
          }
        </div>
        <div className='flex my-10 justify-between'>
            <p className='mr-2'>Tipe</p>
            {
              (mode === "add")?
            <input type='text' onChange={(e) => settype(e.target.value)} placeholder='FireX 120'/> :
            <input type='text' onChange={(e) => settype(e.target.value)} defaultValue={data[sid].type}/>
          }
        </div>        <div className='flex my-10 justify-between'>
            <p className='mr-2'>Lokasi Pemasangan</p>
            {
              (mode === "add")?
            <input type='text' onChange={(e) => setlokasi(e.target.value)} placeholder=''/> :
            <input type='text' onChange={(e) => setlokasi(e.target.value)} defaultValue={data[sid].lokasi}/>
          }
        </div>
        <div className='flex my-10 justify-center'>
            <button 
            className='p-4 bg-blue-300 text-white' 
            onClick={() => post()}>
              {
                (mode === "add")? 
                "Daftarkan Perangkat" : "Update Perangkat"
              }
            </button>
            <button 
            className='p-4 bg-primary text-white ml-4' 
            onClick={() => set(prev => !prev)}>
                Batalkan
            </button>
        </div>
    </div>
    </div>
  )
}

export default Form