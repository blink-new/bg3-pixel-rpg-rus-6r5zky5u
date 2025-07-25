import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import PartyPanel from './PartyPanel'
import DialogueSystem from './DialogueSystem'
import CombatSystem from './CombatSystem'
import InventorySystem from './InventorySystem'

interface GameWorldProps {
  character: any
  onBackToMenu: () => void
}

type GameMode = 'exploration' | 'dialogue' | 'combat' | 'camp' | 'inventory' | 'quest'

const GameWorld: React.FC<GameWorldProps> = ({ character, onBackToMenu }) => {
  const [gameMode, setGameMode] = useState<GameMode>('exploration')
  const [currentLocation, setCurrentLocation] = useState('Разбившийся корабль')
  const [discoveredLocations, setDiscoveredLocations] = useState(['Разбившийся корабль'])
  const [activeQuests, setActiveQuests] = useState([
    { id: 1, title: 'Найти лекарство от церебрального червя', description: 'Найти способ избавиться от иллитидского паразита', progress: 0 },
    { id: 2, title: 'Собрать спутников', description: 'Найти других выживших с корабля', progress: 1 }
  ])
  
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
    },
    {
      id: 'shadowheart',
      name: 'Шэдоухарт',
      class: 'Жрица',
      level: 1,
      hp: 8,
      maxHp: 8,
      stats: { strength: 13, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 17, charisma: 14 },
      isPlayer: false,
      relationship: 0
    }
  ])

  const locations = [
    {
      name: 'Разбившийся корабль',
      description: 'Обломки иллитидского корабля разбросаны по пляжу. Странные щупальца торчат из песка.',
      icon: '🚢',
      events: ['Найти выживших', 'Исследовать обломки', 'Поговорить с Астарионом', 'Найти припасы'],
      npcs: ['Астарион'],
      enemies: ['Интеллектуальный пожиратель', 'Зомби моряк']
    },
    {
      name: 'Заброшенная деревня',
      description: 'Тихая деревня, покинутая жителями. В воздухе витает зловещая атмосфера.',
      icon: '🏘️',
      events: ['Обыскать дома', 'Найти подсказки', 'Встретить Гейла', 'Исследовать храм'],
      npcs: ['Гейл', 'Призрак деревенского старосты'],
      enemies: ['Скелет', 'Гоблин-разведчик']
    },
    {
      name: 'Друидская роща',
      description: 'Священное место друидов, окружённое древними деревьями и магической энергией.',
      icon: '🌳',
      events: ['Поговорить с друидами', 'Найти Халсина', 'Исследовать ритуальный круг', 'Собрать травы'],
      npcs: ['Халсин', 'Кагха', 'Рат'],
      enemies: ['Дикий волк', 'Энт-страж']
    },
    {
      name: 'Гоблинский лагерь',
      description: 'Укреплённый лагерь гоблинов. Слышны крики и звуки пыток.',
      icon: '⚔️',
      events: ['Проникнуть незаметно', 'Атаковать в лоб', 'Найти пленников', 'Встретить лидеров'],
      npcs: ['Минтара', 'Дрор Рагзлин', 'Жрица Гут'],
      enemies: ['Гоблин-воин', 'Гоблин-лучник', 'Варг']
    },
    {
      name: 'Подземье',
      description: 'Тёмные туннели под землёй, полные опасностей и древних секретов.',
      icon: '🕳️',
      events: ['Исследовать туннели', 'Найти древние руины', 'Встретить дуэргаров', 'Найти грибы'],
      npcs: ['Совенок', 'Дуэргар-торговец'],
      enemies: ['Крюкастый ужас', 'Дуэргар-страж', 'Глубинный гном']
    },
    {
      name: 'Башня Лунного Восхода',
      description: 'Древняя башня, окутанная тенями и магией Шар.',
      icon: '🗼',
      events: ['Подняться на вершину', 'Исследовать библиотеку', 'Найти артефакты', 'Встретить Шэдоухарт'],
      npcs: ['Шэдоухарт', 'Дух мага', 'Ночная Песня'],
      enemies: ['Теневой демон', 'Нежить-страж']
    },
    {
      name: 'Врата Балдура - Нижний город',
      description: 'Бедные кварталы великого города. Здесь кипит жизнь простого народа.',
      icon: '🏙️',
      events: ['Исследовать доки', 'Найти таверну', 'Поговорить с торговцами', 'Встретить Минска'],
      npcs: ['Минск', 'Джахейра', 'Торговец оружием'],
      enemies: ['Городской бандит', 'Крыса-оборотень']
    },
    {
      name: 'Врата Балдура - Верхний город',
      description: 'Богатые кварталы, где живёт знать. Роскошные особняки и широкие проспекты.',
      icon: '🏛️',
      events: ['Посетить патрицианские дома', 'Найти библиотеку', 'Встретить аристократов'],
      npcs: ['Лорд Горт', 'Уилл', 'Карлах'],
      enemies: ['Стальной страж', 'Наёмный убийца']
    },
    {
      name: 'Лагерь',
      description: 'Безопасное место для отдыха. Здесь можно поговорить с спутниками и восстановить силы.',
      icon: '🏕️',
      events: ['Отдохнуть', 'Поговорить с партией', 'Планировать маршрут', 'Улучшить снаряжение'],
      npcs: ['Все спутники'],
      enemies: []
    }
  ]

  const npcs = {
    'Халсин': { name: 'Халсин', description: 'Архидруид, превращающийся в медведя', relationship: 0 },
    'Кагха': { name: 'Кагха', description: 'Временный лидер друидов', relationship: -10 },
    'Минтара': { name: 'Минтара', description: 'Паладин-дроу на службе у Абсолюта', relationship: -20 },
    'Джахейра': { name: 'Джахейра', description: 'Легендарная друид-полуэльф', relationship: 0 },
    'Лорд Горт': { name: 'Лорд Горт', description: 'Один из Трёх Мёртвых', relationship: -50 },
    'Совенок': { name: 'Совенок', description: 'Загадочный наблюдатель', relationship: 0 }
  }

  const currentLocationData = locations.find(loc => loc.name === currentLocation) || locations[0]

  const handleEventClick = (event: string) => {
    if (event.includes('Поговорить') || event.includes('Встретить')) {
      setGameMode('dialogue')
    } else if (event.includes('сражение') || event.includes('бой') || event.includes('Атаковать')) {
      setGameMode('combat')
    } else if (event === 'Лагерь' || currentLocation === 'Лагерь') {
      setGameMode('camp')
    } else {
      // Random event outcome
      const outcomes = [
        'Вы нашли 50 золотых монет!',
        'Обнаружен магический свиток!',
        'Найдено зелье лечения!',
        'Вы встретили дружелюбного торговца.',
        'Найдена подсказка о местонахождении артефакта.',
        'Вы обнаружили секретный проход!'
      ]
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]
      alert(outcome)
    }
  }

  const rollD20 = () => {
    return Math.floor(Math.random() * 20) + 1
  }

  const discoverLocation = (locationName: string) => {
    if (!discoveredLocations.includes(locationName)) {
      setDiscoveredLocations([...discoveredLocations, locationName])
      alert(`Открыта новая локация: ${locationName}!`)
    }
  }

  const travelToLocation = (locationName: string) => {
    setCurrentLocation(locationName)
    // Random encounter chance
    if (Math.random() < 0.3) {
      const encounters = [
        'Вы встретили группу бандитов!',
        'На пути попался дружелюбный торговец.',
        'Найдена заброшенная повозка с припасами.',
        'Вы заметили следы странного существа.'
      ]
      const encounter = encounters[Math.floor(Math.random() * encounters.length)]
      alert(`Случайная встреча: ${encounter}`)
    }
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

  if (gameMode === 'inventory') {
    return (
      <InventorySystem
        character={character}
        party={party}
        onBack={() => setGameMode('exploration')}
        onUpdateCharacter={(updatedCharacter) => {
          // Update character in party
          const updatedParty = party.map(member => 
            member.isPlayer ? updatedCharacter : member
          )
          setParty(updatedParty)
        }}
      />
    )
  }

  if (gameMode === 'quest') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-amber-200 pixel-glow">ЖУРНАЛ КВЕСТОВ</h1>
            <Button onClick={() => setGameMode('exploration')} className="pixel-button">
              ← НАЗАД
            </Button>
          </div>
          
          <Card className="pixel-panel">
            <h2 className="text-xl text-amber-200 mb-4">Активные квесты</h2>
            <div className="space-y-4">
              {activeQuests.map(quest => (
                <div key={quest.id} className="border-2 border-amber-600 p-4 bg-amber-800/50">
                  <h3 className="text-lg text-amber-200 font-bold mb-2">{quest.title}</h3>
                  <p className="text-amber-300 text-sm mb-2">{quest.description}</p>
                  <div className="w-full bg-amber-900 border border-amber-600 h-2">
                    <div 
                      className="h-full bg-amber-500" 
                      style={{ width: `${(quest.progress / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-amber-400 text-xs mt-1">Прогресс: {quest.progress}/5</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900">
      <div className="flex h-screen">
        {/* Left Panel - Party */}
        <div className="w-80 bg-amber-900 border-r-4 border-amber-600 p-4 overflow-y-auto">
          <PartyPanel party={party} />
          
          {/* Quick Stats */}
          <Card className="pixel-panel mt-4">
            <h3 className="text-lg text-amber-200 mb-2">Статистика</h3>
            <div className="text-sm text-amber-300 space-y-1">
              <p>Открыто локаций: {discoveredLocations.length}/{locations.length}</p>
              <p>Активных квестов: {activeQuests.length}</p>
              <p>Уровень партии: {Math.max(...party.map(p => p.level))}</p>
            </div>
          </Card>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Button 
                onClick={() => setGameMode('quest')}
                className="pixel-button text-sm"
              >
                📜 КВЕСТЫ
              </Button>
              <Button 
                onClick={() => setGameMode('inventory')}
                className="pixel-button text-sm"
              >
                🎒 ИНВЕНТАРЬ
              </Button>
            </div>
            <Button onClick={onBackToMenu} className="pixel-button text-sm">
              МЕНЮ
            </Button>
          </div>

          {/* Location Header */}
          <Card className="pixel-panel mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{currentLocationData.icon}</div>
                <div>
                  <h1 className="text-2xl text-amber-200 font-bold mb-2">{currentLocation}</h1>
                  <p className="text-amber-300 text-sm leading-relaxed">
                    {currentLocationData.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Location Info */}
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <p className="text-amber-200 font-bold">NPC:</p>
                <p className="text-amber-300">{currentLocationData.npcs.join(', ') || 'Нет'}</p>
              </div>
              <div>
                <p className="text-amber-200 font-bold">Враги:</p>
                <p className="text-amber-300">{currentLocationData.enemies.join(', ') || 'Нет'}</p>
              </div>
              <div>
                <p className="text-amber-200 font-bold">События:</p>
                <p className="text-amber-300">{currentLocationData.events.length}</p>
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
                      {event.includes('Поговорить') || event.includes('Встретить') ? '💬 Диалог' : 
                       event.includes('сражение') || event.includes('Атаковать') ? '⚔️ Бой' : 
                       '🔍 Исследование'}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Travel Options */}
          <Card className="pixel-panel mb-6">
            <h2 className="text-xl text-amber-200 mb-4">Путешествие</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {locations.filter(loc => discoveredLocations.includes(loc.name)).map((location, index) => (
                <Button
                  key={index}
                  onClick={() => travelToLocation(location.name)}
                  disabled={location.name === currentLocation}
                  className={`pixel-button text-center p-3 h-auto ${
                    location.name === currentLocation ? 'opacity-50' : 'hover:scale-105'
                  } transform transition-all duration-200`}
                >
                  <div>
                    <div className="text-2xl mb-1">{location.icon}</div>
                    <p className="text-xs font-bold">{location.name}</p>
                  </div>
                </Button>
              ))}
            </div>
            
            {/* Exploration */}
            <div className="mt-4 pt-4 border-t-2 border-amber-600">
              <h3 className="text-lg text-amber-200 mb-2">Исследование</h3>
              <div className="flex flex-wrap gap-2">
                {locations.filter(loc => !discoveredLocations.includes(loc.name)).slice(0, 3).map((location, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      const roll = rollD20()
                      if (roll >= 12) {
                        discoverLocation(location.name)
                      } else {
                        alert(`Исследование не удалось (бросок: ${roll}). Попробуйте ещё раз!`)
                      }
                    }}
                    className="pixel-button text-sm"
                  >
                    🗺️ Найти {location.name}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="pixel-panel">
            <h2 className="text-xl text-amber-200 mb-4">Быстрые действия</h2>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => travelToLocation('Лагерь')}
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
                  const roll = rollD20()
                  if (roll >= 15) {
                    alert('Найден редкий артефакт!')
                  } else if (roll >= 10) {
                    alert('Найдены припасы.')
                  } else {
                    alert('Ничего интересного не найдено.')
                  }
                }}
                className="pixel-button"
              >
                🔍 Обыскать область
              </Button>
              <Button 
                onClick={() => {
                  const updatedParty = party.map(member => ({
                    ...member,
                    hp: member.maxHp
                  }))
                  setParty(updatedParty)
                  alert('Партия полностью восстановлена!')
                }}
                className="pixel-button"
              >
                ❤️ Отдохнуть
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GameWorld