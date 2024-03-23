import React, { useEffect, useState } from 'react'
import Card from './Card'
import MapData from './MapData'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifySuccess = (msg) => toast.success(msg, { autoClose: 5000 });

const notifyError = (message) => {
  toast.error(message, { autoClose: 5000 });
}


function Detail({emergency, emergencies, reRender}) {
    const [user, setUser] = useState({});
    const [sensor, setSensor] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [firestat, setfirestat] = useState('')

    const handleLevel = (temp, smoke)  =>  {
        const res = temp * smoke * 10;
        if (res < 800) {
            return "Padam"
        }
        else if (res < 5000) {
            return "Beresiko"
        }
        return "Berbahaya"
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const sid = await emergency.sensorId;
                const sensor = await fetch(`http://localhost:3300/v1/sensor/${sid}`);
                if (!sensor.ok) {
                throw new Error('Failed to fetch data');
                }
                const jsonsensor = await sensor.json();
                setSensor(jsonsensor.data[0]);
        
                const uid = jsonsensor.data[0].userId;
                const user = await fetch(`http://localhost:3300/v1/user/${uid}`);
                if (!user.ok) {
                throw new Error('Failed to fetch data');
                }
                const jsonuser = await user.json();
                setUser(jsonuser.data[0]);  
                setLoading(false)
            } catch (error) {
            console.log(error);
            setLoading(true)
            }
        };
        fetchData();
    }, [emergency]);


    const updateStat = async () => {
        const updata= {
                sensorId:emergency.sensorId,
                timestamp:emergency.timestamp,
                temp:emergency.temp,
                smoke:emergency.smoke,
                latitude:emergency.latitude,
                longitude:emergency.longitude,
                status:firestat
              }
        try {
            const result = await fetch(`http://localhost:3300/v1/emergency/${emergency._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updata)
            })
            const resdata = await result.json();
            if(!result.ok){
              throw new Error(resdata.message);
            }
            notifySuccess(resdata.message)
            reRender(p=>!p);
            
            return;
        } catch (error) {
            console.error('Error:', error.message);
            notifyError(error.message)
            return error;
        }
    }

  return (
    <>
    {
        (loading)? <h1>Loading</h1>:
        <aside className='detail'>
            <div className='px-4'>
            <Card>
                <div className='relative h-[30vh] w-full'>
                    <MapData
                    key={emergency._id}
                    latitude={emergency.latitude}
                    longitude={emergency.longitude}
                    emergencies={emergencies}
                    />
                </div>
            </Card>
            </div>
            <div className='detail-info px-4'>
        
            <Card>
                <div className='mx-4'>

                <h1>Identitas Pemilik Rumah</h1>
                <div className='flex justify-between'>

                <div>
                    <p className='font-bold'>Nama</p>
                    <p className='font-bold'>Tanggal Lahir</p>
                    <p className='font-bold'>Jenis Kelamin</p>
                    <p className='font-bold'>Alamat Rumah</p>
                </div>
                <div>
                    <p>{user.name}</p>
                    <p>{user.dateOfBirth}</p>
                    <p>{user.gender}</p>
                    <p>{user.address}</p>
                </div>
                </div>
                </div>
            </Card>
            <Card>
                <div className='mx-4'>
                    <div className='flex justify-between'>
                        <h3>Temperatur</h3>
                        <p>{emergency.temp}</p>
                    </div>
                    <div className='flex justify-between'>
                        <h3>Asap</h3>
                        <p>{emergency.smoke}</p>
                    </div>
                    <div className='flex justify-between'>
                        <h3>Lokasi</h3>
                        <p>{sensor.longitude + sensor.latitude}</p>
                    </div>
                    <div className='flex justify-between'>
                        <h3>Level</h3>
                        <p>{handleLevel(emergency.temp, emergency.smoke)}</p>
                    </div>
                </div>
            </Card>
            </div>

            <div className='flex w-full justify-between items-center my-4 px-5'>
            <p>Status Kebakaran</p>
            

            <select className='selection my-0 mr-2' defaultValue={emergency.status} onChange={(e) => setfirestat(e.target.value)}>
                <option value={3}>Darurat Kebakaran</option>
                <option value={2}>Dalam Penanganan</option>
                <option value={1}>Padam</option>
            </select>
            <button className='btn my-0' onClick={updateStat}>Update Status</button>
            </div>
            
        </aside>
    }
    </>
  )
}

export default Detail