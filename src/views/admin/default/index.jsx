import { IoDocuments, IoAlertCircle } from "react-icons/io5";
import MapData from "../../../components/MapData";
import Detail from "./components/Detail";
import Card from "../../../components/card";
import Widget from "../../../components/widget/Widget";

import React, {useState, useEffect, useRef} from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifySuccess = (msg) => toast.success(msg, { autoClose: 5000 });

const notifyError = (message) => {
  toast.error(message, { autoClose: 5000 });
}

const Dashboard = () => {
  const [emergency, setEmergency] = useState(undefined);
  const [ID, setID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reRender, setreRender] = useState(false);
  const [firestat, setfirestat] = useState('')

  useEffect(() => {
    const fetchData = async () => {
    setLoading(true)
      try {
        const response = await fetch('http://localhost:3300/v1/emergency/detail');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setEmergency(jsonData.data);
        // console.log(emergency[0].latitude);
        setLoading(false)
        setID(0);
      } catch (error) {
        console.log(error);
        setLoading(true)
      }
    };
    fetchData();
  }, 
  [reRender]
  );

  const updateStat = async () => {
    let {sensorData, userData, _id, ...updata} = emergency[ID];
    updata.status = firestat;
    console.log(updata);
    
    try {
        const result = await fetch(`http://localhost:3300/v1/emergency/${_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updata)
        })
        const resdata = await result.json();
        console.log(resdata);
        if(!result.ok){
          throw new Error(resdata.message);
        }
        notifySuccess(resdata.message)
        setreRender(p=>!p);
        
        return;
    } catch (error) {
        console.error('Error:', error.message);
        notifyError(error.message)
        return error;
    }
  }

  const color = (i) => {
    if(i == 3){
        return "h-6 w-6 text-red-300"
    } else if (i == 2){
        return "h-6 w-6 text-yellow-400"
    } else {
        return "hidden"
    } 
  }

  const notif = (s) => {
    // const s = emergency[ID].status;
    if(s == 3){
      return "Darurat Kebakaran"
    } else if(s == 2){
      return "Dalam Penanganan"
    } else {
      return "Padam"
    }
  }

  return (
    <>
    {
      (loading)?<h1>Loading</h1>:
    <div>
      {/* Card widget */}
      <div className="flex w-full mt-4">
      <div className="mt-3 flex flex-col justify-start [&>*]:mb-4 mr-4 w-[40vw]">
      <div className="sticky top-28 z-50 flex h-fit w-full items-center justify-between rounded-2xl bg-white px-4 pt-4 pb-[20px] shadow-2xl shadow-gray-100 dark:!bg-navy-700 dark:shadow-none">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Notifikasi
        </h4>
        <button className="linear rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20">
          Show All
        </button>
      </div>
      {
        [...emergency].reverse().map((e, i) => 
        <div 
        onClick={() => {setID(emergency.length - 1 - i)}}
        >
        <Widget
          key={i}
          icon={<IoAlertCircle className={color(e.status)} />}
          subtitle={notif(e.status)}
          title={e.timestamp}
          />
          </div>
          )
      }
      </div>
        <div className="w-full h-fit sticky top-28">
          <Card extra="w-full p-4">
          <div className="relative w-full h-[300px]">
          <MapData
              key={emergency[ID]._id}
              latitude={emergency[ID].latitude}
              longitude={emergency[ID].longitude}
              // emergencies={emergencies}
              />
          </div>
          </Card>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Detail data={emergency[ID].sensorData} title="Informasi Perangkat"/>
            <Detail data={emergency[ID].userData[0]} title="Informasi Pengguna"/>
          </div>
          <Card extra="mt-5">
                  <div className='flex w-full justify-between items-center my-4 px-5'>
                    <p>Status Kebakaran</p>
                    <select className=' rounded-xl border bg-white/0 p-3 text-sm outline-none' defaultValue={emergency[ID].status} onChange={(e) => setfirestat(e.target.value)}>
                        <option value={3}>Darurat Kebakaran</option>
                        <option value={2}>Dalam Penanganan</option>
                        <option value={1}>Padam</option>
                    </select>
                    <button className="linear mt-2 px-4 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" 
                    onClick={updateStat}>Update Status</button>
                  </div>
          </Card>
        </div>
      </div>
    </div>
    }
    </>
  );
};

export default Dashboard;
