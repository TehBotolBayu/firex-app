import React from 'react'

function DashboardList({title, data, set}) {
    const handleClick = (i) => {
        set(data.length - 1 - i)
    }
    return (
        <div className='list'>
            <h1 className='font-bold text-lg'>{title}</h1>
            {
                [...data].reverse().map((e, i) => {
                    return (
                        <div key={i} className='list-content' onClick={() => handleClick(i)}>
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