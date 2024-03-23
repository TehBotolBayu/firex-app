import React, {useState, useEffect, useRef} from 'react';
import DashboardList from './DashboardList';
import Detail from './Detail';

function Emergencies({isRender}) {
    const [emergency, setEmergency] = useState(undefined);
    const [ID, setID] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reRender, setreRender] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true)
          try {
            const response = await fetch('http://localhost:3300/v1/emergency');
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setEmergency(jsonData.data);

            setLoading(false)
            setID(0);
          } catch (error) {
            console.log(error);
            setLoading(true)
          }
        };
        fetchData();
      }, [isRender, reRender]);
    
    return (
        <>
        {
            (loading)?<h1>Loading</h1>:
            <>
            <div className='notification'>
                <DashboardList
                title="Notifikasi"
                data={emergency}
                set={setID}
                />
            </div>
            <Detail
            reRender={setreRender}
            emergency={emergency[ID]}
            emergencies={emergency}
            />
            </>
        }
        </>
    )

    
}

export default Emergencies