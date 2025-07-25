import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import PartyPanel from './PartyPanel'
import DialogueSystem from './DialogueSystem'
import CombatSystem from './CombatSystem'

interface GameWorldProps {
  character: any
  onBackToMenu: () => void
}

type GameMode = 'exploration' | 'dialogue' | 'combat' | 'camp'

const GameWorld: React.FC<GameWorldProps> = ({ character, onBackToMenu }) => {
  const [gameMode, setGameMode] = useState<GameMode>('exploration')
  const [currentLocation, setCurrentLocation] = useState('Разбившийся корабль')
  const [party, setParty] = useState([
    {
      id: 'tav',
      name: character.name,
      class: character.class,
      level: character.level,
      hp: character.hp,
      maxHp: character.hp,
      stats: character.stats,
      isPlayer: true
    },
    {
      id: 'astarion',
      name: 'Астарион',
      class: 'Плут',
      level: 1,
      hp: 8,
      maxHp: 8,
      stats: { strength: 8, dexterity: 17, constitution: 14, intelligence: 13, wisdom: 13, charisma: 10 },
      isPlayer: false,
      relationship: 0
    },
    {
      id: 'gale',
      name: 'Гейл',
      class: 'Волшебник',
      level: 1,
      hp: 6,
      maxHp: 6,
      stats: { strength: 8, dexterity: 14, constitution: 15, intelligence: 17, wisdom: 12, charisma: 13 },
      isPlayer: false,
      relationship: 0
    }
  ])

  const locations = [
    {
      name: 'Разбившийся корабль',
      description: 'Обломки иллитидского корабля разбросаны по пляжу. Странные щупальца торчат из песка.',
      events: ['Найти выживших', 'Исследовать обломки', 'Поговорить с Астарионом']
    },
    {
      name: 'Заброшенная деревня',
      description: 'Тихая деревня, покинутая жителями. В воздухе витает зловещая атмосфера.',
      events: ['Обыскать дома', 'Найти подсказки', 'Встретить Гейла']
    },
    {
      name: 'Лагерь',
      description: 'Безопасное место для отдыха. Здесь можно поговорить с спутниками и восстановить силы.',
      events: ['Отдохнуть', 'Поговорить с партией', 'Планировать маршрут']
    }
  ]

  const currentLocationData = locations.find(loc => loc.name === currentLocation) || locations[0]

  const handleEventClick = (event: string) => {
    if (event.includes('Поговорить') || event.includes('Встретить')) {
      setGameMode('dialogue')
    } else if (event.includes('сражение') || event.includes('бой')) {
      setGameMode('combat')
    } else if (event === 'Лагерь' || currentLocation === 'Лагерь') {
      setGameMode('camp')
    }
  }

  const rollD20 = () => {
    return Math.floor(Math.random() * 20) + 1
  }

  if (gameMode === 'dialogue') {
    return (
      <DialogueSystem
        character={character}
        party={party}
        onBack={() => setGameMode('exploration')}
        onUpdateParty={setParty}
      />
    )
  }

  if (gameMode === 'combat') {
    return (
      <CombatSystem
        party={party}
        onCombatEnd={() => setGameMode('exploration')}
        onUpdateParty={setParty}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900">
      <div className="flex h-screen">
        {/* Left Panel - Party */}
        <div className="w-80 bg-amber-900 border-r-4 border-amber-600 p-4 overflow-y-auto">
          <PartyPanel party={party} />
        </div>

        {/* Main Game Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Location Header */}
          <Card className="pixel-panel mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl text-amber-200 font-bold mb-2">{currentLocation}</h1>
                <p className="text-amber-300 text-sm leading-relaxed">
                  {currentLocationData.description}
                </p>
              </div>
              <Button onClick={onBackToMenu} className="pixel-button text-sm">
                МЕНЮ
              </Button>
            </div>
          </Card>

          {/* Location Visual */}
          <Card className="pixel-panel mb-6">
            <div className="h-64 bg-gradient-to-b from-amber-700 to-amber-800 border-2 border-amber-600 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-amber-600 mx-auto mb-4 border-4 border-amber-500 flex items-center justify-center">
                  <span className="text-4xl">🏛️</span>
                </div>
                <p className="text-amber-200 text-sm">{currentLocation}</p>
              </div>
            </div>
          </Card>

          {/* Available Actions */}
          <Card className="pixel-panel mb-6">
            <h2 className="text-xl text-amber-200 mb-4">Доступные действия</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLocationData.events.map((event, index) => (
                <Button
                  key={index}
                  onClick={() => handleEventClick(event)}
                  className="pixel-button text-left p-4 h-auto hover:scale-105 transform transition-all duration-200"
                >
                  <div>
                    <p className="font-bold mb-1">{event}</p>
                    <p className="text-xs opacity-75">
                      {event.includes('Поговорить') ? 'Диалог' : 
                       event.includes('сражение') ? 'Бой' : 'Исследование'}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="pixel-panel">
            <h2 className="text-xl text-amber-200 mb-4">Быстрые действия</h2>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setCurrentLocation('Лагерь')}
                className="pixel-button"
              >
                🏕️ В лагерь
              </Button>
              <Button 
                onClick={() => {
                  const roll = rollD20()
                  alert(`Бросок d20: ${roll}`)
                }}
                className="pixel-button"
              >
                🎲 Бросить d20
              </Button>
              <Button 
                onClick={() => setGameMode('dialogue')}
                className="pixel-button"
              >
                💬 Поговорить с партией
              </Button>
              <Button 
                onClick={() => {
                  const newLocation = locations[Math.floor(Math.random() * locations.length)]
                  setCurrentLocation(newLocation.name)
                }}
                className="pixel-button"
              >
                🗺️ Исследовать
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GameWorld