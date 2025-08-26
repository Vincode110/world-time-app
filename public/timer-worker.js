/*
  A simple high-accuracy timer worker using performance.now().
  Messages:
  { type: 'start', id, mode: 'interval'|'timeout', intervalMs?, durationMs? }
  { type: 'pause', id }
  { type: 'reset', id }
*/

const timers = new Map()

function startInterval(id, intervalMs) {
	const state = { id, mode: 'interval', intervalMs, running: true, last: performance.now() }
	timers.set(id, state)
	loop()
}

function startCountdown(id, durationMs) {
	const start = performance.now()
	const state = { id, mode: 'countdown', durationMs, start, running: true, lastEmit: 0 }
	timers.set(id, state)
	loop()
}

function loop() {
	if (self._rafScheduled) return
	self._rafScheduled = true
	setTimeout(tick, 10)
}

function tick() {
	self._rafScheduled = false
	const now = performance.now()
	for (const [id, t] of timers) {
		if (!t.running) continue
		if (t.mode === 'interval') {
			if (now - t.last >= t.intervalMs) {
				t.last = now
				postMessage({ type: 'tick', id, now })
			}
		} else if (t.mode === 'countdown') {
			const elapsed = now - t.start
			const remaining = Math.max(0, t.durationMs - elapsed)
			if (remaining === 0) {
				postMessage({ type: 'done', id })
				t.running = false
				timers.delete(id)
				continue
			}
			if (now - t.lastEmit >= 100) {
				t.lastEmit = now
				postMessage({ type: 'remaining', id, remainingMs: remaining })
			}
		}
	}
	if (timers.size > 0) loop()
}

self.onmessage = (e) => {
	const msg = e.data || {}
	if (msg.type === 'start') {
		if (msg.mode === 'interval') startInterval(msg.id, msg.intervalMs || 1000)
		if (msg.mode === 'countdown') startCountdown(msg.id, msg.durationMs || 0)
	}
	if (msg.type === 'pause') {
		const t = timers.get(msg.id)
		if (t) t.running = false
	}
	if (msg.type === 'reset') {
		timers.delete(msg.id)
	}
}


