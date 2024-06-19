import {
  columnsDataColumns, columnsDataSensorUser, columnsDataUserAdmin
} from "./variables/columnsData";
import ColumnsTable from "./components/ColumnsTable";
import { useEffect, useState } from "react";
import Card from "../../../components/card";
import InputField from "../../../components/fields/InputField";
import MapAnalysis from "../../../components/MapAnalysis"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifySuccess = () => toast.success('Success!', { autoClose: 5000 });
const notifyError = () => toast.error('🔥 Peringatan Kebakaran!', { autoClose: 5000 });
const notifyDelete = () => toast.error('Berhasil Menghapus Data!', { autoClose: 5000 });
const notify = () => toast("Wow so easy!");

const Tables = () => {
  const [load, setload] = useState(true);
  const [load2, setload2] = useState(true);

  const [sensor, setSensor] = useState([]);
  const [sensorUser, setSensorUser] = useState([]);

  const [user, setUser] = useState([]);

  const [userID, setuserID] = useState(undefined);
  const [lon, setlon] = useState(undefined);

  const [lat, setlat] = useState(undefined);
  const [table, setTable] = useState(false);

  const [uid, setUid] = useState(0);

  const [mode, setMode] = useState('add')

  const [sensorPost, setsensorPost] = useState({
    userId:'',
    longitude:'',
    latitude:'',
    type: '',
    lokasi: ''
  })

  const [userPost, setuserPost] = useState({
    email:'',
    password:'',
    name:'',
    dateOfBirth: '',
    gender: '',
    address: '',
    role: '',
    status: '',
  })

  const [emergency, setEmergency] = useState(undefined);
  const [loadmap, setloadmap] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
      setloadmap(true)
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/emergency`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const jsonData = await response.json();
          setEmergency(jsonData.data);
          console.log(jsonData.data[0].latitude);

          setloadmap(false)
        } catch (error) {
          console.log(error);
          setloadmap(true)
        }
      };
      fetchData();
    }, []);

  useEffect(() => {
    const fetchSensor = async () => {
      setload(true)

        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/sensor/withuser`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const jsonData = await response.json();
          // const {sensor_user, ...data} = jsonData;
          // const sensordata = {...data, ...sensor_user[0]};
          setSensor([...jsonData.data]);

        } catch (error) {
          console.log(error);
          setload(true)
        }
    }
    fetchSensor();
  }, [table])

  useEffect(() => {
    const fetchSensor = async () => {
      setload2(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/user`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setUser([...jsonData.data]);
        setload2(false)
      } catch (error) {
        console.log(error);
        setload2(true)
      }
    }
    fetchSensor();
  }, [table])


  
  useEffect(() => {
    let n = [];
    const jalan = () => {
      setload(true)

      sensor.map((e, i) => {
        let {sensor_user, ...data} = e;
        let {_id, ...sen} = sensor_user[0];
        let x = {...data, ...sen};
        let {address, dateOfBirth, gender, password, role, status, ...y} = x;
    // console.log(sen);
        n.push(y);
      })
    }
    jalan();
    setSensorUser([...n]);
    setload(false)
    // console.log(n);
  }, [sensor])

  useEffect(() => {
    const userData = () => {
      let userdatanew = [];
      user.map((e, i) => {
        const { password, ...uu} = e;
        userdatanew.push(uu)
      })
      setUser([...userdatanew])
    }
    userData
  }, [])



  const deletedata = async (id, title) => {
    if (title == "Sensor"){
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/sensor/${id}`, {
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
    } else if(title == "User") {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/user/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete data');
        }
        const filteredData = user.filter(item => item._id !== id);
        setUser([...filteredData])
        notifyDelete();
      } catch (error) {
        console.log(error);
      }      
    }

}
const handleFormSensor = (uid, mode) => {
  if(mode == "add") postSensor(uid);
  else editSensor(uid);
}

    const [sid, setsid] = useState(0)
    const [editForm, setEditForm] = useState(false);

    const editdata = (id, title) => {
      // setsid(id);
      // setUid(id);
      // console.log(uid +" "+ id)
      setMode("edit")
      console.log(mode);
      if(title == "Sensor"){
        setsensorPost({
        id,
        userId:sensorUser[id].userId,
        longitude:sensorUser[id].longitude,
        latitude:sensorUser[id].latitude,
        type: sensorUser[id].type,
        lokasi: sensorUser[id].lokasi
      })
      // console.log(JSON.stringify(user))
      // console.log(sensorUser[id].userId);
      let selectedUser = user
      .map((item, index) => ({ ...item, index })) // Add index to each item
      .filter(item => item._id === sensorUser[id].userId)
      .map(item => item.index);
      // console.log(selectedUser)
      setUid(selectedUser[0])
      console.log(selectedUser);
      setform(p => !p);
    }
    }

    const [form, setform] = useState(false)
    const [userform, setuserform] = useState(false)

  const addDevice = () => {
    setform(!form)
  }
  const addUser = () => {

    setuserform(!userform)
  }

  const editSensor = async (uid) => {
    const data = {
        ...sensorPost,
        userId: user[uid]._id
    }

    const {id, ...updateData} = data;
    console.log(uid);
    console.log(updateData);
    console.log(sensorUser[id]._id);
    // return;

    setMode("add");
    console.log(mode);

    setsensorPost({
      userId:'',
      longitude:'',
      latitude:'',
      type: '',
      lokasi: ''
    })
    setUid(0);

    setMode("add")
    
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/sensor/${sensorUser[id]._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          throw new Error('Failed to create post');
        }

        console.log('New post:', updateData);
        notifySuccess();
        setform(p => !p)
        // setrender(Date.now() * Math.random());
        setTable(prev => !prev)
        return response
      } catch (error) {
        console.error('Error:', error.message);
        
        return error;
      }
  }
  const postSensor = async (uid) => {
    const postdata = {
        ...sensorPost,
        userId: user[uid]._id
    }
    
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/sensor/`, {
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
        // setrender(Date.now() * Math.random());
        setTable(prev => !prev)
        return response
      } catch (error) {
        console.error('Error:', error.message);
        return error;
      }


  }

  const postUser = async (uid) => {
    const postdata = {
        ...userPost,
        password: 1234
    }
    
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/user/`, {
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
        // setrender(Date.now() * Math.random());
        setTable(prev => !prev)
        return response
      } catch (error) {
        console.error('Error:', error.message);
        return error;
      }
  }

  const formUser = () => {
    return (
      <>
        <div className='flex my-5 justify-between px-2'>
        <p className='mr-2'>User Name</p>
        <select onChange={(e) => setUid(e.target.value)} value={uid}>
          {
            (load2)? <p>Loading</p> :
            user.map((e, i) => <option value={i}>{e.name}</option> )
          }
        </select>
        </div>
          {
            (load2)? <p>Loading</p> :
            <>
              <div className='flex my-5 justify-between px-2'>
                <p className='mr-2'>email</p>
                <input type='text' disabled={true} value={user[uid].email} />
              </div>
              <div className='flex my-5 justify-between px-2'>
                <p className='mr-2'>gender</p>
                <input type='text' disabled={true} value={user[uid].gender} />
              </div>
            </>
          }
      </>
    )
  }

  

  return (
    <div>
      <div className="mt-5">
      {
            (loadmap)?<h1>Loading</h1>:
            <Card extra="w-full p-4">
              <h1 className="text-2xl ">Red Area</h1>
            <div className="relative w-full h-[300px]">
            <MapAnalysis
                        key={emergency[0]._id}
                        latitude={emergency[0].latitude}
                        longitude={emergency[0].longitude}
                        emergencies={emergency}
            />
            </div>
            </Card>
        }
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 ">
        {
          (!load) &&
          <ColumnsTable
          title="Sensor"
          columnsData={columnsDataSensorUser}
          tableData={sensorUser}
          setform={setform}
          deleteHandler = {deletedata}
          editHandler = {editdata}
          />
        }
        { 
        (!load2) ?       
        <ColumnsTable
        title="User"
        columnsData={columnsDataUserAdmin}
        tableData={user}
        setform={addUser}
        deleteHandler = {deletedata}
        /> : <></>
        }
      </div>
      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2 mt-5">
          {/* <DailyTraffic /> */}
          {/* <PieChartCard /> */}
      </div>
      {
        (form) &&      
      <div className=" w-screen h-screen fixed top-0 left-0 z-[100] bg-gray-800 bg-opacity-50">
        <div className="absolute top-[50vh] left-[50vw] -translate-x-[50%] -translate-y-[50%] ">
          <Card extra={"w-[40vw] p-5 bg-red-500"}>
        <>
          {formUser()}
          <InputField
            value={sensorPost.longitude}
            variant="sensor"
            extra="mb-3"
            label="Longitude"
            id="longitude"
            type="text"
            handler={(e) => setsensorPost({...sensorPost, longitude:e.target.value})}
          />
          <InputField
            value={sensorPost.latitude}
            variant="sensor"
            extra="mb-3"
            label="Latitude"
            id="latitude"
            type="text"
            handler={(e) => setsensorPost({...sensorPost, latitude:e.target.value})}
          />
          <InputField
            value={sensorPost.type}
            variant="sensor"
            extra="mb-3"
            label="Type"
            id="type"
            type="text"
            handler={(e) => setsensorPost({...sensorPost, type:e.target.value})}
          />
          <InputField
            value={sensorPost.lokasi}
            variant="sensor"
            extra="mb-3"
            label="Lokasi Pemasangan"
            id="lokasi"
            type="text"
            handler={(e) => setsensorPost({...sensorPost, lokasi:e.target.value})}
          />
          <div className="flex w-full justify-end">
            <button className="mx-4 linear mt-2 px-4 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" 
            onClick={() => setform(!form)}>Batal</button>
            <button className="mx-4 linear mt-2 px-4 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" 
            onClick={() => {handleFormSensor(uid, mode)}}>Tambah</button>
          </div>
          </>
      </Card>
      </div>
  </div>
      }
      {
        (userform) &&      
      <div className=" w-screen h-screen fixed top-0 left-0 z-[100] bg-gray-800 bg-opacity-50">
        <div className="absolute top-[50vh] left-[50vw] -translate-x-[50%] -translate-y-[50%] ">
          <Card extra={"w-[40vw] p-5 bg-red-500"}>
        <>
          <InputField
            // value={sensorPost.longitude}
            variant="sensor"
            extra="mb-3"
            label="Nama"
            id="Nama"
            type="text"
            handler={(e) => setuserPost({...userPost, name:e.target.value})}
          />
          <InputField
            // value={userPost.latitude}
            variant="sensor"
            extra="mb-3"
            label="Email"
            id="Email"
            type="text"
            handler={(e) => setuserPost({...userPost, email:e.target.value})}
          />
          <InputField
            // value={userPost.type}
            variant="sensor"
            extra="mb-3"
            label="Date of Birth"
            id="Date of Birth"
            type="text"
            handler={(e) => setuserPost({...userPost, dateOfBirth:e.target.value})}
          />
          <InputField
            // value={userPost.lokasi}
            variant="sensor"
            extra="mb-3"
            label="Gender"
            id="Gender"
            type="text"
            handler={(e) => setuserPost({...userPost, gender:e.target.value})}
          />
          <InputField
            // value={userPost.lokasi}
            variant="sensor"
            extra="mb-3"
            label="Address"
            id="Address"
            type="text"
            handler={(e) => setuserPost({...userPost, address:e.target.value})}
          />
          <InputField
            // value={userPost.lokasi}
            variant="sensor"
            extra="mb-3"
            label="Role"
            id="Role"
            type="text"
            handler={(e) => setuserPost({...userPost, role:e.target.value})}
          />
          <div className="flex w-full justify-end">
            <button className="mx-4 linear mt-2 px-4 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" 
            onClick={() => setuserform(!userform)}>Batal</button>
            <button className="mx-4 linear mt-2 px-4 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" 
            onClick={postUser}>Tambah</button>
          </div>
          </>
      </Card>
      </div>
  </div>
      }
    </div>
  );
};

export default Tables;
