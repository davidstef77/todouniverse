import { useState, useEffect } from 'react'

interface Task {
  id: string
  date: string
  completed: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

interface GameStatsProps {
  tasks: Task[]
}

export default function GameStats({ tasks }: GameStatsProps) {
  const [streak, setStreak] = useState(0)
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first-task', title: 'Getting Started', description: 'Complete your first task', icon: '🎯', unlocked: false },
    { id: 'streak-3', title: 'On Fire', description: 'Complete tasks for 3 days in a row', icon: '🔥', unlocked: false },
    { id: 'streak-7', title: 'Week Warrior', description: 'Complete tasks for 7 days in a row', icon: '⚡', unlocked: false },
    { id: 'tasks-10', title: 'Productive', description: 'Complete 10 tasks total', icon: '💪', unlocked: false },
    { id: 'tasks-50', title: 'Task Master', description: 'Complete 50 tasks total', icon: '👑', unlocked: false },
  ])

  useEffect(() => {
    const completedTasks = tasks.filter(task => task.completed)
    setTotalCompleted(completedTasks.length)

    // Calculate streak
    const today = new Date()
    let currentStreak = 0
    let checkDate = new Date(today)
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasCompletedTask = completedTasks.some(task => task.date === dateStr)
      
      if (hasCompletedTask) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    
    setStreak(currentStreak)

    // Update achievements
    setAchievements(prev => prev.map(achievement => {
      let shouldUnlock = false
      
      switch (achievement.id) {
        case 'first-task':
          shouldUnlock = completedTasks.length >= 1
          break
        case 'streak-3':
          shouldUnlock = currentStreak >= 3
          break
        case 'streak-7':
          shouldUnlock = currentStreak >= 7
          break
        case 'tasks-10':
          shouldUnlock = completedTasks.length >= 10
          break
        case 'tasks-50':
          shouldUnlock = completedTasks.length >= 50
          break
      }
      
      return { ...achievement, unlocked: shouldUnlock }
    }))
  }, [tasks])

  const getStreakColor = () => {
    if (streak >= 7) return 'from-purple-500 to-pink-500'
    if (streak >= 3) return 'from-orange-500 to-red-500'
    if (streak >= 1) return 'from-yellow-500 to-orange-500'
    return 'from-gray-400 to-gray-500'
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">🎮 Your Progress</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Streak Counter */}
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <div className={`text-3xl font-bold bg-gradient-to-r ${getStreakColor()} bg-clip-text text-transparent`}>
              {streak}
            </div>
            <div className="text-white/80 text-sm">Day Streak</div>
            {streak > 0 && <div className="text-2xl mt-1">🔥</div>}
          </div>
        </div>

        {/* Total Completed */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{totalCompleted}</div>
            <div className="text-white/80 text-sm">Completed</div>
            <div className="text-2xl mt-1">✅</div>
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeDasharray={`${Math.min((totalCompleted / 10) * 283, 283)} 283`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white font-bold text-sm">{Math.min(Math.round((totalCompleted / 10) * 100), 100)}%</div>
              <div className="text-white/60 text-xs">Level 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white/90 text-center">🏆 Achievements</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`
                flex items-center gap-3 p-2 rounded-lg transition-all duration-300
                ${achievement.unlocked 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                  : 'bg-white/5 border border-white/10'
                }
              `}
            >
              <div className={`text-2xl ${achievement.unlocked ? 'animate-bounce' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm ${achievement.unlocked ? 'text-yellow-300' : 'text-white/60'}`}>
                  {achievement.title}
                </div>
                <div className={`text-xs ${achievement.unlocked ? 'text-yellow-200/80' : 'text-white/40'}`}>
                  {achievement.description}
                </div>
              </div>
              {achievement.unlocked && (
                <div className="text-green-400 text-sm">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
