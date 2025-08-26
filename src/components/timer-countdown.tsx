'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Timer, Play, Pause, Square, RotateCcw, Clock, Plus, Minus, Bell } from 'lucide-react'

interface LapTime {
  id: number
  time: string
  total: number
}

interface PresetTimer {
  name: string
  seconds: number
  color: string
}

interface CountdownPreset {
  name: string
  seconds: number
  description: string
}

const presetTimers: PresetTimer[] = [
  { name: '1 Minute', seconds: 60, color: 'bg-blue-500' },
  { name: '5 Minutes', seconds: 300, color: 'bg-green-500' },
  { name: '10 Minutes', seconds: 600, color: 'bg-yellow-500' },
  { name: '15 Minutes', seconds: 900, color: 'bg-orange-500' },
  { name: '30 Minutes', seconds: 1800, color: 'bg-red-500' },
  { name: '1 Hour', seconds: 3600, color: 'bg-purple-500' }
]

const countdownPresets: CountdownPreset[] = [
  { name: 'Quick Break', seconds: 300, description: '5-minute break' },
  { name: 'Pomodoro', seconds: 1500, description: '25-minute work session' },
  { name: 'Short Break', seconds: 600, description: '10-minute break' },
  { name: 'Long Break', seconds: 1800, description: '30-minute break' },
  { name: 'Meeting', seconds: 3600, description: '1-hour meeting' },
  { name: 'Workout', seconds: 2700, description: '45-minute workout' },
  { name: 'Meditation', seconds: 900, description: '15-minute meditation' },
  { name: 'Cooking', seconds: 1200, description: '20-minute cooking timer' }
]

