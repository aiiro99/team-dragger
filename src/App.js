import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Player } from '@lottiefiles/react-lottie-player';
import { toast, Toaster } from 'react-hot-toast';
import teamAnimation from './assets/team-animation.json';
const defaultAvatar = '/avatar.png';
const defaultTeams = [
    { id: 'team-a', name: 'Team A', members: ['Alice', 'Bob'] },
    { id: 'team-b', name: 'Team B', members: ['Charlie', 'Dave'] },
];
const STORAGE_KEY = 'team-dragger-data';
const colorClasses = [
    'border-blue-400',
    'border-green-400',
    'border-pink-400',
    'border-yellow-400',
    'border-purple-400',
];
function App() {
    const [teams, setTeams] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : defaultTeams;
    });
    const [newMembers, setNewMembers] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [dragCount, setDragCount] = useState(0);
    const [saveFlag, setSaveFlag] = useState(false);
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
        toast.success('保存しました！');
        setSaveFlag(true);
        setTimeout(() => setSaveFlag(false), 2000);
    }, [teams]);
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination)
            return;
        const sourceIndex = teams.findIndex(t => t.id === source.droppableId);
        const destIndex = teams.findIndex(t => t.id === destination.droppableId);
        const sourceTeam = { ...teams[sourceIndex] };
        const destTeam = { ...teams[destIndex] };
        const [moved] = sourceTeam.members.splice(source.index, 1);
        destTeam.members.splice(destination.index, 0, moved);
        const updated = [...teams];
        updated[sourceIndex] = sourceTeam;
        updated[destIndex] = destTeam;
        setTeams(updated);
        setDragCount(d => d + 1);
    };
    const addTeam = () => {
        const id = `team-${Date.now()}`;
        const newTeam = { id, name: '新しいチーム', members: [] };
        setTeams([...teams, newTeam]);
    };
    const deleteTeam = (id) => {
        if (teams.length <= 1)
            return alert('最低1チームは必要です');
        setTeams(teams.filter(t => t.id !== id));
    };
    const updateTeamName = (id, name) => {
        setTeams(teams.map(t => (t.id === id ? { ...t, name } : t)));
    };
    const updateNewMember = (id, name) => {
        setNewMembers({ ...newMembers, [id]: name });
    };
    const addMember = (id) => {
        const name = newMembers[id]?.trim();
        if (!name)
            return;
        setTeams(teams.map(t => (t.id === id ? { ...t, members: [...t.members, name] } : t)));
        setNewMembers({ ...newMembers, [id]: '' });
    };
    const removeMember = (teamId, member) => {
        setTeams(teams.map(t => t.id === teamId ? { ...t, members: t.members.filter(m => m !== member) } : t));
    };
    const exportTeams = () => {
        const blob = new Blob([JSON.stringify(teams, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'teams.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    const importTeams = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                if (Array.isArray(data) && data.every(t => t.id && t.name && Array.isArray(t.members))) {
                    setTeams(data);
                    toast.success('インポート完了！');
                }
                else {
                    toast.error('形式が不正です');
                }
            }
            catch {
                toast.error('JSON 読み込みエラー');
            }
        };
        reader.readAsText(file);
    };
    return (_jsxs("div", { className: "min-h-screen font-sans bg-gradient-to-br from-sky-50 to-slate-200 text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 transition-all", children: [_jsx(Toaster, {}), saveFlag && (_jsx("div", { className: "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition z-50", children: "\u2714\uFE0F \u4FDD\u5B58\u3057\u307E\u3057\u305F\uFF01" })), _jsx("div", { className: "flex justify-end mb-4 px-4", children: _jsx("button", { onClick: () => setIsDarkMode(!isDarkMode), className: "px-4 py-2 text-sm rounded bg-gray-800 text-white dark:bg-white dark:text-black shadow hover:opacity-80 transition", children: isDarkMode ? '☀️ ライトモードへ' : '🌙 ダークモードへ' }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-3xl sm:text-4xl font-extrabold text-center mb-6", children: "\u30C1\u30FC\u30E0\u30C9\u30E9\u30C3\u30B0\u30A2\u30D7\u30EA" }), _jsxs("div", { className: "flex flex-wrap justify-center gap-3 sm:gap-6 mb-6", children: [_jsx("button", { onClick: addTeam, className: "btn-green", children: "\uFF0B \u30C1\u30FC\u30E0\u8FFD\u52A0" }), _jsx("button", { onClick: () => alert(JSON.stringify(teams, null, 2)), className: "btn-blue", children: "\u72B6\u614B\u3092\u8868\u793A" }), _jsx("button", { onClick: exportTeams, className: "btn-indigo", children: "\uD83D\uDCE4 \u30A8\u30AF\u30B9\u30DD\u30FC\u30C8" }), _jsxs("label", { className: "btn-purple cursor-pointer", children: ["\uD83D\uDCE5 \u30A4\u30F3\u30DD\u30FC\u30C8", _jsx("input", { type: "file", accept: ".json", onChange: importTeams, className: "hidden" })] })] }), _jsxs("p", { className: "text-center text-sm text-gray-600 dark:text-gray-300 mt-2", children: ["\u30C9\u30E9\u30C3\u30B0\u56DE\u6570: ", dragCount, " \u56DE"] }), _jsx(Player, { id: "team-lottie", autoplay: true, keepLastFrame: true, src: teamAnimation, style: { height: '100px', width: '100px', margin: '0 auto' } }), _jsx(DragDropContext, { onDragEnd: onDragEnd, children: _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8", children: teams.map((team, index) => (_jsx(Droppable, { droppableId: team.id, children: (provided) => (_jsxs("div", { ref: provided.innerRef, ...provided.droppableProps, className: `bg-white dark:bg-gray-800 border-4 ${colorClasses[index % colorClasses.length]} rounded-lg p-5 shadow-md hover:shadow-lg transition`, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("img", { src: "/avatar.png", alt: "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u753B\u50CF", className: "w-24 h-24 rounded-full shadow-lg mx-auto mb-4" }), _jsxs("div", { className: "flex items-center gap-2 w-full", children: [_jsx("img", { src: defaultAvatar, alt: "avatar", className: "w-7 h-7 rounded-full border" }), _jsx("input", { value: team.name, onChange: (e) => updateTeamName(team.id, e.target.value), className: "w-full bg-transparent text-lg font-semibold border-b border-gray-300 focus:outline-none dark:border-gray-600" }), _jsxs("span", { className: "ml-2 text-sm text-gray-500 dark:text-gray-400", children: ["(", team.members.length, "\u4EBA)"] })] }), _jsx("button", { onClick: () => deleteTeam(team.id), className: "text-red-500 text-xs hover:underline", children: "\u2715" })] }), _jsxs("ul", { className: "space-y-2 mb-4", children: [team.members.map((member, idx) => (_jsx(Draggable, { draggableId: `${team.id}-${member}`, index: idx, children: (provided) => (_jsxs("li", { ref: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps, className: "bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded flex justify-between items-center shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition", children: [_jsx("span", { children: member }), _jsx("button", { onClick: () => removeMember(team.id, member), className: "text-red-400 hover:text-red-600 text-sm", children: "\u2715" })] })) }, member))), provided.placeholder] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [_jsx("input", { type: "text", value: newMembers[team.id] || '', onChange: (e) => updateNewMember(team.id, e.target.value), placeholder: "\u65B0\u30E1\u30F3\u30D0\u30FC\u540D", className: "flex-1 px-3 py-1.5 text-sm border rounded focus:outline-blue-400" }), _jsx("button", { onClick: () => addMember(team.id), className: "bg-blue-500 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-600", children: "\u8FFD\u52A0" })] })] })) }, team.id))) }) })] })] }));
}
export default App;
