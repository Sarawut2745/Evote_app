import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ChartsPage = () => {
  const [userTypeCounts, setUserTypeCounts] = useState([]);
  const [numberNoCounts, setNumberNoCounts] = useState([]);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const response = await fetch('/api/scores');
      const data = await response.json();
      setUserTypeCounts(data.userTypeCounts);
      setNumberNoCounts(data.numberNoCounts);
      setTotalDocumentCount(data.totalDocumentCount);
    };

    fetchCounts();
  }, []);

  const userTypeMapping = {
    'ปวช.1': 'ปวช.1',
    'ปวช.2': 'ปวช.2',
    'ปวช.3': 'ปวช.3',
    'ปวส.1': 'ปวส.1',
    'ปวส.2': 'ปวส.2',
  };

  const userTypeLabels = userTypeCounts.map(item => userTypeMapping[item.user_type] || item.user_type);
  const userTypeValues = userTypeCounts.map(item => item.count);


  const numberNoLabels = numberNoCounts.map(item => item.number_no);
  const numberNoValues = numberNoCounts.map(item => item.count);

  const pieData = {
    labels: userTypeLabels,
    datasets: [
      {
        label: 'ระดับชั้น',
        data: userTypeValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for number_no
  const barData = {
    labels: numberNoLabels,
    datasets: [
      {
        label: 'จำนวนคำแนน',
        data: numberNoValues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">ข้อมูลการเลือกตั้ง</h1>

        <div className="flex justify-center mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 shadow-lg rounded-lg p-8 max-w-md text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">จำนวนคนลงสมัคร</h2>
            <p className="text-5xl font-bold text-white">{totalDocumentCount}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie Chart for User Types */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">ห้องเรียนที่มาใช้สิทธิ</h2>
            <div className="h-96">
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Bar Chart for Number No */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">คะแนน ผู้สมัคร</h2>
            <div className="h-96">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'เบอร์สมัคร', // ชื่อแกน X
                        color: '#333',
                        font: {
                          size: 16,
                          weight: 'bold',
                        },
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'จำนวนคนที่เลือก', // ชื่อแกน Y
                        color: '#333',
                        font: {
                          size: 16,
                          weight: 'bold',
                        },
                      },
                      beginAtZero: true, // เริ่มจาก 0
                    },
                  },
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
