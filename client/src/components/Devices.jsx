import React, {useState, useEffect} from 'react'
import Form from './Form';

function Devices() {
    const [load, setload] = useState(true);
    const [sensor, setSensor] = useState(undefined);

    const [userID, setuserID] = useState(undefined);
    const [lon, setlon] = useState(undefined);
    const [lat, setlat] = useState(undefined);
    
    useEffect(() => {
        const fetchSensor = async () => {
            setload(true)
            try {
              const response = await fetch('http://localhost:3300/v1/sensor');
              if (!response.ok) {
                throw new Error('Failed to fetch data');
              }
              const jsonData = await response.json();
              setSensor(jsonData.data);
  
              setload(false)
            } catch (error) {
              console.log(error);
              setload(true)
            }
        }

        fetchSensor();
    }, [])


    const [form, setform] = useState(false)
    const addDevice = () => {
        setform(!form)
    }

    const deletedata = async (id) => {
        try {
            const response = await fetch(`http://localhost:3300/v1/sensor/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
              throw new Error('Failed to delete data');
            }
            const filteredData = sensor.filter(item => item._id !== id);
            setSensor([...filteredData])
          } catch (error) {
            console.log(error);
          }
    }

    const editdata = async (id) => {
        const formData = {
            tes
        }
        try {
            const response = await fetch(`http://localhost:3300/v1/sensor/${id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
              });

            if (!response.ok) {
              throw new Error('Failed to edit data');
            }
            
          } catch (error) {
            console.log(error);
          }
    }

  return (

    <div>
        <button className='p-4 bg-primary text-white mb-[-2rem] mt-4' onClick={() => addDevice()}>Daftarkan Perangkat</button>
        {
            (load)? <h1>load</h1>:
            <table >
            <thead>
                <tr>
                    <th>#</th>
                    <th>userId</th>
                    <th>longitude</th>
                    <th>latitude</th>
                    <th>lokasi instalasi</th>
                    <th></th>
                </tr>
            </thead>
        {
            sensor.map((e, i) => {
                return(
                    <tbody key={i}>
                        <tr>
                            <td>{i}</td>
                            <td>{String(e.userId)}</td>
                            <td>{e.longitude}</td>
                            <td>{e.latitude}</td>
                            <td>{e.lokasi}</td>
                            <td><button onClick={() => deletedata(e._id)} className='px-4 py-1 bg-red-500 text-white'>Hapus</button></td>
                            {/* <td><button onClick={() => editdata(e._id)} className='px-4 py-1 bg-blue-500 text-white'>Edit</button></td> */}
                        </tr>
                    </tbody>
                )
            })
        }
        </table>
        }
        {
            (form)?
            <Form set={setform}/>:<></>
        }
    </div>
  )
}

export default Devices