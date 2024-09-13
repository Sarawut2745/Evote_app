"use client";

import { useEffect, useState } from 'react';

const CountsPage = () => {
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      const response = await fetch('/api/scores'); // Adjust the endpoint path
      const data = await response.json();
      setCounts(data.counts);
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <h1>Number No Counts</h1>
      <ul>
        {counts.map(({ number_no, count }) => (
          <li key={number_no}>
            Number No: {number_no}, Count: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountsPage;