export function TimerCountdown() {
  const [activeTab, setActiveTab] = useState('stopwatch')
  
  // Stopwatch State (uses worker interval ticks)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const stopwatchWorkerRef = useRef<Worker | null>(null)
  const [lapTimes, setLapTimes] = useState<LapTime[]>([])
  const [lapCounter, setLapCounter] = useState(0)
  
  // Countdown State (uses worker countdown)
  const [countdownTime, setCountdownTime] = useState(0)
  const [countdownRunning, setCountdownRunning] = useState(false)
  const countdownWorkerRef = useRef<Worker | null>(null)
  const [countdownInput, setCountdownInput] = useState('300') // 5 minutes default
  const [countdownCompleted, setCountdownCompleted] = useState(false)
  const [customHours, setCustomHours] = useState('0')
  const [customMinutes, setCustomMinutes] = useState('5')
  const [customSeconds, setCustomSeconds] = useState('0')
  
  // Timer State (simple 1s tick via worker)
  const [timerHours, setTimerHours] = useState('0')
  const [timerMinutes, setTimerMinutes] = useState('0')
  const [timerSeconds, setTimerSeconds] = useState('0')
  const [timerRunning, setTimerRunning] = useState(false)
  const timerWorkerRef = useRef<Worker | null>(null)
  const [timerTimeLeft, setTimerTimeLeft] = useState(0)
  const [timerCompleted, setTimerCompleted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const shareUrlRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    // Initialize audio for alarm sound
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio()
    }

    // Create workers lazily when needed
    return () => {
      stopwatchWorkerRef.current?.terminate()
      countdownWorkerRef.current?.terminate()
      timerWorkerRef.current?.terminate()
    }
  }, [])

  // Persist and restore state
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem('timers-state')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        if (s.stopwatchTime) setStopwatchTime(s.stopwatchTime)
        if (s.countdownTime) setCountdownTime(s.countdownTime)
        if (s.timerTimeLeft) setTimerTimeLeft(s.timerTimeLeft)
        if (s.activeTab) setActiveTab(s.activeTab)
        if (s.countdownInput) setCountdownInput(s.countdownInput)
        if (s.timerHours) setTimerHours(s.timerHours)
        if (s.timerMinutes) setTimerMinutes(s.timerMinutes)
        if (s.timerSeconds) setTimerSeconds(s.timerSeconds)
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const s = {
      activeTab,
      stopwatchTime,
      countdownTime,
      countdownInput,
      timerHours,
      timerMinutes,
      timerSeconds,
      timerTimeLeft,
    }
    window.localStorage.setItem('timers-state', JSON.stringify(s))
  }, [activeTab, stopwatchTime, countdownTime, countdownInput, timerHours, timerMinutes, timerSeconds, timerTimeLeft])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeWithMs = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    const ms = Math.floor((seconds % 1) * 100)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const playAlarm = () => {
    // Create a simple beep sound using Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1)
    }
    
    // Show browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: 'Your timer has finished.',
        icon: '/favicon.ico'
      })
    }
  }

  // Stopwatch Functions
  const startStopwatch = () => {
    if (stopwatchRunning) return
    if (!stopwatchWorkerRef.current) {
      stopwatchWorkerRef.current = new Worker('/timer-worker.js')
      let start = performance.now() - stopwatchTime * 1000
      stopwatchWorkerRef.current.onmessage = (e: MessageEvent) => {
        const msg = e.data
        if (msg.type === 'tick') {
          const now = performance.now()
          setStopwatchTime((now - start) / 1000)
        }
      }
    }
    stopwatchWorkerRef.current.postMessage({ type: 'start', id: 'sw', mode: 'interval', intervalMs: 10 })
    setStopwatchRunning(true)
  }

  const pauseStopwatch = () => {
    stopwatchWorkerRef.current?.postMessage({ type: 'pause', id: 'sw' })
    setStopwatchRunning(false)
  }

  const resetStopwatch = () => {
    stopwatchWorkerRef.current?.postMessage({ type: 'reset', id: 'sw' })
    setStopwatchTime(0)
    setStopwatchRunning(false)
    setLapTimes([])
    setLapCounter(0)
  }

  const addLap = () => {
    if (stopwatchRunning) {
      const newLap: LapTime = {
        id: lapCounter + 1,
        time: formatTimeWithMs(stopwatchTime),
        total: stopwatchTime
      }
      setLapTimes([newLap, ...lapTimes])
      setLapCounter(lapCounter + 1)
    }
  }

  // Countdown Functions
  const startCountdown = () => {
    const time = parseInt(countdownInput)
    if (time > 0 && !countdownRunning) {
      setCountdownTime(time)
      setCountdownRunning(true)
      setCountdownCompleted(false)
      if (!countdownWorkerRef.current) {
        countdownWorkerRef.current = new Worker('/timer-worker.js')
        countdownWorkerRef.current.onmessage = (e: MessageEvent) => {
          const msg = e.data
          if (msg.type === 'remaining') {
            setCountdownTime(Math.ceil(msg.remainingMs / 1000))
          }
          if (msg.type === 'done') {
            setCountdownRunning(false)
            setCountdownCompleted(true)
            playAlarm()
          }
        }
      }
      countdownWorkerRef.current.postMessage({ type: 'start', id: 'cd', mode: 'countdown', durationMs: time * 1000 })
    }
  }

  const pauseCountdown = () => {
    countdownWorkerRef.current?.postMessage({ type: 'pause', id: 'cd' })
    setCountdownRunning(false)
  }

  const resetCountdown = () => {
    countdownWorkerRef.current?.postMessage({ type: 'reset', id: 'cd' })
    setCountdownTime(0)
    setCountdownRunning(false)
    setCountdownCompleted(false)
  }

  const setCountdownFromPreset = (seconds: number) => {
    setCountdownInput(seconds.toString())
    if (countdownRunning) {
      pauseCountdown()
    }
    setCountdownTime(seconds)
  }

  // Timer Functions
  const setTimerFromCustom = () => {
    const hours = parseInt(timerHours) || 0
    const minutes = parseInt(timerMinutes) || 0
    const seconds = parseInt(timerSeconds) || 0
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    
    if (totalSeconds > 0) {
      setTimerTimeLeft(totalSeconds)
      setTimerCompleted(false)
    }
  }

  const startTimer = () => {
    if (timerTimeLeft > 0 && !timerRunning) {
      setTimerRunning(true)
      setTimerCompleted(false)
      if (!timerWorkerRef.current) {
        timerWorkerRef.current = new Worker('/timer-worker.js')
        timerWorkerRef.current.onmessage = (e: MessageEvent) => {
          const msg = e.data
          if (msg.type === 'tick') {
            setTimerTimeLeft(prev => {
              if (prev <= 1) {
                setTimerRunning(false)
                setTimerCompleted(true)
                playAlarm()
                return 0
              }
              return prev - 1
            })
          }
        }
      }
      timerWorkerRef.current.postMessage({ type: 'start', id: 'tm', mode: 'interval', intervalMs: 1000 })
    }
  }

  const pauseTimer = () => {
    timerWorkerRef.current?.postMessage({ type: 'pause', id: 'tm' })
    setTimerRunning(false)
  }

  const resetTimer = () => {
    timerWorkerRef.current?.postMessage({ type: 'reset', id: 'tm' })
    setTimerRunning(false)
    setTimerCompleted(false)
    setTimerTimeLeft(0)
    setTimerHours('0')
    setTimerMinutes('0')
    setTimerSeconds('0')
  }

  // Request notification permission
  const requestNotificationPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // Initialize from permalink
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const cd = params.get('cd')
    if (cd && !isNaN(Number(cd))) {
      setActiveTab('countdown')
      setCountdownInput(String(Math.max(1, Number(cd))))
      setCountdownTime(Math.max(1, Number(cd)))
    }
  }, [])

  const shareCountdown = () => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.searchParams.set('cd', countdownInput || '0')
    const shareLink = url.toString()
    navigator.clipboard?.writeText(shareLink)
  }

  return (
    <div className="space-y-6">
      {/* Timer Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Timer & Countdown Tools
          </CardTitle>
          <CardDescription>
            Professional timing tools with alarm functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
              <TabsTrigger value="countdown">Countdown</TabsTrigger>
              <TabsTrigger value="timer">Timer</TabsTrigger>
            </TabsList>

            {/* Stopwatch */}
            <TabsContent value="stopwatch" className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-mono font-bold mb-6">
                  {formatTimeWithMs(stopwatchTime)}
                </div>
                
                <div className="flex gap-3 justify-center mb-6">
                  <Button
                    onClick={stopwatchRunning ? pauseStopwatch : startStopwatch}
                    size="lg"
                    className={stopwatchRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}
                  >
                    {stopwatchRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button onClick={addLap} disabled={!stopwatchRunning} size="lg" variant="outline">
                    Lap
                  </Button>
                  <Button onClick={resetStopwatch} size="lg" variant="outline">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {lapTimes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lap Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {lapTimes.map((lap, index) => (
                        <div key={lap.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">Lap {lap.id}</Badge>
                            <span className="font-mono text-sm">{lap.time}</span>
                          </div>
                          {index === 0 && lapTimes.length > 1 && (
                            <Badge variant="secondary">Current</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Countdown */}
            <TabsContent value="countdown" className="space-y-4">
              <div className="text-center">
                <div className={`text-6xl font-mono font-bold mb-6 ${
                  countdownTime < 10 && countdownRunning ? 'text-red-600' : ''
                }`}>
                  {formatTime(Math.ceil(countdownTime))}
                </div>
                
                <div className="flex gap-3 justify-center mb-6">
                  <Button
                    onClick={countdownRunning ? pauseCountdown : startCountdown}
                    size="lg"
                    disabled={parseInt(countdownInput) <= 0}
                    className={countdownRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}
                  >
                    {countdownRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button onClick={resetCountdown} size="lg" variant="outline">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button onClick={shareCountdown} size="lg" variant="outline">
                    Share
                  </Button>
                </div>
              </div>

              {!countdownRunning && countdownTime === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quick Presets</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {presetTimers.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          size="sm"
                          onClick={() => setCountdownFromPreset(preset.seconds)}
                          className="justify-start"
                        >
                          <div className={`w-3 h-3 rounded-full ${preset.color} mr-2`}></div>
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Custom Time (seconds)</label>
                    <Input
                      type="number"
                      value={countdownInput}
                      onChange={(e) => setCountdownInput(e.target.value)}
                      min="1"
                      placeholder="Enter seconds"
                    />
                  </div>
                </div>
              )}

              {countdownCompleted && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Bell className="h-6 w-6 text-red-600" />
                      <span className="text-lg font-semibold text-red-800">Time's Up!</span>
                    </div>
                    <p className="text-red-700">Your countdown has completed.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Timer */}
            <TabsContent value="timer" className="space-y-4">
              <div className="text-center">
                <div className={`text-6xl font-mono font-bold mb-6 ${
                  timerTimeLeft < 10 && timerRunning ? 'text-red-600' : ''
                }`}>
                  {formatTime(timerTimeLeft)}
                </div>
                
                <div className="flex gap-3 justify-center mb-6">
                  <Button
                    onClick={timerRunning ? pauseTimer : startTimer}
                    size="lg"
                    disabled={timerTimeLeft <= 0}
                    className={timerRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}
                  >
                    {timerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button onClick={resetTimer} size="lg" variant="outline">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {!timerRunning && timerTimeLeft === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Popular Timers</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {countdownPresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const hours = Math.floor(preset.seconds / 3600)
                            const minutes = Math.floor((preset.seconds % 3600) / 60)
                            const seconds = preset.seconds % 60
                            setTimerHours(hours.toString())
                            setTimerMinutes(minutes.toString())
                            setTimerSeconds(seconds.toString())
                            setTimerFromCustom()
                          }}
                          className="justify-start h-auto p-3"
                        >
                          <div className="text-left">
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs text-gray-500">{preset.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Custom Timer</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Hours</label>
                        <Input
                          type="number"
                          value={timerHours}
                          onChange={(e) => setTimerHours(e.target.value)}
                          min="0"
                          max="23"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                        <Input
                          type="number"
                          value={timerMinutes}
                          onChange={(e) => setTimerMinutes(e.target.value)}
                          min="0"
                          max="59"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Seconds</label>
                        <Input
                          type="number"
                          value={timerSeconds}
                          onChange={(e) => setTimerSeconds(e.target.value)}
                          min="0"
                          max="59"
                        />
                      </div>
                    </div>
                    <Button onClick={setTimerFromCustom} className="w-full mt-2">
                      Set Timer
                    </Button>
                  </div>
                </div>
              )}

              {timerCompleted && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Bell className="h-6 w-6 text-red-600" />
                      <span className="text-lg font-semibold text-red-800">Timer Complete!</span>
                    </div>
                    <p className="text-red-700">Your timer has finished.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Timer Features */}
      <Card>
        <CardHeader>
          <CardTitle>Timer Features</CardTitle>
          <CardDescription>
            Advanced features and settings for all timing tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Bell className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Audio Alerts</h3>
              <p className="text-sm text-gray-600">Built-in alarm sounds when timers complete</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Precise Timing</h3>
              <p className="text-sm text-gray-600">Millisecond accuracy for stopwatch and timers</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Bell className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Notifications</h3>
              <p className="text-sm text-gray-600">Browser notifications when timers complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Description */}
      <Card>
        <CardHeader>
          <CardTitle>About Timers, Stopwatches, and Countdowns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-gray-800">
            <p>
              Use our professional timing tools for productivity, sports, and events. Timers and countdowns run reliably in the background via Web Workers, and alarm sounds ensure you never miss an end time.
            </p>
            <h3>How to use the Countdown</h3>
            <ol>
              <li>Choose a preset or enter a custom duration in seconds.</li>
              <li>Press Start to begin; Pause or Reset at any time.</li>
              <li>Use Share to copy a permalink that pre-fills the countdown on load.</li>
            </ol>
            <h3>Stopwatch laps and exports</h3>
            <p>
              Track multiple laps with millisecond precision. Copy results to share with teammates and participants.
            </p>
            <h3>Accuracy and reliability</h3>
            <p>
              Timing uses performance.now() in a Web Worker for accuracy across background tabs and visibility changes. Audio alerts and optional browser notifications provide clear end-of-timer signals.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}