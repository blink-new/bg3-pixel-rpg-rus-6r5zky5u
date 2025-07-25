import React, { useState } from 'react'
import { Card } from './ui/card'

interface CharacterCreationProps {
  onCharacterCreated: (character: any) => void
  onBack: () => void
}

interface Character {
  name: string
  class: string
  race: string
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  hp: number
  level: number
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreated, onBack }) => {
  const [character, setCharacter] = useState<Character>({
    name: 'Тав',
    class: 'Воин',
    race: 'Человек',
    stats: {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    },
    hp: 10,
    level: 1
  })

  const classes = [
    { name: 'Воин', description: 'Мастер ближнего боя', color: 'bg-red-600' },
    { name: 'Плут', description: 'Скрытность и точность', color: 'bg-gray-600' },
    { name: 'Волшебник', description: 'Мастер магии', color: 'bg-blue-600' },
    { name: 'Жрец', description: 'Божественная сила', color: 'bg-yellow-600' },
    { name: 'Варвар', description: 'Дикая ярость', color: 'bg-orange-600' },
    { name: 'Чернокнижник', description: 'Тёмная магия', color: 'bg-purple-600' }
  ]

  const races = [
    { name: 'Человек', bonus: '+1 ко всем характеристикам' },
    { name: 'Эльф', bonus: '+2 Ловкость, Тёмное зрение' },
    { name: 'Дварф', bonus: '+2 Телосложение, Сопротивление яду' },
    { name: 'Полурослик', bonus: '+2 Ловкость, Удачливый' },
    { name: 'Тифлинг', bonus: '+2 Харизма, Сопротивление огню' },
    { name: 'Полуэльф', bonus: '+2 Харизма, +1 к двум характеристикам' }
  ]

  const rollStats = () => {
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
      rolls.sort((a, b) => b - a)
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
    }

    setCharacter(prev => ({
      ...prev,
      stats: {
        strength: rollStat(),
        dexterity: rollStat(),
        constitution: rollStat(),
        intelligence: rollStat(),
        wisdom: rollStat(),
        charisma: rollStat()
      }
    }))
  }

  const getModifier = (stat: number) => {
    return Math.floor((stat - 10) / 2)
  }

  const handleCreateCharacter = () => {
    const finalCharacter = {
      ...character,
      hp: 10 + getModifier(character.stats.constitution)
    }
    onCharacterCreated(finalCharacter)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-200 mb-2 pixel-glow">
            СОЗДАНИЕ ПЕРСОНАЖА
          </h1>
          <p className="text-amber-400">Создайте своего героя для путешествия</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Character Info */}
          <Card className="pixel-panel">
            <h2 className="text-xl text-amber-200 mb-4">Основная информация</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-amber-300 text-sm mb-2">Имя персонажа</label>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-amber-800 border-2 border-amber-600 text-amber-100 p-2 pixel-font text-sm"
                />
              </div>

              <div>
                <label className="block text-amber-300 text-sm mb-2">Раса</label>
                <select
                  value={character.race}
                  onChange={(e) => setCharacter(prev => ({ ...prev, race: e.target.value }))}
                  className="w-full bg-amber-800 border-2 border-amber-600 text-amber-100 p-2 pixel-font text-sm"
                >
                  {races.map(race => (
                    <option key={race.name} value={race.name}>{race.name}</option>
                  ))}
                </select>
                <p className="text-amber-400 text-xs mt-1">
                  {races.find(r => r.name === character.race)?.bonus}
                </p>
              </div>

              <div>
                <label className="block text-amber-300 text-sm mb-2">Класс</label>
                <div className="grid grid-cols-2 gap-2">
                  {classes.map(cls => (
                    <button
                      key={cls.name}
                      onClick={() => setCharacter(prev => ({ ...prev, class: cls.name }))}
                      className={`p-3 border-2 transition-all duration-200 interactive min-h-[80px] ${
                        character.class === cls.name
                          ? 'border-amber-400 bg-amber-700'
                          : 'border-amber-600 bg-amber-800 hover:bg-amber-700'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <div className={`w-8 h-8 ${cls.color} mx-auto mb-1 rounded`}></div>
                      <p className="text-amber-100 text-xs font-bold">{cls.name}</p>
                      <p className="text-amber-400 text-xs">{cls.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card className="pixel-panel">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-amber-200">Характеристики</h2>
              <button 
                onClick={rollStats} 
                className="pixel-button text-sm interactive"
                style={{ touchAction: 'manipulation' }}
              >
                🎲 Бросить кубики
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(character.stats).map(([stat, value]) => {
                const modifier = getModifier(value)
                const statNames: { [key: string]: string } = {
                  strength: 'Сила',
                  dexterity: 'Ловкость',
                  constitution: 'Телосложение',
                  intelligence: 'Интеллект',
                  wisdom: 'Мудрость',
                  charisma: 'Харизма'
                }

                return (
                  <div key={stat} className="flex justify-between items-center bg-amber-800 p-2 border border-amber-600">
                    <span className="text-amber-200 text-sm">{statNames[stat]}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-100 font-bold">{value}</span>
                      <span className="text-amber-400 text-sm">
                        ({modifier >= 0 ? '+' : ''}{modifier})
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 p-3 bg-amber-700 border border-amber-500">
              <div className="flex justify-between text-amber-100">
                <span>Очки здоровья:</span>
                <span className="font-bold">{10 + getModifier(character.stats.constitution)}</span>
              </div>
              <div className="flex justify-between text-amber-100">
                <span>Уровень:</span>
                <span className="font-bold">{character.level}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button 
            onClick={onBack} 
            className="pixel-button px-6 py-3 interactive"
            style={{ touchAction: 'manipulation' }}
          >
            ← НАЗАД
          </button>
          <button 
            onClick={handleCreateCharacter} 
            className="pixel-button px-6 py-3 bg-green-700 hover:bg-green-600 active:bg-green-800 interactive"
            style={{ touchAction: 'manipulation' }}
          >
            НАЧАТЬ ПРИКЛЮЧЕНИЕ →
          </button>
        </div>
      </div>
    </div>
  )
}

export default CharacterCreation