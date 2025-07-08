'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSigner, publicClient } from '@/lib/viem'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'

type ObjectType = 'coin' | 'bomb' | 'freeze'

interface FallingObject {
  id: string
  x: number
  y: number
  speed: number
  type: ObjectType
}

interface GameState {
  score: number
  lives: number
  isPlaying: boolean
  isPaused: boolean
  hasStarted: boolean
  objects: FallingObject[]
  freezeActive: boolean
}

const CryptoDodger = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    isPlaying: false,
    isPaused: false,
    hasStarted: false,
    objects: [],
    freezeActive: false,
  })

  const [playerX, setPlayerX] = useState(150)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const gameIdRef = useRef<string | null>(null)
  const playerSize = 40
  const gameWidth = 300
  const gameHeight = 500

  const animationRef = useRef<number>()
  const lastObjectTimeRef = useRef<number>(0)

  const spawnObject = () => {
    const type: ObjectType =
      Math.random() < 0.1 ? 'freeze' : Math.random() < 0.7 ? 'coin' : 'bomb'

    const obj: FallingObject = {
      id: uuidv4(),
      x: Math.random() * (gameWidth - 30),
      y: 0,
      speed: type === 'freeze' ? 2 : 3 + Math.random() * 2,
      type,
    }

    setGameState((prev) => ({
      ...prev,
      objects: [...prev.objects, obj],
    }))
  }

  const handleObjectLogic = () => {
    setGameState((prev) => {
      const newObjects: FallingObject[] = []
      let newLives = prev.lives
      let newScore = prev.score
      let freezeTriggered = false

      for (const obj of prev.objects) {
        const newY = obj.y + (prev.freezeActive ? obj.speed / 2 : obj.speed)

        // Collision detection
        const inXRange =
          obj.x < playerX + playerSize && obj.x + 30 > playerX
        const inYRange = newY + 30 > gameHeight - playerSize

        if (inXRange && inYRange) {
          if (obj.type === 'coin') {
            newScore += 10
            sendTx('coin', newScore)
          } else if (obj.type === 'bomb') {
            newLives = Math.max(0, newLives - 1)
          } else if (obj.type === 'freeze') {
            freezeTriggered = true
          }
        } else if (newY < gameHeight) {
          newObjects.push({ ...obj, y: newY })
        }
      }

      return {
        ...prev,
        score: newScore,
        lives: newLives,
        freezeActive: freezeTriggered ? true : prev.freezeActive,
        objects: newObjects,
      }
    })
  }

  const gameLoop = useCallback(() => {
    const now = Date.now()
    if (now - lastObjectTimeRef.current > 1000) {
      spawnObject()
      lastObjectTimeRef.current = now
    }

    handleObjectLogic()

    if (gameState.lives <= 0) {
      cancelAnimationFrame(animationRef.current!)
      setGameState((prev) => ({ ...prev, isPlaying: false }))
      return
    }

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState.lives])

  const startGame = () => {
    gameIdRef.current = uuidv4()
    setGameState({
      score: 0,
      lives: 3,
      isPlaying: true,
      isPaused: false,
      hasStarted: true,
      objects: [],
      freezeActive: false,
    })
    setPlayerX(gameWidth / 2 - playerSize / 2)
    lastObjectTimeRef.current = Date.now()
    animationRef.current = requestAnimationFrame(gameLoop)
  }

  const resetGame = () => {
    cancelAnimationFrame(animationRef.current!)
    setGameState({
      score: 0,
      lives: 3,
      isPlaying: false,
      isPaused: false,
      hasStarted: false,
      objects: [],
      freezeActive: false,
    })
  }

  const sendTx = async (event: 'coin' | 'bonus', score: number) => {
    try {
      const signer = getSigner()
      const payload = {
        gid: gameIdRef.current ?? crypto.randomUUID(),
        score,
        event,
      }
      const data = ("0x" + Buffer.from(JSON.stringify(payload), "utf8").toString("hex")) as `0x${string}`

      const gas = await publicClient.estimateGas({
        account: signer.account.address,
        to: signer.account.address,
        value: BigInt(0),
        data,
      })

      await signer.sendTransaction({
        account: signer.account,
        to: signer.account.address,
        value: BigInt(0),
        data,
        gas,
      })
    } catch (err) {
      console.error("tx error", err)
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return
      if (e.key === 'ArrowLeft') setPlayerX((x) => Math.max(0, x - 30))
      if (e.key === 'ArrowRight') setPlayerX((x) => Math.min(gameWidth - playerSize, x + 30))
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [gameState.isPlaying])

  useEffect(() => {
    if (gameState.freezeActive) {
      const timeout = setTimeout(() => {
        setGameState((prev) => ({ ...prev, freezeActive: false }))
      }, 4000)
      return () => clearTimeout(timeout)
    }
  }, [gameState.freezeActive])

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-white">Crypto Dodger 🚀</h1>

      <div
        ref={gameAreaRef}
        className="relative bg-gray-800"
        style={{ width: gameWidth, height: gameHeight, overflow: 'hidden' }}
      >
        {/* Player */}
        <div
          className="absolute bg-green-400 rounded"
          style={{
            width: playerSize,
            height: playerSize,
            bottom: 0,
            left: playerX,
            transition: 'left 0.1s linear',
          }}
        />

        {/* Falling objects */}
        {gameState.objects.map((obj) => (
          <div
            key={obj.id}
            className="absolute rounded-full text-center text-xs font-bold text-white flex items-center justify-center"
            style={{
              width: 30,
              height: 30,
              left: obj.x,
              top: obj.y,
              backgroundColor:
                obj.type === 'coin' ? '#FFD700' : obj.type === 'bomb' ? '#ff4444' : '#00FFFF',
            }}
          >
            {obj.type === 'coin' && '🪙'}
            {obj.type === 'bomb' && '💣'}
            {obj.type === 'freeze' && '❄️'}
          </div>
        ))}
      </div>

      <div className="mt-4 text-white flex gap-4 items-center">
        <span>Score: {gameState.score}</span>
        <span>Lives: {gameState.lives}</span>
        {gameState.freezeActive && <span className="text-blue-300">❄ Freeze Active!</span>}
      </div>

      <div className="mt-4 flex gap-2">
        {!gameState.isPlaying ? (
          <Button onClick={startGame}>Start Game</Button>
        ) : (
          <Button onClick={resetGame} variant="outline">
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

export default CryptoDodger
