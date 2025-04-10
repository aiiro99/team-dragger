// src/App.tsx

import { useState } from 'react'

function App() {
  const [teams, ] = useState([
    { id: 'team-a', name: 'Team A', members: ['Alice', 'Bob'] },
    { id: 'team-b', name: 'Team B', members: ['Charlie', 'Dave'] }
  ])

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">チームドラッグアプリ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
            <ul className="space-y-1">
              {team.members.map((member, idx) => (
                <li
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded"
                >
                  {member}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  )
}

export default App