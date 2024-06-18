import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/logo.svg'
// import { useHistory } from 'react-router-dom';

const Login = () => {
  // const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('login');
  const [newpassword , setNewPassword] = useState('');
  const [confirmpassword , setConfirmPassword] = useState('');
  const [activation, setactivation] = useState(true);
  const [useridactivation, setuseridactivation] = useState('');
  const [token, settoken] = useState('');

  const notifySuccess = () => toast.success('Success!', { autoClose: 5000 });

  const notifyError = (message) => {
    toast.error(message, { autoClose: 5000 });
  }

  const handleActivate = async (event) => {
    event.preventDefault();

    if(!activation){
      return await changePW();
    }
    // console.log('');
    const postdata = {
      email: username,
      password
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/auth/activate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postdata)
      })
      const res = await response.json();
      if (!response.ok) {
        notifyError(res.message)
        throw new Error('Failed to create post');
      }
      if(res.data.token){
        settoken(res.data.token)
        // window.open('/', '_self');
        setactivation(p => !p);
        setuseridactivation(res.id)
      }
      return ;
    } catch (error) {
      console.error('Error:', error.message);
      return error;
    }
  }

  const changePW = async (event) => {  
    if(newpassword != confirmpassword){
      notifyError('Password confirmation is wrong')
      return;
    }
    const postdata = {
      id: useridactivation,
      newPassword: newpassword
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/auth/changepw/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postdata)
      })
      const res = await response.json();
      if (!response.ok) {
        notifyError("Unable to connect")
        console.log(res.message);
        throw new Error('Failed to create post');
      }
      if (res.message == "data has modified"){
        localStorage.setItem('loginToken', token);
        window.open('/', '_self');
      }
      return ;
    } catch (error) {
      console.error('Error:', error.message);
      return error;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const postdata = {
      email: username,
      password
    }
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}v1/auth/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postdata)
        })
        const res = await response.json();
        if (!response.ok) {
          notifyError(res.message)
          throw new Error('Failed to create post');
        }
        if(res.data.token){
          localStorage.setItem('loginToken', res.data.token);
          window.open('/', '_self');
        }
        return ;
      } catch (error) {
        console.error('Error:', error.message);
        return error;
      }
  };

  const handleRegister = () => {
    if(view == "login") setView("register");
    else setView("login");
  }


  const renderActivationForm = () => {
    return (
      <div className='w-[50vw] flex flex-col justify-center items-center '>
      <h2 className='font-bold'>Aktivasi Akun Petugas Pemadam Kebakaran</h2>
      <form onSubmit={handleActivate} className='flex flex-col w-[500px]'>
        {
          (activation)?
        <>
        <div className='flex justify-between mt-10'>
          <label htmlFor="username">NIK:</label>
          <input
            type="text"
            id="username"
            value={username} 
            onChange={(event) => setUsername(event.target.value)}
            required
            className='border border-black rounded-md w-[300px]'
          />
        </div>
        <div className='flex justify-between mt-7'>
          <label htmlFor="password">Kode Pos Pemadam:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className='border border-black rounded-md w-[300px]'
          />
        </div>
        </> :
        <>
        <div className='flex justify-between mt-7'>
          <label htmlFor="password">Password Baru:</label>
          <input
            type="password"
            id="password"
            value={newpassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            className='border border-black rounded-md w-[300px]'
          />
        </div>
        <div className='flex justify-between mt-7'>
          <label htmlFor="password">Ulangi Password:</label>
          <input
            type="password"
            id="password"
            value={confirmpassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className='border border-black rounded-md w-[300px]'
          />
        </div>
        </>
        }
        <button type="submit" className='bg-brand-500 rounded-2xl px-14 py-1 text-white w-[300px] mx-auto mt-10'>Aktivasi</button>
      </form>
      <p className='my-4'>Sudah punya akun? <span onClick={handleRegister} className=' text-brand-500 underline cursor-pointer'>Login</span></p>
      </div>
    )
  }

  return (
    <div className="flex">
        <ToastContainer 
        position='top-left'
        onClick={() => setPage('emergencies')}
        />
    <div className="bgauth min-h-screen w-[50vw] flex justify-center items-center font-bold text-2xl" >
      <img src={logo} width={200}/>
    </div>
    {
      (view == "login")?
    
    <div className='w-[50vw] flex flex-col justify-center items-center '>
      <p>Halo</p>
      <h2 className='font-bold'>Selamat Datang</h2>
      <form onSubmit={handleSubmit} className='flex flex-col w-[500px]'>
        <div className='flex justify-between mt-10'>
          <label htmlFor="username">Email / NIK:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className='border border-black rounded-md w-[300px]'
          />
        </div>
        <div className='flex justify-between mt-7'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className='border border-black rounded-md w-[300px]'
          />
        </div>
        <button type="submit" className='bg-brand-500 rounded-2xl px-14 py-1 text-white w-[300px] mx-auto mt-10'>Login</button>
      </form>
      <p className='my-4'>Aktivasi Akun Petugas Pemadam Kebakaran <span onClick={handleRegister} className=' text-brand-500 underline cursor-pointer'>Disini</span></p>
    </div>
    :
    renderActivationForm()
    }
    </div>
  );
};

export default Login;

