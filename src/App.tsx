import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import CircularCalendar from './components/CircularCalendar'
import GameStats from './components/GameStats'
import './App.css'

interface Task {
  id: string
  title: string
  description: string
  date: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  x?: number
  y?: number
  isDragging?: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [currentTheme, setCurrentTheme] = useState('cosmic')
  const [showStats, setShowStats] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: 'personal'
  })

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('react-todo-calendar-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('react-todo-calendar-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
    setEditingTask(null)
    setFormData({ title: '', description: '', priority: 'medium', category: 'personal' })
    setShowModal(true)
  }

  const handleEventClick = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category
    })
    setSelectedDate(task.date)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...formData, date: selectedDate }
          : task
      ))
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        date: selectedDate,
        completed: false
      }
      setTasks([...tasks, newTask])
    }
    
    setShowModal(false)
    setFormData({ title: '', description: '', priority: 'medium', category: 'personal' })
  }

  const handleDelete = () => {
    if (editingTask) {
      setTasks(tasks.filter(task => task.id !== editingTask.id))
      setShowModal(false)
    }
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'cosmic':
        return 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
      case 'sunset':
        return 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600'
      case 'forest':
        return 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-600'
      default:
        return 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
    }
  }

  return (
    <div className={`min-h-screen ${getThemeClasses()} p-4 relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
            ✨ Cosmic Todo Universe ✨
          </h1>
          <p className="text-white/80 text-lg">Navigate your tasks through space and time</p>
          
          {/* Theme Switcher */}
          <div className="flex justify-center gap-2 mt-4">
            {['cosmic', 'sunset', 'forest'].map(theme => (
              <button
                key={theme}
                onClick={() => setCurrentTheme(theme)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentTheme === theme 
                    ? 'bg-white/20 text-white border-2 border-white/40' 
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <CircularCalendar
                tasks={tasks}
                onDateClick={handleDateClick}
                onTaskClick={handleEventClick}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Toggle */}
            <button
              onClick={() => setShowStats(!showStats)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              {showStats ? '📊 Hide Stats' : '🎮 Show Stats'}
            </button>

            {/* Game Stats */}
            {showStats && (
              <GameStats tasks={tasks} />
            )}

            {/* Quick Add */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">⚡ Quick Add</h3>
              <button
                onClick={() => {
                  setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
                  setEditingTask(null)
                  setFormData({ title: '', description: '', priority: 'medium', category: 'personal' })
                  setShowModal(true)
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                + Add Task for Today
              </button>
            </div>

            {/* Task Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">📈 Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-white/80">
                  <span>Total Tasks:</span>
                  <span className="font-semibold">{tasks.length}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Completed:</span>
                  <span className="font-semibold text-green-400">{tasks.filter(t => t.completed).length}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Pending:</span>
                  <span className="font-semibold text-yellow-400">{tasks.filter(t => !t.completed).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Task Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-8 border border-white/20 animate-fade-in-scale">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{editingTask ? '✏️' : '✨'}</div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingTask ? 'Edit Your Task' : 'Create New Task'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ✍️ Task Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="What needs to be done?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📝 Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    rows={3}
                    placeholder="Add more details..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🎯 Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📂 Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="personal">👤 Personal</option>
                      <option value="work">💼 Work</option>
                      <option value="health">🏃 Health</option>
                      <option value="shopping">🛒 Shopping</option>
                      <option value="other">📝 Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📅 Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {editingTask && (
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTask.completed}
                        onChange={() => toggleTaskCompletion(editingTask.id)}
                        className="w-5 h-5 text-green-500 rounded focus:ring-green-400 mr-3"
                      />
                      <span className="text-gray-700 font-medium">
                        ✅ Mark as completed
                      </span>
                    </label>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
                  >
                    {editingTask ? '💾 Update Task' : '✨ Create Task'}
                  </button>
                  
                  {editingTask && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
                    >
                      🗑️
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-400 transition-colors duration-200"
                  >
                    ❌
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
