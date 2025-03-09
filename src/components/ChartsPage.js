import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ChartsPage = () => {
  const [userTypeCounts, setUserTypeCounts] = useState([]);
  const [numberNoCounts, setNumberNoCounts] = useState([]);
  const [totalDocumentCount, setTotalDocumentCount] = useState(0);
  const [candidates, setCandidates] = useState([]);

  const fetchCounts = async () => {
    try {
      const response = await fetch("/api/scores");
      const data = await response.json();
      setUserTypeCounts(data.userTypeCounts);
      setNumberNoCounts(data.numberNoCounts);
      setTotalDocumentCount(data.totalDocumentCount);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/election");
      const data = await response.json();
      if (data && Array.isArray(data.posts)) {
        setCandidates(data.posts);
      } else {
        console.error("Invalid response format:", data);
        setCandidates([]);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchCandidates();
    const intervalId = setInterval(fetchCounts, 60000); // Fetch counts every 1 minute
    return () => clearInterval(intervalId);
  }, []);

  const userTypeMapping = {
    "ปวช.1": "ปวช.1",
    "ปวช.2": "ปวช.2",
    "ปวช.3": "ปวช.3",
    "ปวส.1": "ปวส.1",
    "ปวส.2": "ปวส.2",
  };

  const userTypeLabels = userTypeCounts.map(
    (item) => userTypeMapping[item.user_type] || item.user_type
  );
  const userTypeValues = userTypeCounts.map((item) => item.count);

  const numberNoLabels = numberNoCounts.map((item) =>
    item.number_no === 0 ? "งดออกเสียง" : `เบอร์ ${item.number_no}`
  );
  const numberNoValues = numberNoCounts.map((item) => item.count);

  const pieData = {
    labels: userTypeLabels,
    datasets: [
      {
        label: "ระดับชั้น",
        data: userTypeValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: numberNoLabels,
    datasets: [
      {
        label: "จำนวนคะแนน",
        data: numberNoValues,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          ข้อมูลการเลือกตั้ง
        </h1>

        <div className="flex justify-center mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 shadow-lg rounded-lg p-8 max-w-md text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              จำนวนคนลงคะแนน
            </h2>
            <p className="text-5xl font-bold text-white">
              {totalDocumentCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
              ห้องเรียนที่มาใช้สิทธิ์
            </h2>
            <div className="h-96">
              <Pie
                data={pieData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
              คะแนนผู้สมัคร
            </h2>
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
                        text: "เบอร์สมัคร",
                        color: "#333",
                        font: {
                          size: 16,
                          weight: "bold",
                        },
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "จำนวนคนที่เลือก",
                        color: "#333",
                        font: {
                          size: 16,
                          weight: "bold",
                        },
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center pt-6 mb-8">
            คะแนนผู้สมัคร
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.length > 0 ? (
              candidates
                .map((candidate) => {
                  const candidateVotes =
                    numberNoCounts.find(
                      (item) => item.number_no === candidate.number_no
                    )?.count || 0;
                  const votePercentage =
                    totalDocumentCount > 0
                      ? (candidateVotes / totalDocumentCount) * 100
                      : 0;

                  return {
                    ...candidate,
                    candidateVotes,
                    votePercentage,
                  };
                })
                .sort((a, b) => b.candidateVotes - a.candidateVotes) // จัดเรียงตามคะแนนจากมากไปน้อย
                .map((candidate) => {
                  return (
                    <div
                      key={candidate.id}
                      className="bg-white flex items-center shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                      {/* รูปผู้สมัคร */}
                      <img
                        src={`/assets/election/profile/${candidate.img_profile}`}
                        alt={`${candidate.name} ${candidate.lastname}`}
                        className="w-32 h-32  rounded-lg object-cover"
                      />

                      {/* ข้อมูลผู้สมัคร */}
                      <div className="flex-1">
                        <p className="text-center text-xl font-semibold text-gray-800">
                          {candidate.name} {candidate.lastname}
                        </p>
                        <p className="text-center text-lg text-gray-600">
                          เบอร์ {candidate.number_no}
                        </p>
                        <p className="text-center text-2xl font-bold text-blue-700 mt-4">
                          {candidate.candidateVotes} คะแนน (
                          {candidate.votePercentage.toFixed(2)}%)
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full pl-2 h-4 mt-3">
                          <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${candidate.votePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-center text-gray-600 text-xl">
                กำลังโหลดข้อมูลผู้สมัคร...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
