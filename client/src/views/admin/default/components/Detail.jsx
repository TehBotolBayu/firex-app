import React, { createFactory } from 'react'
import Card from '../../../../components/card'

function Detail({data, title}) {
    // const [user, setUser] = useState({});
    // const [sensor, setSensor] = useState(undefined);
    // const [loading, setLoading] = useState(true);
    // const [firestat, setfirestat] = useState('')

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true)
    //         try {
    //             const sid = await emergency.sensorId;
    //             const sensor = await fetch(`http://localhost:3300/v1/sensor/${sid}`);
    //             if (!sensor.ok) {
    //             throw new Error('Failed to fetch data');
    //             }
    //             const jsonsensor = await sensor.json();
    //             setSensor(jsonsensor.data[0]);
        
    //             const uid = jsonsensor.data[0].userId;
    //             const user = await fetch(`http://localhost:3300/v1/user/${uid}`);
    //             if (!user.ok) {
    //             throw new Error('Failed to fetch data');
    //             }
    //             const jsonuser = await user.json();
    //             setUser(jsonuser.data[0]);  
    //             setLoading(false)
    //         } catch (error) {
    //         console.log(error);
    //         setLoading(true)
    //         }
    //     };
    //     fetchData();
    // }, [emergency]);

    const createList = (jsonData) => {
        const jsxAttributes = [];
        for (const key in jsonData) {
            if (Object.hasOwnProperty.call(jsonData, key)) {
                if(key == "_id" || key == "userId" || key == "password"){
                    continue;
                }
              const value = jsonData[key];
            //   console.log(`${key}: ${value}`);
              jsxAttributes.push(
                <tr>
                <td>
                <p className="text-md font-bold text-navy-700 dark:text-white">
                    {key}
                </p>
                </td>
                <td>
                <p className="text-md font-bold text-navy-700 dark:text-white">
                    {value}
                </p>                   
                </td>
                </tr>
              );              
              // You can perform any operation with the attribute and its value here
            }
        }
        return jsxAttributes;
    }
    createList(data)
  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
        <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
               {title}
            </div>
        </header>
        <table className='mt-5'>
            {
                createList(data)
            }
        </table>

    </Card>
  )
}

export default Detail