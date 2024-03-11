import React, {useEffect, useState, useRef} from 'react'
import Emergencies from "../components/Emergencies";
import Devices from "../components/Devices";
import Profiles from "../components/Profiles";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Analysis from '../components/Analysis';


function Dashboard() {
  
    const [page, setPage] = useState('profiles')
    const [mock, setMock] = useState(undefined);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [render, setRender] = useState(Date.now());

    const notifySuccess = () => toast.success('Success!', { autoClose: 5000 });
    const notifyError = () => toast.error('🔥 Peringatan Kebakaran!', { autoClose: 5000 });
    const notify = () => toast("Wow so easy!");
    const renderPage = (page) => {
        if(page === "profiles"){
            return (
                <Profiles/>
            )
        } else if(page === "emergencies"){
            return (
                <Emergencies isRender={render} />
            )
        } else if(page === "devices"){
            return (
                <Devices />
            )
        }else if(page === "a"){
          return (
              <Analysis />
          )
      }
    }

    const postEmergency = async (newdata) => {
        // data.timestamp = new Date();
        console.log(newdata);
        try {
            const response = await fetch('http://localhost:3300/v1/emergency', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: newdata
            });
      
            if (!response.ok) {
              throw new Error('Failed to create post');
            }
      
            // const data = await response.json();
            console.log('New post:', newdata);
            notifyError();
            setRender(Date.now())
          } catch (error) {
            console.error('Error:', error.message);
          }
    }

    useEffect(() => {

        const newSocket = io('http://localhost:3300'); // Replace with your Socket.IO server URL
        setSocket(newSocket);
    
        // Event listener for receiving messages
        newSocket.on('message', (message) => {
        //   setMessages((prevMessages) => [...prevMessages, message.id]);
            postEmergency(message);
        });
    
        return () => {
          newSocket.disconnect(); // Clean up on component unmount
        };
      }, []);

      
    
  return (
    <div className='dashboard-container'>
        <ToastContainer 
        position='top-left'
        onClick={() => setPage('emergencies')}
        />
        <nav className='sidebar'>
            <ul>
                <li><img src="logo.svg" className='mb-10'></img></li>
                <li onClick={() => setPage('profiles')}>Profile</li>
                <li onClick={() => setPage('emergencies')}>Emergency</li>
                <li onClick={() => setPage('devices')}>Devices</li>
                <li onClick={() => setPage('a')}>Red Area</li>
            </ul>
        </nav>
        <aside className='content-data'>
        {
            renderPage(page)
        }
        </aside>
    </div>
  )
}

export default Dashboard