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
    <div className={`min-h-screen ${getThemeClasses()} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 md:w-48 md:h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="flex-shrink-0 px-4 py-6 text-center">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
            ✨ Cosmic Todo ✨
          </h1>
          <p className="text-white/80 text-sm md:text-base">Navigate your tasks through space and time</p>
          
          {/* Theme Switcher - Horizontal scroll on mobile */}
          <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
            {['cosmic', 'sunset', 'forest'].map(theme => (
              <button
                key={theme}
                onClick={() => setCurrentTheme(theme)}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  currentTheme === theme 
                    ? 'bg-white/20 text-white border-2 border-white/40' 
                    : 'bg-white/10 text-white/70 active:bg-white/15'
                }`}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-24">
            {/* Calendar Section */}
            <div className="mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl">
                <CircularCalendar
                  tasks={tasks}
                  onDateClick={handleDateClick}
                  onTaskClick={handleEventClick}
                />
              </div>
            </div>

            {/* Mobile Stats Card */}
            <div className="mb-6">
              <button
                onClick={() => setShowStats(!showStats)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-semibold active:scale-95 transition-transform duration-200 shadow-lg text-lg"
              >
                {showStats ? '📊 Hide Stats' : '🎮 Show Stats'}
              </button>

              {showStats && (
                <div className="mt-4">
                  <GameStats tasks={tasks} />
                </div>
              )}
            </div>

            {/* Task Summary Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">📈 Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{tasks.length}</div>
                  <div className="text-white/70 text-sm">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{tasks.filter(t => t.completed).length}</div>
                  <div className="text-white/70 text-sm">Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{tasks.filter(t => !t.completed).length}</div>
                  <div className="text-white/70 text-sm">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Button */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={() => {
              setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
              setEditingTask(null)
              setFormData({ title: '', description: '', priority: 'medium', category: 'personal' })
              setShowModal(true)
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-full shadow-2xl active:scale-90 transition-transform duration-200 border-4 border-white/20"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Mobile-Optimized Bottom Sheet Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
            {/* Mobile Bottom Sheet */}
            <div className="md:hidden w-full bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl border-t border-white/20 animate-slide-up max-h-[90vh] overflow-y-auto">
              {/* Handle Bar */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
              </div>
              
              <div className="px-6 pb-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">{editingTask ? '✏️' : '✨'}</div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingTask ? 'Edit Task' : 'New Task'}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    {selectedDate && format(new Date(selectedDate), 'MMMM d, yyyy')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                      placeholder="What needs to be done?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Add details..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="personal">👤 Personal</option>
                        <option value="work">💼 Work</option>
                        <option value="health">🏃 Health</option>
                        <option value="shopping">🛒 Shopping</option>
                        <option value="other">📝 Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 rounded-xl font-semibold active:scale-95 transition-transform duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold active:scale-95 transition-transform duration-200 shadow-lg"
                    >
                      {editingTask ? 'Update' : 'Create'} Task
                    </button>
                  </div>

                  {editingTask && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full px-6 py-3 bg-red-500 text-white rounded-xl font-semibold active:scale-95 transition-transform duration-200 mt-3"
                    >
                      🗑️ Delete Task
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Desktop Modal */}
            <div className="hidden md:block bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-8 border border-white/20 animate-fade-in-scale mx-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{editingTask ? '✏️' : '✨'}</div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingTask ? 'Edit Your Task' : 'Create New Task'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {selectedDate && format(new Date(selectedDate), 'MMMM d, yyyy')}
                </p>
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
