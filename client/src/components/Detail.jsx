import React, { useEffect, useState } from 'react'
import Card from './Card'
import MapData from './MapData'

function Detail({emergency, emergencies}) {
    const [user, setUser] = useState({            
    "_id": "65e17fe98d9277a9a4e02fa8",
    "email": "bayuu@email.com",
    "password": "egr",
    "name": "bayu",
    "dateOfBirth": "21-03-2003",
    "gender": "male",
    "address": "Samarinda, jl my yamin"});
    const [sensor, setSensor] = useState(undefined);
    const [loading, setLoading] = useState(true);

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
  return (
    <>
    {
        (loading)? <h1>Loading</h1>:
        <aside className='detail'>
            <div className='detail-info'>
        
            <Card>
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
            </Card>
            <Card>
                <div>
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
        
            <MapData
            key={emergency._id}
            latitude={emergency.latitude}
            longitude={emergency.longitude}
            emergencies={emergencies}
            />
        </aside>
    }
    </>

  )
}

export default Detail