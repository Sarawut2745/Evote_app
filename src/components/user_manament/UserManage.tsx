import React, { useState, useEffect } from 'react'

function UserManage() {
  const [sortOrder, setSortOrder] = useState({
    name: 'asc',
    user_type: 'asc',
  })

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user') // Adjust API endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const users = await response.json()
        setData(users)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSort = (column) => {
    const newSortOrder = sortOrder[column] === 'asc' ? 'desc' : 'asc'
    setSortOrder((prev) => ({ ...prev, [column]: newSortOrder }))

    const sortedData = [...data].sort((a, b) => {
      if (column === 'name') {
        return newSortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else if (column === 'user_type') {
        return newSortOrder === 'asc'
          ? a.user_type.localeCompare(b.user_type)
          : b.user_type.localeCompare(a.user_type)
      }
      return 0
    })

    setData(sortedData)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header and Add User Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">การจัดการผู้ใช้</h2>
        <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">
          เพิ่มผู้ใช้งาน
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-separate border-spacing-0">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th
                className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                เลขประจำตัวนักศึกษา
                {sortOrder.name === 'asc' ? ' ↑' : ' ↓'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">เลขบัตรประชาชน</th>
              <th
                className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('user_type')}
              >
                ระดับชั้น
                {sortOrder.user_type === 'asc' ? ' ↑' : ' ↓'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index}>  
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.posonal_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.user_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-900">
                  <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">แก้ไข</button>
                  <button className="ml-2 px-4 py-2 rounded bg-red_1-500 text-white hover:bg-red_1-600">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManage
