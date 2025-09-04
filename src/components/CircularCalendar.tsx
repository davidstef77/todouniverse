import { useState, useEffect } from 'react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'

interface Task {
  id: string
  title: string
  date: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  x?: number
  y?: number
}

interface CircularCalendarProps {
  tasks: Task[]
  onDateClick: (date: string) => void
  onTaskClick: (task: Task) => void
}

export default function CircularCalendar({ tasks, onDateClick, onTaskClick }: CircularCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  
  const weekStart = startOfWeek(currentWeek)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.date), date))
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-400 to-red-600'
      case 'medium': return 'from-yellow-400 to-orange-500'
      case 'low': return 'from-green-400 to-emerald-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Circular Calendar Layout */}
      <div className="relative w-80 h-80">
        {weekDays.map((date, index) => {
          const angle = (index * 360) / 7 - 90
          const radius = 120
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const y = Math.sin((angle * Math.PI) / 180) * radius
          const dayTasks = getTasksForDate(date)
          
          return (
            <div
              key={date.toISOString()}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
              onClick={() => onDateClick(format(date, 'yyyy-MM-dd'))}
            >
              {/* Date Circle */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {format(date, 'd')}
                </div>
                
                {/* Progress Ring */}
                {dayTasks.length > 0 && (
                  <div className="absolute inset-0 rounded-full border-4 border-transparent">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeDasharray={`${(dayTasks.filter(t => t.completed).length / dayTasks.length) * 175.929} 175.929`}
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Floating Task Bubbles */}
              {dayTasks.map((task, taskIndex) => {
                const bubbleAngle = (taskIndex * 60) - 30
                const bubbleRadius = 35
                const bubbleX = Math.cos((bubbleAngle * Math.PI) / 180) * bubbleRadius
                const bubbleY = Math.sin((bubbleAngle * Math.PI) / 180) * bubbleRadius
                
                return (
                  <div
                    key={task.id}
                    className={`absolute w-8 h-8 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} 
                      flex items-center justify-center text-xs text-white font-medium shadow-md
                      hover:scale-125 transition-all duration-300 cursor-pointer animate-pulse
                      ${task.completed ? 'opacity-50 line-through' : ''}`}
                    style={{
                      left: `calc(50% + ${bubbleX}px)`,
                      top: `calc(50% + ${bubbleY}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTaskClick(task)
                    }}
                    title={task.title}
                  >
                    {task.title.charAt(0).toUpperCase()}
                  </div>
                )
              })}
            </div>
          )
        })}
        
        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white font-bold shadow-xl">
            <div className="text-center">
              <div className="text-xs">Week</div>
              <div className="text-sm">{format(weekStart, 'MMM d')}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Week Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          ← Prev
        </button>
        <button
          onClick={() => setCurrentWeek(new Date())}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          Today
        </button>
        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
