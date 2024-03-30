import Banner from "./components/Banner";
import General from "./components/General";

import {
  columnsDataColumns, columnsDataSensor
} from "../tables/variables/columnsData";

import tableDataColumns from "../tables/variables/tableDataColumns.json";
import ColumnsTable from "../tables/components/ColumnsTable";

// import { UserContext } from "../../../App";
import React,  {useState, useEffect, useContext, useRef} from 'react';

// import editicon from '../../../../../assets/edit.png';
import editicon from "../../../assets/edit.png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserContext } from "../../../layouts/admin";

const notifySuccess = (msg) => toast.success(msg, { autoClose: 5000 });

const notifyError = (message) => {
  toast.error(message, { autoClose: 5000 });
}


const ProfileOverview = () => {
  const [user, setuser] = useState(useContext(UserContext))

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
    const userfetch = async () => {
      try {        
        const result = await fetch(`http://localhost:3300/v1/user/${user.data.id}`)
        if (!result.ok) {
          throw new Error('Failed to get data');
        }
        const resdata = await result.json();
        setuserData(resdata);
        // console.log(resdata);
        // setname(resdata.data[0].name);
        // setemail(resdata.data[0].email);
        // setgender(resdata.data[0].gender);
        // setdate(resdata.data[0].dateOfBirth);
        // setaddress(resdata.data[0].address);
        // setpassword(resdata.data[0].password);
      } catch (error) {
        console.log(error.message);
      }
    };
    userfetch();
  }, [])

  const [table, setTable] = useState(false);
  const [sensor, setSensor] = useState([]);
  // usestat
    
  useEffect(() => {
      const fetchSensor = async () => {
          setload(true)
          try {
        setload(false)

            const response = await fetch(`http://localhost:3300/v1/sensor/user/${user.data.id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setSensor([...jsonData.data]);

        setload(true);

          } catch (error) {
            console.log(error);
            setload(false)
          }
      }
      fetchSensor();
  }, [user, table])

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
      const result = await fetch(`http://localhost:3300/v1/user/${user.data.id}`, {
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
    <div className="flex w-full flex-col gap-5">
      
      <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5 h-fit w-full">
          {/* <Project /> */}
          {
            (loading) &&
          <General
          userData={userData}
          />
        }
        </div>
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5 h-fit">
          {/* <Banner /> */}
        </div>
      </div>
      <div className="col-span-1 h-full w-full rounded-xl 2xl:col-span-1">
      <ColumnsTable
          title="My Installed Devices"
          columnsData={columnsDataSensor}
          tableData={sensor}
        />
      </div>
    </div>
  );
};

export default ProfileOverview;
