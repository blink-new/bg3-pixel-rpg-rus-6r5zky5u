import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface DialogueSystemProps {
  character: any
  party: any[]
  onBack: () => void
  onUpdateParty: (party: any[]) => void
}

interface DialogueOption {
  text: string
  type: 'normal' | 'skill' | 'romance'
  skill?: string
  difficulty?: number
  consequence?: string
}

const DialogueSystem: React.FC<DialogueSystemProps> = ({ character, party, onBack, onUpdateParty }) => {
  const [currentSpeaker, setCurrentSpeaker] = useState('astarion')
  const [dialogueHistory, setDialogueHistory] = useState<string[]>([])
  const [currentDialogue, setCurrentDialogue] = useState(0)

  const dialogues = {
    astarion: [
      {
        speaker: 'Астарион',
        text: 'Ну что ж, похоже мы оба выжили после крушения. Как... удачно.',
        options: [
          { text: 'Ты тоже был на корабле?', type: 'normal' as const },
          { text: '[Проницательность] Ты что-то скрываешь.', type: 'skill' as const, skill: 'wisdom', difficulty: 15 },
          { text: 'Рад видеть знакомое лицо.', type: 'romance' as const }
        ]
      },
      {
        speaker: 'Астарион',
        text: 'Да, меня тоже схватили эти мерзкие иллитиды. Но теперь у нас есть более серьёзная проблема - эти червяки в наших головах.',
        options: [
          { text: 'Мы должны найти лекарство.', type: 'normal' as const },
          { text: '[Медицина] Может, я смогу помочь.', type: 'skill' as const, skill: 'wisdom', difficulty: 12 },
          { text: 'Мы справимся вместе.', type: 'romance' as const }
        ]
      }
    ],
    gale: [
      {
        speaker: 'Гейл',
        text: 'Приветствую! Гейл из Уотердипа, к вашим услугам. Вижу, вы тоже пострадали от иллитидов.',
        options: [
          { text: 'Расскажи о себе.', type: 'normal' as const },
          { text: '[Магия] Чувствую в тебе мощную магию.', type: 'skill' as const, skill: 'intelligence', difficulty: 13 },
          { text: 'Твоя эрудиция впечатляет.', type: 'romance' as const }
        ]
      }
    ]
  }

  const speakers = {
    astarion: { name: 'Астарион', color: 'bg-red-600', description: 'Эльф-вампир с загадочным прошлым' },
    gale: { name: 'Гейл', color: 'bg-purple-600', description: 'Волшебник из Уотердипа' },
    shadowheart: { name: 'Шэдоухарт', color: 'bg-gray-600', description: 'Жрица Шар' },
    laezel: { name: 'Лаэзель', color: 'bg-green-600', description: 'Воин гитьянки' },
    wyll: { name: 'Уилл', color: 'bg-blue-600', description: 'Клинок Границ' },
    karlach: { name: 'Карлах', color: 'bg-orange-600', description: 'Тифлинг-варвар' },
    minsc: { name: 'Минск', color: 'bg-yellow-600', description: 'Рейнджер с хомяком' }
  }

  const currentSpeakerData = speakers[currentSpeaker as keyof typeof speakers]
  const currentDialogueData = dialogues[currentSpeaker as keyof typeof dialogues]?.[currentDialogue]

  const rollD20 = () => Math.floor(Math.random() * 20) + 1

  const getModifier = (stat: number) => Math.floor((stat - 10) / 2)

  const handleOptionClick = (option: DialogueOption) => {
    let success = true
    let rollResult = ''

    if (option.type === 'skill') {
      const roll = rollD20()
      const statValue = character.stats[option.skill as keyof typeof character.stats] || 10
      const modifier = getModifier(statValue)
      const total = roll + modifier
      success = total >= (option.difficulty || 15)
      
      rollResult = `Бросок ${option.skill}: ${roll} + ${modifier} = ${total} ${success ? '(Успех)' : '(Провал)'}`
    }

    // Add to dialogue history
    const newHistory = [
      ...dialogueHistory,
      `Вы: ${option.text}`,
      ...(rollResult ? [rollResult] : [])
    ]

    if (option.type === 'romance' || (option.type === 'skill' && success)) {
      // Improve relationship
      const updatedParty = party.map(member => {
        if (member.id === currentSpeaker) {
          return {
            ...member,
            relationship: Math.min(100, (member.relationship || 0) + 5)
          }
        }
        return member
      })
      onUpdateParty(updatedParty)
    }

    setDialogueHistory(newHistory)
    
    // Move to next dialogue or end
    if (currentDialogue < (currentDialogueData ? dialogues[currentSpeaker as keyof typeof dialogues].length - 1 : 0)) {
      setCurrentDialogue(currentDialogue + 1)
    }
  }

  const switchSpeaker = (speakerId: string) => {
    setCurrentSpeaker(speakerId)
    setCurrentDialogue(0)
    setDialogueHistory([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-200 pixel-glow">ДИАЛОГИ</h1>
          <Button onClick={onBack} className="pixel-button">
            ← НАЗАД
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Character Selection */}
          <Card className="pixel-panel">
            <h2 className="text-lg text-amber-200 mb-4">Выберите собеседника</h2>
            <div className="space-y-2">
              {Object.entries(speakers).map(([id, speaker]) => (
                <button
                  key={id}
                  onClick={() => switchSpeaker(id)}
                  className={`w-full p-3 border-2 transition-all duration-200 ${
                    currentSpeaker === id
                      ? 'border-amber-400 bg-amber-700'
                      : 'border-amber-600 bg-amber-800 hover:bg-amber-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${speaker.color} border border-amber-500`}></div>
                    <div className="text-left">
                      <p className="text-amber-100 text-sm font-bold">{speaker.name}</p>
                      <p className="text-amber-400 text-xs">{speaker.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Main Dialogue */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current Speaker */}
            <Card className="pixel-panel">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`character-portrait ${currentSpeakerData.color}`}>
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {currentSpeakerData.name[0]}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl text-amber-200 font-bold">{currentSpeakerData.name}</h2>
                  <p className="text-amber-400 text-sm">{currentSpeakerData.description}</p>
                  {party.find(p => p.id === currentSpeaker)?.relationship !== undefined && (
                    <p className="text-amber-300 text-sm">
                      Отношения: {party.find(p => p.id === currentSpeaker)?.relationship || 0}/100
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Dialogue History */}
            {dialogueHistory.length > 0 && (
              <Card className="pixel-panel">
                <h3 className="text-lg text-amber-200 mb-3">История диалога</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {dialogueHistory.map((line, index) => (
                    <p key={index} className={`text-sm ${
                      line.startsWith('Вы:') ? 'text-amber-200' : 
                      line.includes('Бросок') ? 'text-amber-400 italic' : 'text-amber-300'
                    }`}>
                      {line}
                    </p>
                  ))}
                </div>
              </Card>
            )}

            {/* Current Dialogue */}
            {currentDialogueData && (
              <Card className="dialogue-box">
                <div className="mb-6">
                  <p className="text-amber-100 text-lg leading-relaxed">
                    <span className="font-bold text-amber-200">{currentDialogueData.speaker}:</span>
                    <br />
                    "{currentDialogueData.text}"
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-amber-200 font-bold">Варианты ответа:</h3>
                  {currentDialogueData.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className={`w-full text-left p-4 h-auto transition-all duration-200 ${
                        option.type === 'skill' ? 'border-l-4 border-blue-500 bg-blue-900/20' :
                        option.type === 'romance' ? 'border-l-4 border-pink-500 bg-pink-900/20' :
                        'pixel-button'
                      }`}
                    >
                      <div>
                        <p className="font-bold mb-1">{option.text}</p>
                        {option.type === 'skill' && (
                          <p className="text-xs opacity-75">
                            Проверка {option.skill} (Сложность: {option.difficulty})
                          </p>
                        )}
                        {option.type === 'romance' && (
                          <p className="text-xs opacity-75 text-pink-300">
                            💕 Романтический вариант
                          </p>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* No dialogue available */}
            {!currentDialogueData && (
              <Card className="pixel-panel text-center py-8">
                <p className="text-amber-300">
                  Диалоги с {currentSpeakerData.name} пока недоступны.
                </p>
                <p className="text-amber-400 text-sm mt-2">
                  Попробуйте поговорить с другими персонажами или продолжите исследование.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DialogueSystem