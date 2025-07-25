import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface CombatSystemProps {
  party: any[]
  onCombatEnd: () => void
  onUpdateParty: (party: any[]) => void
}

interface CombatAction {
  type: 'attack' | 'spell' | 'defend' | 'item'
  name: string
  damage?: string
  description: string
}

const CombatSystem: React.FC<CombatSystemProps> = ({ party, onCombatEnd, onUpdateParty }) => {
  const [currentTurn, setCurrentTurn] = useState(0)
  const [combatLog, setCombatLog] = useState<string[]>(['Бой начался!'])
  const [enemies, setEnemies] = useState([
    {
      id: 'goblin1',
      name: 'Гоблин-воин',
      hp: 15,
      maxHp: 15,
      ac: 13,
      damage: '1d6+2',
      initiative: 12
    },
    {
      id: 'goblin2',
      name: 'Гоблин-лучник',
      hp: 12,
      maxHp: 12,
      ac: 14,
      damage: '1d6+1',
      initiative: 15
    }
  ])
  const [selectedAction, setSelectedAction] = useState<CombatAction | null>(null)
  const [turnOrder, setTurnOrder] = useState<any[]>([])

  const rollD20 = () => Math.floor(Math.random() * 20) + 1
  const getModifier = (stat: number) => Math.floor((stat - 10) / 2)

  const actions: CombatAction[] = [
    { type: 'attack', name: 'Атака оружием', damage: '1d8+3', description: 'Обычная атака ближнего боя' },
    { type: 'spell', name: 'Магическая стрела', damage: '1d4+1', description: 'Автоматически попадающее заклинание' },
    { type: 'defend', name: 'Защита', description: 'Получить +2 к КД до следующего хода' },
    { type: 'item', name: 'Зелье лечения', description: 'Восстановить 2d4+2 ОЗ' }
  ]

  useEffect(() => {
    // Initialize turn order based on initiative
    const allCombatants = [
      ...party.map(p => ({ ...p, type: 'ally', initiative: rollD20() + getModifier(p.stats.dexterity) })),
      ...enemies.map(e => ({ ...e, type: 'enemy' }))
    ].sort((a, b) => b.initiative - a.initiative)
    
    setTurnOrder(allCombatants)
  }, [party, enemies])
  const rollDamage = (diceString: string) => {
    // Simple damage calculation for demo
    const match = diceString.match(/(\d+)d(\d+)\+?(\d+)?/)
    if (match) {
      const [, numDice, diceSize, bonus] = match
      let total = 0
      for (let i = 0; i < parseInt(numDice); i++) {
        total += Math.floor(Math.random() * parseInt(diceSize)) + 1
      }
      return total + (parseInt(bonus) || 0)
    }
    return 1
  }

  const getCurrentCombatant = () => {
    return turnOrder[currentTurn % turnOrder.length]
  }

  const addToCombatLog = (message: string) => {
    setCombatLog(prev => [...prev, message])
  }

  const executeAction = (action: CombatAction, target?: any) => {
    const actor = getCurrentCombatant()
    
    if (action.type === 'attack') {
      const attackRoll = rollD20()
      const attackBonus = getModifier(actor.stats?.strength || 14)
      const totalAttack = attackRoll + attackBonus
      
      const targetAC = target?.ac || 13
      
      if (totalAttack >= targetAC) {
        const damage = rollDamage(action.damage || '1d6')
        addToCombatLog(`${actor.name} атакует ${target?.name || 'цель'}: ${attackRoll}+${attackBonus}=${totalAttack} (попадание!)`)
        addToCombatLog(`Урон: ${damage}`)
        
        if (target && actor.type === 'ally') {
          // Player attacking enemy
          setEnemies(prev => prev.map(e => 
            e.id === target.id ? { ...e, hp: Math.max(0, e.hp - damage) } : e
          ))
        } else if (target && actor.type === 'enemy') {
          // Enemy attacking player
          const updatedParty = party.map(p => 
            p.id === target.id ? { ...p, hp: Math.max(0, p.hp - damage) } : p
          )
          onUpdateParty(updatedParty)
        }
      } else {
        addToCombatLog(`${actor.name} атакует ${target?.name || 'цель'}: ${attackRoll}+${attackBonus}=${totalAttack} (промах!)`)
      }
    } else if (action.type === 'spell') {
      const damage = rollDamage(action.damage || '1d4')
      addToCombatLog(`${actor.name} использует ${action.name}`)
      addToCombatLog(`Урон: ${damage}`)
      
      if (target && actor.type === 'ally') {
        setEnemies(prev => prev.map(e => 
          e.id === target.id ? { ...e, hp: Math.max(0, e.hp - damage) } : e
        ))
      }
    } else if (action.type === 'defend') {
      addToCombatLog(`${actor.name} принимает защитную позицию (+2 КД)`)
    } else if (action.type === 'item') {
      const healing = rollDamage('2d4+2')
      addToCombatLog(`${actor.name} использует зелье лечения и восстанавливает ${healing} ОЗ`)
      
      if (actor.type === 'ally') {
        const updatedParty = party.map(p => 
          p.id === actor.id ? { ...p, hp: Math.min(p.maxHp, p.hp + healing) } : p
        )
        onUpdateParty(updatedParty)
      }
    }

    // Next turn
    setCurrentTurn(prev => prev + 1)
    setSelectedAction(null)
  }



  // Auto-execute enemy turns
  useEffect(() => {
    const currentCombatant = turnOrder[currentTurn % turnOrder.length]
    if (currentCombatant?.type === 'enemy' && enemies.find(e => e.id === currentCombatant.id)?.hp > 0) {
      const timer = setTimeout(() => {
        const enemy = currentCombatant
        const alivePartyMembers = party.filter(p => p.hp > 0)
        
        if (alivePartyMembers.length > 0) {
          const target = alivePartyMembers[Math.floor(Math.random() * alivePartyMembers.length)]
          const attackRoll = rollD20()
          const attackBonus = getModifier(14) // Default enemy stats
          const totalAttack = attackRoll + attackBonus
          
          if (totalAttack >= 13) { // Default AC
            const damage = rollDamage(enemy.damage || '1d6')
            addToCombatLog(`${enemy.name} атакует ${target.name}: ${attackRoll}+${attackBonus}=${totalAttack} (попадание!)`)
            addToCombatLog(`Урон: ${damage}`)
            
            const updatedParty = party.map(p => 
              p.id === target.id ? { ...p, hp: Math.max(0, p.hp - damage) } : p
            )
            onUpdateParty(updatedParty)
          } else {
            addToCombatLog(`${enemy.name} атакует ${target.name}: ${attackRoll}+${attackBonus}=${totalAttack} (промах!)`)
          }
          
          setCurrentTurn(prev => prev + 1)
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [currentTurn, enemies, onUpdateParty, party, turnOrder])

  // Check for combat end
  useEffect(() => {
    const aliveEnemies = enemies.filter(e => e.hp > 0)
    const aliveParty = party.filter(p => p.hp > 0)
    
    if (aliveEnemies.length === 0) {
      addToCombatLog('Победа! Все враги повержены!')
      setTimeout(() => onCombatEnd(), 2000)
    } else if (aliveParty.length === 0) {
      addToCombatLog('Поражение! Вся партия пала в бою!')
      setTimeout(() => onCombatEnd(), 2000)
    }
  }, [enemies, party, onCombatEnd])

  const currentCombatant = getCurrentCombatant()
  const isPlayerTurn = currentCombatant?.type === 'ally'

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-red-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-200 pixel-glow mb-2">БОЙ</h1>
          <p className="text-red-300">
            Ход: {currentCombatant?.name} 
            {isPlayerTurn ? ' (Ваш ход)' : ' (Ход противника)'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Party Status */}
          <Card className="pixel-panel">
            <h2 className="text-lg text-amber-200 mb-4">Партия</h2>
            <div className="space-y-3">
              {party.map(member => (
                <div key={member.id} className={`p-3 border-2 ${
                  currentCombatant?.id === member.id ? 'border-yellow-400 bg-yellow-900/20' : 'border-amber-600'
                } ${member.hp <= 0 ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-200 font-bold">{member.name}</span>
                    <span className="text-amber-300">{member.hp}/{member.maxHp} ОЗ</span>
                  </div>
                  <div className="stat-bar">
                    <div 
                      className="stat-bar-fill"
                      style={{ width: `${(member.hp / member.maxHp) * 100}%` }}
                    ></div>
                  </div>
                  {member.hp <= 0 && (
                    <p className="text-red-400 text-sm mt-1">Без сознания</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Combat Actions */}
          <Card className="pixel-panel">
            <h2 className="text-lg text-amber-200 mb-4">Действия</h2>
            {isPlayerTurn && currentCombatant?.hp > 0 ? (
              <div className="space-y-3">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedAction(action)}
                    className={`w-full text-left p-3 h-auto ${
                      selectedAction?.name === action.name ? 'bg-amber-600' : 'pixel-button'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{action.name}</p>
                      <p className="text-xs opacity-75">{action.description}</p>
                      {action.damage && (
                        <p className="text-xs text-red-300">Урон: {action.damage}</p>
                      )}
                    </div>
                  </Button>
                ))}
                
                {selectedAction && (
                  <div className="mt-4 p-3 bg-amber-700 border border-amber-500">
                    <p className="text-amber-200 font-bold mb-2">Выберите цель:</p>
                    {selectedAction.type === 'item' || selectedAction.type === 'defend' ? (
                      <Button
                        onClick={() => executeAction(selectedAction)}
                        className="pixel-button w-full"
                      >
                        Выполнить действие
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        {enemies.filter(e => e.hp > 0).map(enemy => (
                          <Button
                            key={enemy.id}
                            onClick={() => executeAction(selectedAction, enemy)}
                            className="pixel-button w-full text-left"
                          >
                            {enemy.name} ({enemy.hp}/{enemy.maxHp} ОЗ)
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-amber-300">
                  {currentCombatant?.type === 'enemy' ? 'Ход противника...' : 'Ожидание...'}
                </p>
              </div>
            )}
          </Card>

          {/* Enemies */}
          <Card className="pixel-panel">
            <h2 className="text-lg text-amber-200 mb-4">Противники</h2>
            <div className="space-y-3">
              {enemies.map(enemy => (
                <div key={enemy.id} className={`p-3 border-2 ${
                  currentCombatant?.id === enemy.id ? 'border-red-400 bg-red-900/20' : 'border-red-600'
                } ${enemy.hp <= 0 ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-200 font-bold">{enemy.name}</span>
                    <span className="text-red-300">{enemy.hp}/{enemy.maxHp} ОЗ</span>
                  </div>
                  <div className="bg-red-900 border-2 border-red-700 h-3">
                    <div 
                      className="bg-red-500 h-full transition-all duration-300"
                      style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-red-400 text-sm mt-1">КД: {enemy.ac}</p>
                  {enemy.hp <= 0 && (
                    <p className="text-gray-400 text-sm">Повержен</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Combat Log */}
        <Card className="pixel-panel mt-6">
          <h2 className="text-lg text-amber-200 mb-4">Журнал боя</h2>
          <div className="bg-amber-800 border-2 border-amber-600 p-4 h-40 overflow-y-auto">
            {combatLog.map((entry, index) => (
              <p key={index} className="text-amber-100 text-sm mb-1">
                {entry}
              </p>
            ))}
          </div>
        </Card>

        {/* End Combat Button */}
        <div className="text-center mt-6">
          <Button onClick={onCombatEnd} className="pixel-button">
            Завершить бой (для тестирования)
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CombatSystem