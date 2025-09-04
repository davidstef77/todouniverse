import { useState } from 'react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'

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

interface CircularCalendarProps {
  tasks: Task[]
  onDateClick: (date: string) => void
  onTaskClick: (task: Task) => void
}

export default function CircularCalendar({ tasks, onDateClick, onTaskClick }: CircularCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return tasks.filter(task => task.date === dateStr)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="relative">
      {/* Week Navigation - Mobile Optimized */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          className="p-3 rounded-full bg-white/20 active:bg-white/30 text-white transition-colors touch-manipulation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-white text-center">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
        </h2>
        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          className="p-3 rounded-full bg-white/20 active:bg-white/30 text-white transition-colors touch-manipulation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile-First Calendar Layout */}
      <div className="block md:hidden">
        {/* Mobile Week View - Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-4 px-2">
          {weekDays.map((date, index) => {
            const tasksForDate = getTasksForDate(date)
            const isToday = isSameDay(date, new Date())

            return (
              <div
                key={index}
                onClick={() => onDateClick(format(date, 'yyyy-MM-dd'))}
                className={`flex-shrink-0 w-20 h-24 rounded-2xl p-3 cursor-pointer transition-all duration-200 active:scale-95 ${
                  isToday 
                    ? 'bg-white/30 border-2 border-white/60' 
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                <div className="text-center">
                  <div className="text-white/70 text-xs font-medium mb-1">
                    {format(date, 'EEE')}
                  </div>
                  <div className="text-white text-lg font-bold mb-2">
                    {format(date, 'd')}
                  </div>
                  
                  {/* Task indicators */}
                  <div className="flex justify-center gap-1">
                    {tasksForDate.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskClick(task)
                        }}
                        className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} ${
                          task.completed ? 'opacity-50' : ''
                        }`}
                      />
                    ))}
                    {tasksForDate.length > 3 && (
                      <div className="text-white/70 text-xs">+{tasksForDate.length - 3}</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Today's Tasks - Mobile */}
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-3 px-2">Today's Tasks</h3>
          <div className="space-y-2 px-2">
            {getTasksForDate(new Date()).map((task) => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`p-4 rounded-xl bg-white/10 border border-white/20 cursor-pointer active:scale-98 transition-all duration-200 ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                    <span className={`text-white ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="text-white/60 text-sm">
                    {task.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Circular Calendar */}
      <div className="hidden md:block">
        <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Outer circle */}
            <circle
              cx="200"
              cy="200"
              r="180"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            
            {/* Inner circle */}
            <circle
              cx="200"
              cy="200"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />

            {/* Days of week */}
            {weekDays.map((date, index) => {
              const angle = (index * 360) / 7 - 90 // Start from top
              const radian = (angle * Math.PI) / 180
              const x = 200 + 150 * Math.cos(radian)
              const y = 200 + 150 * Math.sin(radian)
              const tasksForDate = getTasksForDate(date)
              const isToday = isSameDay(date, new Date())

              return (
                <g key={index}>
                  {/* Day circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r="35"
                    fill={isToday ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
                    stroke={isToday ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"}
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-white/20 transition-all duration-200"
                    onClick={() => onDateClick(format(date, 'yyyy-MM-dd'))}
                  />
                  
                  {/* Day number */}
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    className="fill-white text-sm font-medium pointer-events-none"
                  >
                    {format(date, 'd')}
                  </text>

                  {/* Task bubbles */}
                  {tasksForDate.slice(0, 3).map((task, taskIndex) => {
                    const taskAngle = angle + (taskIndex - 1) * 15
                    const taskRadian = (taskAngle * Math.PI) / 180
                    const taskX = x + 50 * Math.cos(taskRadian)
                    const taskY = y + 50 * Math.sin(taskRadian)

                    return (
                      <circle
                        key={task.id}
                        cx={taskX}
                        cy={taskY}
                        r="10"
                        className={`${getPriorityColor(task.priority)} cursor-pointer hover:scale-125 transition-transform duration-200 ${
                          task.completed ? 'opacity-50' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskClick(task)
                        }}
                      />
                    )
                  })}

                  {/* More tasks indicator */}
                  {tasksForDate.length > 3 && (
                    <text
                      x={x}
                      y={y - 25}
                      textAnchor="middle"
                      className="fill-white text-xs pointer-events-none"
                    >
                      +{tasksForDate.length - 3}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Center decoration */}
            <circle
              cx="200"
              cy="200"
              r="40"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            <text
              x="200"
              y="205"
              textAnchor="middle"
              className="fill-white text-lg font-bold pointer-events-none"
            >
              ✨
            </text>
          </svg>
        </div>

        {/* Day names */}
        <div className="flex justify-center mt-4 space-x-8">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <span key={index} className="text-white/70 text-sm font-medium">
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
