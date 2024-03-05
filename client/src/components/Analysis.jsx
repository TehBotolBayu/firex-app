import React, {useState, useEffect} from 'react'
import MapAnalysis from './MapAnalysis'
import Chart from './Chart';

function Analysis() {
    const [emergency, setEmergency] = useState(undefined);
    const [loading, setLoading] = useState(true);

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
          } catch (error) {
            console.log(error);
            setLoading(true)
          }
        };
        fetchData();
      }, []);
  return (
    <div>
        {/* <Chart/> */}
        {
            (loading)?<h1>Loading</h1>:
            <MapAnalysis
                        key={emergency[1]._id}
                        latitude={emergency[1].latitude}
                        longitude={emergency[1].longitude}
                        emergencies={emergency}
            />
        }
    </div>
  )
}

export default Analysis