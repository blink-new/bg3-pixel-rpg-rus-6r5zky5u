import React from 'react'
import { Card } from './ui/card'

interface PartyMember {
  id: string
  name: string
  class: string
  level: number
  hp: number
  maxHp: number
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  isPlayer: boolean
  relationship?: number
}

interface PartyPanelProps {
  party: PartyMember[]
}

const PartyPanel: React.FC<PartyPanelProps> = ({ party }) => {
  const getModifier = (stat: number) => {
    return Math.floor((stat - 10) / 2)
  }

  const getRelationshipText = (relationship: number = 0) => {
    if (relationship >= 80) return 'Влюблён'
    if (relationship >= 60) return 'Очень дружелюбен'
    if (relationship >= 40) return 'Дружелюбен'
    if (relationship >= 20) return 'Нейтрален'
    if (relationship >= 0) return 'Настороженный'
    return 'Враждебный'
  }

  const getClassColor = (className: string) => {
    const colors: { [key: string]: string } = {
      'Воин': 'bg-red-600',
      'Плут': 'bg-gray-600',
      'Волшебник': 'bg-blue-600',
      'Жрец': 'bg-yellow-600',
      'Варвар': 'bg-orange-600',
      'Чернокнижник': 'bg-purple-600'
    }
    return colors[className] || 'bg-amber-600'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-amber-200 font-bold mb-4 text-center">ПАРТИЯ</h2>
      
      {party.map((member) => (
        <Card key={member.id} className="pixel-panel p-3">
          <div className="flex items-start space-x-3">
            {/* Character Portrait */}
            <div className={`character-portrait ${getClassColor(member.class)} flex-shrink-0`}>
              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {member.name[0]}
              </div>
            </div>

            {/* Character Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-amber-200 font-bold text-sm">{member.name}</h3>
                  <p className="text-amber-400 text-xs">{member.class} • Ур. {member.level}</p>
                </div>
                {member.isPlayer && (
                  <span className="text-amber-300 text-xs bg-amber-700 px-2 py-1 rounded">
                    ГГ
                  </span>
                )}
              </div>

              {/* Health Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-amber-300 mb-1">
                  <span>Здоровье</span>
                  <span>{member.hp}/{member.maxHp}</span>
                </div>
                <div className="stat-bar">
                  <div 
                    className="stat-bar-fill"
                    style={{ width: `${(member.hp / member.maxHp) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                <div className="text-center bg-amber-800 p-1">
                  <div className="text-amber-400">СИЛ</div>
                  <div className="text-amber-200 font-bold">
                    {member.stats.strength}
                    <span className="text-amber-400">
                      ({getModifier(member.stats.strength) >= 0 ? '+' : ''}{getModifier(member.stats.strength)})
                    </span>
                  </div>
                </div>
                <div className="text-center bg-amber-800 p-1">
                  <div className="text-amber-400">ЛОВ</div>
                  <div className="text-amber-200 font-bold">
                    {member.stats.dexterity}
                    <span className="text-amber-400">
                      ({getModifier(member.stats.dexterity) >= 0 ? '+' : ''}{getModifier(member.stats.dexterity)})
                    </span>
                  </div>
                </div>
                <div className="text-center bg-amber-800 p-1">
                  <div className="text-amber-400">ТЕЛ</div>
                  <div className="text-amber-200 font-bold">
                    {member.stats.constitution}
                    <span className="text-amber-400">
                      ({getModifier(member.stats.constitution) >= 0 ? '+' : ''}{getModifier(member.stats.constitution)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Relationship (for NPCs) */}
              {!member.isPlayer && member.relationship !== undefined && (
                <div className="text-xs">
                  <div className="flex justify-between text-amber-300 mb-1">
                    <span>Отношения</span>
                    <span>{member.relationship}/100</span>
                  </div>
                  <div className="bg-amber-800 h-2 border border-amber-600">
                    <div 
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full transition-all duration-300"
                      style={{ width: `${member.relationship}%` }}
                    ></div>
                  </div>
                  <p className="text-amber-400 text-xs mt-1">
                    {getRelationshipText(member.relationship)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}

      {/* Party Stats Summary */}
      <Card className="pixel-panel p-3 mt-4">
        <h3 className="text-amber-200 font-bold text-sm mb-2">Статистика партии</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-amber-300">
            <span>Общее здоровье:</span>
            <span>
              {party.reduce((sum, member) => sum + member.hp, 0)}/
              {party.reduce((sum, member) => sum + member.maxHp, 0)}
            </span>
          </div>
          <div className="flex justify-between text-amber-300">
            <span>Средний уровень:</span>
            <span>{Math.round(party.reduce((sum, member) => sum + member.level, 0) / party.length)}</span>
          </div>
          <div className="flex justify-between text-amber-300">
            <span>Размер партии:</span>
            <span>{party.length}/6</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PartyPanel