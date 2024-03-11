import React, {useState, useEffect} from 'react'
import Form from './Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifyDelete = () => toast.success('Berhasil menghapus data!', { autoClose: 5000 });

function Devices() {
    const [load, setload] = useState(true);
    const [sensor, setSensor] = useState(undefined);

    const [userID, setuserID] = useState(undefined);
    const [lon, setlon] = useState(undefined);
    const [lat, setlat] = useState(undefined);
    const [table, setTable] = useState(false)
    
    useEffect(() => {
        const fetchSensor = async () => {
            setload(true)
            try {
              const response = await fetch('http://localhost:3300/v1/sensor/withuser');
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
    }, [table])


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
            notifyDelete();
          } catch (error) {
            console.log(error);
          }
    }

    const [sid, setsid] = useState(0)
    const [editForm, setEditForm] = useState(false);
    const editdata = async (id) => {
      setsid(id);
      setEditForm(true)
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
                    <th>Nama Pemilik</th>
                    <th>Email Pemilik</th>
                    <th>longitude</th>
                    <th>latitude</th>
                    <th>tipe</th>
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
                            <td>{e.sensor_user[0].name}</td>
                            <td>{e.sensor_user[0].email}</td>
                            <td>{e.longitude}</td>
                            <td>{e.latitude}</td>
                            <td>{e.type}</td>
                            <td>{e.lokasi}</td>
                            <td className='flex justify-evenly h-full items-center'>
                              <button onClick={() => deletedata(e._id)} className='mx-1 px-4 py-1 bg-red-500 text-white'>Hapus</button>
                              <button onClick={() => editdata(i)} className='mx-1 px-4 py-1 bg-blue-500 text-white'>Edit</button>
                            </td>
                        </tr>
                    </tbody>
                )
            })
        }
        </table>
        }
        {
            (form)?
            <Form set={setform} table={setTable} mode="add" sid={sid} data={sensor}/>:<></>
        }
        {
            (editForm)?
            <Form set={setEditForm} table={setTable} mode="edit" sid={sid} data={sensor}/>:<></>
        }
    </div>
  )
}

export default Devices