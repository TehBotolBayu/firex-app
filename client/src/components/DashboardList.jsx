import React from 'react'

function DashboardList({title, data, set}) {
    const handleClick = (i) => {
        set(data.length - 1 - i)
    }
    const color = (i) => {
        if(i == 3){
            return "#FDA292"
        } else if (i == 2){
            return "rgb(253, 224, 71)"
        } else {
            return "white"
        } 
    }
    return (
        <div className='list'>
            <h1 className='font-bold text-lg p-3 top-0 sticky bg-white'>{title}</h1>
            {
                [...data].reverse().map((e, i) => {
                    return ( 
                        <div key={i} className={`list-content`} style={{backgroundColor: color(e.status)}} onClick={() => handleClick(i)}>
                            <h2 className='font-bold'>Peringatan Kebakaran</h2>
                            <p>sensor Id: {e.sensorId}</p>
                            <p>{e.timestamp}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default DashboardList