import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface InventorySystemProps {
  character: any
  party: any[]
  onBack: () => void
  onUpdateCharacter: (character: any) => void
}

interface Item {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'consumable' | 'misc'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  description: string
  stats?: {
    damage?: string
    ac?: number
    bonus?: string
  }
  quantity: number
  equipped?: boolean
}

const InventorySystem: React.FC<InventorySystemProps> = ({ character, party, onBack, onUpdateCharacter }) => {
  const [selectedTab, setSelectedTab] = useState<'inventory' | 'equipment' | 'spells'>('inventory')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  
  const [inventory, setInventory] = useState<Item[]>([
    {
      id: 'shortsword',
      name: 'Короткий меч',
      type: 'weapon',
      rarity: 'common',
      description: 'Простое, но надёжное оружие. Подходит для быстрых атак.',
      stats: { damage: '1d6 + Лов' },
      quantity: 1,
      equipped: true
    },
    {
      id: 'leather_armor',
      name: 'Кожаная броня',
      type: 'armor',
      rarity: 'common',
      description: 'Лёгкая броня из обработанной кожи.',
      stats: { ac: 11 },
      quantity: 1,
      equipped: true
    },
    {
      id: 'healing_potion',
      name: 'Зелье лечения',
      type: 'consumable',
      rarity: 'common',
      description: 'Восстанавливает 2d4+2 здоровья.',
      quantity: 3
    },
    {
      id: 'magic_scroll',
      name: 'Свиток Магической стрелы',
      type: 'consumable',
      rarity: 'uncommon',
      description: 'Позволяет использовать заклинание Магическая стрела.',
      quantity: 2
    },
    {
      id: 'silver_ring',
      name: 'Серебряное кольцо',
      type: 'misc',
      rarity: 'uncommon',
      description: 'Красивое кольцо с неизвестными рунами.',
      quantity: 1
    },
    {
      id: 'thieves_tools',
      name: 'Воровские инструменты',
      type: 'misc',
      rarity: 'common',
      description: 'Набор отмычек и инструментов для взлома.',
      quantity: 1
    }
  ])

  const spells = [
    {
      name: 'Магическая стрела',
      level: 1,
      school: 'Воплощение',
      description: 'Три светящиеся стрелы поражают цель. Урон: 1d4+1 за стрелу.',
      prepared: true
    },
    {
      name: 'Лечение ран',
      level: 1,
      school: 'Воплощение',
      description: 'Восстанавливает 1d8 + модификатор заклинательной характеристики здоровья.',
      prepared: true
    },
    {
      name: 'Щит',
      level: 1,
      school: 'Ограждение',
      description: 'Реакция. +5 к КД против одной атаки.',
      prepared: false
    },
    {
      name: 'Огненный шар',
      level: 3,
      school: 'Воплощение',
      description: 'Взрыв огня в радиусе 20 футов. Урон: 8d6 огнём.',
      prepared: false
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 text-gray-300'
      case 'uncommon': return 'border-green-400 text-green-300'
      case 'rare': return 'border-blue-400 text-blue-300'
      case 'epic': return 'border-purple-400 text-purple-300'
      case 'legendary': return 'border-yellow-400 text-yellow-300'
      default: return 'border-gray-400 text-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weapon': return '⚔️'
      case 'armor': return '🛡️'
      case 'consumable': return '🧪'
      case 'misc': return '💎'
      default: return '📦'
    }
  }

  const handleUseItem = (item: Item) => {
    if (item.type === 'consumable') {
      if (item.name.includes('Зелье лечения')) {
        const healing = Math.floor(Math.random() * 8) + 4 // 2d4+2
        const updatedCharacter = {
          ...character,
          hp: Math.min(character.maxHp, character.hp + healing)
        }
        onUpdateCharacter(updatedCharacter)
        
        // Reduce quantity
        const updatedInventory = inventory.map(invItem => 
          invItem.id === item.id 
            ? { ...invItem, quantity: invItem.quantity - 1 }
            : invItem
        ).filter(invItem => invItem.quantity > 0)
        
        setInventory(updatedInventory)
        alert(`Восстановлено ${healing} здоровья!`)
      } else if (item.name.includes('Свиток')) {
        alert('Заклинание использовано!')
        const updatedInventory = inventory.map(invItem => 
          invItem.id === item.id 
            ? { ...invItem, quantity: invItem.quantity - 1 }
            : invItem
        ).filter(invItem => invItem.quantity > 0)
        setInventory(updatedInventory)
      }
    }
  }

  const equipItem = (item: Item) => {
    if (item.type === 'weapon' || item.type === 'armor') {
      const updatedInventory = inventory.map(invItem => {
        if (invItem.type === item.type) {
          return { ...invItem, equipped: invItem.id === item.id }
        }
        return invItem
      })
      setInventory(updatedInventory)
      alert(`${item.name} экипирован!`)
    }
  }

  const filteredItems = inventory.filter(item => {
    if (selectedTab === 'equipment') {
      return item.type === 'weapon' || item.type === 'armor'
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-200 pixel-glow">ИНВЕНТАРЬ</h1>
          <Button onClick={onBack} className="pixel-button">
            ← НАЗАД
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Tabs and Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Card className="pixel-panel">
              <div className="flex space-x-2">
                <Button
                  onClick={() => setSelectedTab('inventory')}
                  className={`pixel-button ${selectedTab === 'inventory' ? 'bg-amber-600' : ''}`}
                >
                  🎒 Инвентарь
                </Button>
                <Button
                  onClick={() => setSelectedTab('equipment')}
                  className={`pixel-button ${selectedTab === 'equipment' ? 'bg-amber-600' : ''}`}
                >
                  ⚔️ Снаряжение
                </Button>
                <Button
                  onClick={() => setSelectedTab('spells')}
                  className={`pixel-button ${selectedTab === 'spells' ? 'bg-amber-600' : ''}`}
                >
                  📜 Заклинания
                </Button>
              </div>
            </Card>

            {/* Items Grid */}
            {selectedTab !== 'spells' && (
              <Card className="pixel-panel">
                <h2 className="text-xl text-amber-200 mb-4">
                  {selectedTab === 'inventory' ? 'Предметы' : 'Экипировка'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-3 border-2 transition-all duration-200 hover:scale-105 ${
                        getRarityColor(item.rarity)
                      } ${
                        selectedItem?.id === item.id ? 'bg-amber-700' : 'bg-amber-800/50'
                      } ${
                        item.equipped ? 'ring-2 ring-amber-400' : ''
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{getTypeIcon(item.type)}</div>
                        <p className="text-sm font-bold mb-1">{item.name}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-amber-400">x{item.quantity}</p>
                        )}
                        {item.equipped && (
                          <p className="text-xs text-green-400">✓ Экипировано</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Spells */}
            {selectedTab === 'spells' && (
              <Card className="pixel-panel">
                <h2 className="text-xl text-amber-200 mb-4">Заклинания</h2>
                <div className="space-y-3">
                  {spells.map((spell, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 transition-all duration-200 ${
                        spell.prepared 
                          ? 'border-amber-400 bg-amber-700/50' 
                          : 'border-amber-600 bg-amber-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg text-amber-200 font-bold">{spell.name}</h3>
                          <p className="text-sm text-amber-400">
                            {spell.level} уровень • {spell.school}
                          </p>
                        </div>
                        <div className="text-right">
                          {spell.prepared ? (
                            <span className="text-green-400 text-sm">✓ Подготовлено</span>
                          ) : (
                            <Button className="pixel-button text-xs">
                              Подготовить
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-amber-300 text-sm">{spell.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Item Details */}
          <div className="space-y-6">
            {/* Character Stats */}
            <Card className="pixel-panel">
              <h2 className="text-lg text-amber-200 mb-3">Характеристики</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-amber-300">Здоровье:</span>
                  <span className="text-amber-200">{character.hp}/{character.maxHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-300">Класс доспеха:</span>
                  <span className="text-amber-200">
                    {10 + Math.floor((character.stats.dexterity - 10) / 2) + 
                     (inventory.find(i => i.equipped && i.type === 'armor')?.stats?.ac || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-300">Уровень:</span>
                  <span className="text-amber-200">{character.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-300">Опыт:</span>
                  <span className="text-amber-200">{character.experience || 0}/1000</span>
                </div>
              </div>
            </Card>

            {/* Item Details */}
            {selectedItem && (
              <Card className="pixel-panel">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getTypeIcon(selectedItem.type)}</div>
                  <h2 className={`text-lg font-bold ${getRarityColor(selectedItem.rarity)}`}>
                    {selectedItem.name}
                  </h2>
                  <p className="text-amber-400 text-sm capitalize">{selectedItem.rarity}</p>
                </div>

                <p className="text-amber-300 text-sm mb-4 leading-relaxed">
                  {selectedItem.description}
                </p>

                {selectedItem.stats && (
                  <div className="mb-4 p-3 bg-amber-800/50 border border-amber-600">
                    <h3 className="text-amber-200 font-bold mb-2">Характеристики:</h3>
                    {selectedItem.stats.damage && (
                      <p className="text-amber-300 text-sm">Урон: {selectedItem.stats.damage}</p>
                    )}
                    {selectedItem.stats.ac && (
                      <p className="text-amber-300 text-sm">КД: {selectedItem.stats.ac}</p>
                    )}
                    {selectedItem.stats.bonus && (
                      <p className="text-amber-300 text-sm">Бонус: {selectedItem.stats.bonus}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {selectedItem.type === 'consumable' && (
                    <Button
                      onClick={() => handleUseItem(selectedItem)}
                      className="w-full pixel-button"
                    >
                      🧪 Использовать
                    </Button>
                  )}
                  
                  {(selectedItem.type === 'weapon' || selectedItem.type === 'armor') && (
                    <Button
                      onClick={() => equipItem(selectedItem)}
                      disabled={selectedItem.equipped}
                      className="w-full pixel-button"
                    >
                      {selectedItem.equipped ? '✓ Экипировано' : '⚔️ Экипировать'}
                    </Button>
                  )}

                  {selectedItem.quantity > 1 && (
                    <p className="text-center text-amber-400 text-sm">
                      Количество: {selectedItem.quantity}
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="pixel-panel">
              <h2 className="text-lg text-amber-200 mb-3">Быстрые действия</h2>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    const healingPotion = inventory.find(i => i.name.includes('Зелье лечения'))
                    if (healingPotion) {
                      handleUseItem(healingPotion)
                    } else {
                      alert('Нет зелий лечения!')
                    }
                  }}
                  className="w-full pixel-button text-sm"
                >
                  🧪 Быстрое лечение
                </Button>
                <Button
                  onClick={() => {
                    alert('Все предметы отсортированы!')
                  }}
                  className="w-full pixel-button text-sm"
                >
                  📦 Сортировать
                </Button>
                <Button
                  onClick={() => {
                    const totalValue = inventory.reduce((sum, item) => sum + item.quantity * 10, 0)
                    alert(`Общая стоимость инвентаря: ${totalValue} золотых`)
                  }}
                  className="w-full pixel-button text-sm"
                >
                  💰 Оценить
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventorySystem