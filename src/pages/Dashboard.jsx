import React, { useEffect, useState } from 'react'

import { format, startOfMonth, endOfMonth } from 'date-fns';

const Dashboard = () => {

    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = format(startOfMonth(currentDate), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(currentDate), 'yyyy-MM-dd');

    useEffect(() => {

    },[]);

  return (
    <div>
        {monthStart} - {monthEnd}
    </div>
  )
}

export default Dashboard