import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';

const Login = () => {
  // const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    window.open('/dashboard', '_self');
  };

  return (
    <div className="flex">
    <div className="bg-primary min-h-screen w-[50vw] flex justify-center items-center font-bold text-2xl">
      <img src={'logo.svg'} width={200}/>
    </div>
    <div className='w-[50vw] flex flex-col justify-center items-center '>
      <p>Halo</p>
      <h2 className='font-bold'>Selamat Datang</h2>
      <form onSubmit={handleSubmit} className='flex flex-col w-[500px]'>
        <div className='flex justify-between mt-10'>
          <label htmlFor="username">Username:</label>
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
        <button type="submit" className='bg-primary rounded-2xl px-14 py-1 text-white w-[300px] mx-auto mt-10'>Login</button>
      </form>
    </div>
    </div>
  );
};

export default Login;

