import React, { useEffect, useState, useRef } from 'react';
import {user} from '../constant';
import editicon from '../assets/edit.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifySuccess = (msg) => toast.success(msg, { autoClose: 5000 });

const notifyError = (message) => {
  toast.error(message, { autoClose: 5000 });
}

function Profiles({id}) {

  const [userData, setuserData] = useState();
  const [loading, setload] = useState(false);
  const inputField = useRef();
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [gender, setgender] = useState('');
  const [date, setdate] = useState('');
  const [address, setaddress] = useState('');
  const [password, setpassword] = useState('');
  const [isOn, setisOn] = useState(false);
  const [clr, setClr] = useState( `gray-300`);
  const [chgPW, setchgPW] = useState(false);

  const [pwpw, setpwpw] = useState({
    curr: '',
    new: '',
    conf: ''
  })

  useEffect(() => {
    const user = async () => {
      setload(false)
      const result = await fetch(`http://localhost:3300/v1/user/${id}`)
      if (!result.ok) {
        throw new Error('Failed to get data');
      }
      const resdata = await result.json();
      
      setuserData(resdata);
      setload(true);
      setname(resdata.data[0].name);
      setemail(resdata.data[0].email);
      setgender(resdata.data[0].gender);
      setdate(resdata.data[0].dateOfBirth);
      setaddress(resdata.data[0].address);
      setpassword(resdata.data[0].password);
    };
    user();
  }, [])

  const handleEdit = () => {
    setisOn(!isOn)
  }

  useEffect(() => {
    function chgedit() {
      if(isOn == true) setClr('primary');
      else setClr('gray-300')
    }
    chgedit();
  }, [isOn])
  

  const submitEdit = async () => {
    if(!isOn){
      return;
    } else {
    const data = {
      email,
      password,
      name,
      dateOfBirth:date,
      address,
      role:userData.data[0].role,
      gender,
      status:userData.data[0].status, 
    }
    
    try {
      const result = await fetch(`http://localhost:3300/v1/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const resdata = await result.json();
      if(!result.ok){
        notifyError(res.message)
        throw new Error('Failed to create post');
      }
      notifySuccess(resdata.message);
      return;
    } catch (error) {
      console.error('Error:', error.message);
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
            setchgPW(false);
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
    <div className='bg-white p-10 w-[500px] mr-10'>
    {
      (!loading) ? <h1>Loading</h1>:
      <>
      <div className='flex justify-between'>
        <h1 className='font-bold text-xl '>Profile</h1>
        <img onClick={handleEdit} src={editicon} width='30px'/>
      </div>
      <div className='flex my-10 justify-between'>
        <h1>Name</h1>
        <input disabled={!isOn} ref={inputField} value={name} onChange={(e)=>setname(e.target.value)} className='shadow-xl border'/>
      </div>
      <div className='flex my-10 justify-between'>
        <h1>Email</h1>
        <input disabled={!isOn} ref={inputField} value={email} onChange={(e)=>setemail(e.target.value)} className='shadow-xl border'/>
        </div>
      <div className='flex my-10 justify-between' >
        <h1>Gender</h1>
        <input disabled={!isOn} ref={inputField} value={gender} onChange={(e)=>setgender(e.target.value)} className='shadow-xl border'/>
      </div>
      <div className='flex my-10 justify-between' >
        <h1>Date of Birth</h1>
        <input disabled={!isOn} ref={inputField} value={date} onChange={(e)=>setdate(e.target.value)} className='shadow-xl border'/>
      </div>
      <div className='flex my-10 justify-between' >
        <h1>Address</h1>
        <input disabled={!isOn} ref={inputField} value={address} onChange={(e)=>setaddress(e.target.value)} className='shadow-xl border'/>
      </div>
      <div className='flex my-10 justify-between items-center' >
        <h1>Password</h1>
        <div className={`btn bg-primary my-0`} onClick={() => setchgPW(!chgPW)}>Change Password</div>  
      </div>
      </>
    }
    <div className={`btn bg-${clr}`} onClick={submitEdit}>Update</div>
    {
      (!chgPW)? <></>:
    <div className='min-w-[100vw] min-h-[100vh] w-full h-full bg-black/50 absolute top-0 left-0'>
      <div className='form shadow-lg'>
        <h1 className='text-center font-bold'>Change Password</h1>
        <div className='flex my-10 justify-between ' >
          <h1 className='mr-4'>Current Password</h1>
          <input value={pwpw.curr} onChange={(e)=>setpwpw({...pwpw, curr:e.target.value})} className='shadow-xl border'/>
        </div>
        <div className='flex my-10 justify-between' >
          <h1 className='mr-4'>New Password</h1>
          <input value={pwpw.new} onChange={(e)=>setpwpw({...pwpw, new:e.target.value})} className='shadow-xl border'/>
        </div>
        <div className='flex my-10 justify-between' >
          <h1 className='mr-4'>Confirm New Password</h1>
          <input value={pwpw.conf} onChange={(e)=>setpwpw({...pwpw, conf:e.target.value})} className='shadow-xl border'/>
        </div>
        <div className='flex my-10 justify-between' >
          <div className={`btn bg-blue-300`} onClick={encryptpw}>Confirm</div>
          <div className={`btn bg-primary`} onClick={() => setchgPW(!chgPW)}>Cancel</div>
        </div>
      </div>
      </div>
    }
    </div>
  )
}

export default Profiles