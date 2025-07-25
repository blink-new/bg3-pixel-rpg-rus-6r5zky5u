import React, { useState } from 'react'
import MainMenu from './components/MainMenu'
import CharacterCreation from './components/CharacterCreation'
import GameWorld from './components/GameWorld'
import './index.css'

type GameState = 'menu' | 'character-creation' | 'game'

function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [character, setCharacter] = useState(null)

  const handleStartGame = () => {
    setGameState('character-creation')
  }

  const handleCharacterCreated = (newCharacter: any) => {
    setCharacter(newCharacter)
    setGameState('game')
  }

  const handleBackToMenu = () => {
    setGameState('menu')
    setCharacter(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900">
      {gameState === 'menu' && (
        <MainMenu onStartGame={handleStartGame} />
      )}
      {gameState === 'character-creation' && (
        <CharacterCreation 
          onCharacterCreated={handleCharacterCreated}
          onBack={() => setGameState('menu')}
        />
      )}
      {gameState === 'game' && character && (
        <GameWorld 
          character={character}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  )
}

export default App