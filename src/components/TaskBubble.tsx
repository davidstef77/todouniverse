import { useState } from 'react'

interface Task {
  id: string
  title: string
  description: string
  date: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
}

interface TaskBubbleProps {
  task: Task
  onTaskClick: (task: Task) => void
  onTaskComplete: (taskId: string) => void
  style?: React.CSSProperties
}

export default function TaskBubble({ task, onTaskClick, onTaskComplete, style }: TaskBubbleProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-400 via-red-500 to-red-600'
      case 'medium': return 'from-yellow-400 via-orange-400 to-orange-500'
      case 'low': return 'from-green-400 via-emerald-400 to-emerald-500'
      default: return 'from-gray-400 via-gray-500 to-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼'
      case 'personal': return '👤'
      case 'health': return '🏃'
      case 'shopping': return '🛒'
      default: return '📝'
    }
  }

  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-300 transform
        ${isHovered ? 'scale-125 z-20' : 'scale-100 z-10'}
        ${task.completed ? 'opacity-60' : 'opacity-100'}
      `}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onTaskClick(task)}
    >
      {/* Main Bubble */}
      <div className={`
        w-12 h-12 rounded-full bg-gradient-to-br ${getPriorityGradient(task.priority)}
        flex items-center justify-center text-white font-bold shadow-lg
        border-2 border-white/20 backdrop-blur-sm
        ${task.completed ? 'grayscale' : ''}
        hover:shadow-xl transition-all duration-300
      `}>
        <span className="text-lg">
          {task.completed ? '✓' : task.title.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Floating Info Card */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-30">
          <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-3 min-w-48 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getCategoryIcon(task.category)}</span>
              <h3 className="font-semibold text-gray-800 text-sm">{task.title}</h3>
            </div>
            
            {task.description && (
              <p className="text-xs text-gray-600 mb-2">{task.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${task.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${task.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
              `}>
                {task.priority}
              </span>
              
              {!task.completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onTaskComplete(task.id)
                  }}
                  className="px-2 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors"
                >
                  ✓ Done
                </button>
              )}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
          </div>
        </div>
      )}

      {/* Completion Animation */}
      {task.completed && (
        <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
      )}

      {/* Priority Pulse */}
      {!task.completed && task.priority === 'high' && (
        <div className="absolute inset-0 rounded-full bg-red-400/30 animate-pulse"></div>
      )}
    </div>
  )
}
