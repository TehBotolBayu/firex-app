import Card from "../../../../components/card";
import React, {useEffect, useContext, useState} from "react";
import { UserContext } from "../../../../layouts/admin";
import editicon from "../../../../assets/edit.png";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const notifySuccess = (msg) => toast.success(msg, { autoClose: 5000 });
const notifyError = (message) => {
  toast.error(message, { autoClose: 5000 });
}


const General = (
  userData
) => {
  const [profiledata, setProfile] = useState(userData.userData.data[0]);
  const [onedit, setOnedit] = useState(false)
  const [onpw, setOnpw] = useState(false)
  const [pwpw, setpwpw] = useState({
    curr: '',
    new: '',
    conf: ''
  })

  const submitEdit = async () => {
    if(!onedit){
      return;
    } else {
    const {_id, ...data} = profiledata;
    try {
      const result = await fetch(`http://localhost:3300/v1/user/${profiledata._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const resdata = await result.json();
      if(!result.ok){
        throw new Error(result.message);
      }
      notifySuccess(resdata.message);
      return;
    } catch (error) {
      console.error('Error:', error.message);
      notifyError(error.message)
      return error;
    }
    }
  }

  const encryptpw = async () => {
    try {  
      const postdata = {
        password: pwpw.curr,
        hash: userData.data[0].password
      }
      const response = await fetch('http://localhost:3300/v1/auth/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postdata)
      });
      const updata = {
        password: pwpw.new
      }
      const reshash = await fetch('http://localhost:3300/v1/auth/hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updata)
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      if (!reshash.ok) {
        throw new Error('Failed to create post');
      }
      const same = await response.json();
      const hashed = await reshash.json();
      if(await same.data) {
        if(pwpw.new == ""){
          throw new Error('Password is Empty')
          
        }
        else if(pwpw.new === pwpw.conf) {
            setpassword(hashed.data);
            console.log(hashed.data);
            setOnpw(false);
            handleEdit();
        } else {
          throw new Error('Password Confirmation is Wrong')
        }
      } else throw new Error('Wrong Passsword')
    } catch (error) {
      console.error('Error:', error.message);
      notifyError(error.message)
      return error;
    }
  }

  return (
    <Card extra={"w-full h-full p-3"}>
      {/* Header */}
      <div className="mt-2 mb-8 w-full h-[20px]">
        <div className="flex justify-between items-center">

        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          General Information
        </h4>
        <img onClick={() => setOnedit(!onedit)} src={editicon} width='20px' height='20px'/>
        </div>
      </div>
      {/* Cards */}
      <div className="gap-4 px-2">
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none h-fit">
          <p className="text-sm text-gray-600">Name</p>
          <input 
          type="text"
          value={profiledata.name}
          disabled={!onedit}
          onChange={
            (e) =>
            setProfile({...profiledata, name:e.target.value})
          }
          className="text-base font-medium text-navy-700 dark:text-white mb-4" />

          <p className="text-sm text-gray-600">Email</p>
          <input 
          type="text"
          value={profiledata.email}
          disabled={!onedit}
          onChange={
            (e) =>
            setProfile({...profiledata, email:e.target.value})
          }
          className="text-base font-medium text-navy-700 dark:text-white mb-4" />

          <p className="text-sm text-gray-600">Date Of Birth</p>
          <input 
          type="text"
          value={profiledata.dateOfBirth}
          disabled={!onedit}
          onChange={
            (e) =>
            setProfile({...profiledata, dateOfBirth:e.target.value})
          }
          className="text-base font-medium text-navy-700 dark:text-white mb-4" />
        </div>

        <div className=" flex flex-col justify-center rounded-2xl bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none h-fit ">
          <p className="text-sm text-gray-600 mb-4">Password</p>
          {
            (onpw) && <>
            

          <input 
          type="text"
          disabled={!onedit}
          onChange={(e)=>setpwpw({...pwpw, curr:e.target.value})}
          className="text-base font-medium text-navy-700 dark:text-white mb-4" 
          placeholder="Current Password"  />
          <input 
          type="text"
          disabled={!onedit}
          onChange={(e)=>setpwpw({...pwpw, new:e.target.value})}
          className="text-base font-medium text-navy-700 dark:text-white mb-4" 
          placeholder="New Password"  />
          <input 
          type="text"
          disabled={!onedit}
          onChange={(e)=>setpwpw({...pwpw, conf:e.target.value})}
          className="text-base font-medium text-navy-700 dark:text-white mb-4" 
          placeholder="Confirm New Password"  />     

            </>
          }     

          {/* <p className="text-base font-medium text-navy-700 dark:text-white"> */}
            <button className="linear mt-2 px-2 rounded-xl bg-brand-500 py-[12px] text-base font-small text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 " 
            onClick={()=>setOnpw(!onpw)}>{(onpw)?"Cancel":"Manage Password"}</button>
            {
              (onpw) &&
            <button className="linear mt-2 px-2 rounded-xl bg-brand-500 py-[12px] text-base font-small text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 " 
            onClick={encryptpw}>Confirm Password</button>    
          }
                    
          {/* </p> */}
        
        </div>

        <div className="h-fit ">
          {
            (onedit)?
            <button className="linear mt-2 px-4 rounded-xl bg-brand-500 py-[12px] text-base font-small text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" 
            onClick={()=>submitEdit()}>Update Data</button> :
            <button className="linear mt-2 px-4 rounded-xl bg-gray-300 py-[12px] text-base font-small text-white transition duration-200 hover:bg-gray-300 active:bg-gray-300 dark:bg-gray-300 dark:text-white dark:bg-gray-300 dark:active:bg-gray-300" 
            onClick={()=>{}}>Update Data</button>
          }
        </div>
      </div>
    </Card>
  );
};

export default General;
