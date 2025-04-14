import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Player } from '@lottiefiles/react-lottie-player'
import { toast, Toaster } from 'react-hot-toast'
import teamAnimation from './assets/team-animation.json'

const defaultAvatar = '/avatar.png'

type Team = {
  id: string
  name: string
  members: string[]
}

const defaultTeams: Team[] = [
  { id: 'team-a', name: 'Team A', members: ['Alice', 'Bob'] },
  { id: 'team-b', name: 'Team B', members: ['Charlie', 'Dave'] },
]

const STORAGE_KEY = 'team-dragger-data'
const colorClasses = [
  'border-blue-400',
  'border-green-400',
  'border-pink-400',
  'border-yellow-400',
  'border-purple-400',
]

function App() {
  const [teams, setTeams] = useState<Team[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultTeams
  })

  const [newMembers, setNewMembers] = useState<Record<string, string>>({})
  
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [dragCount, setDragCount] = useState(0)
  
  const [saveFlag, setSaveFlag] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
    toast.success('保存しました！')
    setSaveFlag(true)
    setTimeout(() => setSaveFlag(false), 2000)
  }, [teams])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    const sourceIndex = teams.findIndex(t => t.id === source.droppableId)
    const destIndex = teams.findIndex(t => t.id === destination.droppableId)
    const sourceTeam = { ...teams[sourceIndex] }
    const destTeam = { ...teams[destIndex] }
    const [moved] = sourceTeam.members.splice(source.index, 1)
    destTeam.members.splice(destination.index, 0, moved)
    const updated = [...teams]
    updated[sourceIndex] = sourceTeam
    updated[destIndex] = destTeam
    setTeams(updated)
    setDragCount(d => d + 1)
  }

  const addTeam = () => {
    const id = `team-${Date.now()}`
    const newTeam = { id, name: '新しいチーム', members: [] }
    setTeams([...teams, newTeam])
  }

  const deleteTeam = (id: string) => {
    if (teams.length <= 1) return alert('最低1チームは必要です')
    setTeams(teams.filter(t => t.id !== id))
  }

  const updateTeamName = (id: string, name: string) => {
    setTeams(teams.map(t => (t.id === id ? { ...t, name } : t)))
  }

  const updateNewMember = (id: string, name: string) => {
    setNewMembers({ ...newMembers, [id]: name })
  }

  const addMember = (id: string) => {
    const name = newMembers[id]?.trim()
    if (!name) return
    setTeams(teams.map(t => (t.id === id ? { ...t, members: [...t.members, name] } : t)))
    setNewMembers({ ...newMembers, [id]: '' })
  }

  const removeMember = (teamId: string, member: string) => {
    setTeams(teams.map(t =>
      t.id === teamId ? { ...t, members: t.members.filter(m => m !== member) } : t
    ))
  }

  const exportTeams = () => {
    const blob = new Blob([JSON.stringify(teams, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teams.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const importTeams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (Array.isArray(data) && data.every(t => t.id && t.name && Array.isArray(t.members))) {
          setTeams(data);
          toast.success('インポート完了！');
        } else {
          toast.error('形式が不正です');
        }
      } catch {
        toast.error('JSON 読み込みエラー');
      }
    }
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-sky-50 to-slate-200 text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 transition-all">
      <Toaster />
      {saveFlag && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition z-50">
          ✔️ 保存しました！
        </div>
      )}
      <div className="flex justify-end mb-4 px-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 text-sm rounded bg-gray-800 text-white dark:bg-white dark:text-black shadow hover:opacity-80 transition"
        >
          {isDarkMode ? '☀️ ライトモードへ' : '🌙 ダークモードへ'}
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6">チームドラッグアプリ</h1>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6">
          <button onClick={addTeam} className="btn-green">＋ チーム追加</button>
          <button onClick={() => alert(JSON.stringify(teams, null, 2))} className="btn-blue">状態を表示</button>
          <button onClick={exportTeams} className="btn-indigo">📤 エクスポート</button>
          <label className="btn-purple cursor-pointer">
            📥 インポート
            <input type="file" accept=".json" onChange={importTeams} className="hidden" />
          </label>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">ドラッグ回数: {dragCount} 回</p>

        <Player
          id="team-lottie"
          autoplay
          keepLastFrame
          src={teamAnimation}
          style={{ height: '100px', width: '100px', margin: '0 auto' }}
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {teams.map((team, index) => (
              <Droppable droppableId={team.id} key={team.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white dark:bg-gray-800 border-4 ${colorClasses[index % colorClasses.length]} rounded-lg p-5 shadow-md hover:shadow-lg transition`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <img src="/avatar.png" alt="キャラクター画像" className="w-24 h-24 rounded-full shadow-lg mx-auto mb-4" />
                      <div className="flex items-center gap-2 w-full">
                        <img src={defaultAvatar} alt="avatar" className="w-7 h-7 rounded-full border" />
                        <input
                          value={team.name}
                          onChange={(e) => updateTeamName(team.id, e.target.value)}
                          className="w-full bg-transparent text-lg font-semibold border-b border-gray-300 focus:outline-none dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({team.members.length}人)</span>
                      </div>
                      <button
                        onClick={() => deleteTeam(team.id)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        ✕
                      </button>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {team.members.map((member, idx) => (
                        <Draggable key={member} draggableId={`${team.id}-${member}`} index={idx}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded flex justify-between items-center shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                              <span>{member}</span>
                              <button
                                onClick={() => removeMember(team.id, member)}
                                className="text-red-400 hover:text-red-600 text-sm"
                              >
                                ✕
                              </button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newMembers[team.id] || ''}
                        onChange={(e) => updateNewMember(team.id, e.target.value)}
                        placeholder="新メンバー名"
                        className="flex-1 px-3 py-1.5 text-sm border rounded focus:outline-blue-400"
                      />
                      <button
                        onClick={() => addMember(team.id)}
                        className="bg-blue-500 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-600"
                      >
                        追加
                      </button>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}

export default App