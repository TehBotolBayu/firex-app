import React,  {useEffect, useState, useRef, createContext} from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
// import Footer from "components/footer/Footer";
import routes from "../../routes.jsx";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { UserContext } from "../../App.jsx";

// import React, {useState, useEffect, useContext, createContext} from 'react';
export const UserContext = createContext()

export function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");

  const [page, setPage] = useState('profiles')
  const [mock, setMock] = useState(undefined);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [render, setRender] = useState(Date.now());

  const notifySuccess = () => toast.success('Success!', { autoClose: 5000 });
  const notifyError = () => toast.error('🔥 Peringatan Kebakaran!', { autoClose: 5000 });
  const notify = () => toast("Wow so easy!");


  const [isLogin, setisLogin] = useState()
  const [user, setuser] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('loginToken');
    const postdata = {
      token
    }
    const isValid = async () => {
      // notifySuccess();
      try {
        const result = await fetch('http://localhost:3300/v1/auth/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postdata) 
        })
        const resdata = await result.json();
        if (!result.ok) {
          throw new Error(resdata.message);
        }
        if(resdata.message == "valid token"){
          setuser(resdata);
          setisLogin(true);
          return
        }
        setisLogin(false);
      } catch (error) {
        console.log(error.message);
      }
    }
    notifyError();
    isValid();
  }, [])
  
  // const renderPage = (page) => {
  //     if(page === "profiles"){
  //         return (
  //             <Profiles id={user.data.id}/>
  //         )
  //     } else if(page === "emergencies"){
  //         return (
  //             <Emergencies isRender={render} user={user} />
  //         )
  //     } else if(page === "devices"){
  //         return (
  //             <Devices />
  //         )
  //     }else if(page === "a"){
  //       return (
  //           <Analysis />
  //       )
  //     }else if(page == "login"){
  //       localStorage.removeItem('loginToken');
  //       window.open('/', '_self');
  //     } else if(page == "mydevices"){
  //       return (
  //         <MyDevices id={user.data.id}/>
  //       )
  //     }
  // }

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}/${month}/${day}`;
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    console.log("Current Date:", formattedDate);
    console.log("Current Time:", formattedTime);
    return formattedDate + " " + formattedTime
  }

  const postEmergency = async (buffer) => {
      const uint8Array = new Uint8Array(buffer);
      const decoder = new TextDecoder('utf-8');
      const jsonString = decoder.decode(uint8Array);
      let object = JSON.parse(jsonString);
      object = {...object, timestamp:getCurrentDate() } 
      try {
          const response = await fetch('http://localhost:3300/v1/emergency', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
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
        // console.log(message);    
        postEmergency(message);
      });
      return () => {
        newSocket.disconnect(); // Clean up on component unmount
      };
    }, []);

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";

  return (
    <div className="flex h-full w-full">

    { (isLogin) &&
      <UserContext.Provider value={user}>
        {/* <h1>asfsdg</h1>ss */}
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* <h1>asdfsljk</h1> */}
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}

                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              {/* <Footer /> */}
            </div>
          </div>
        </main>
      </div>
    </UserContext.Provider>
    }
    </div>
  );
}
