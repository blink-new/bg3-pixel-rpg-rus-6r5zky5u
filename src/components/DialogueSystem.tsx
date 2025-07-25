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
  type: 'normal' | 'skill' | 'romance' | 'intimidation' | 'persuasion'
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
        text: 'Ну что ж, похоже мы оба выжили после крушения. Как... удачно. Меня зовут Астарион.',
        options: [
          { text: 'Ты тоже был на корабле?', type: 'normal' as const },
          { text: '[Проницательность] Ты что-то скрываешь.', type: 'skill' as const, skill: 'wisdom', difficulty: 15 },
          { text: 'Рад видеть знакомое лицо.', type: 'romance' as const },
          { text: '[Запугивание] Говори правду, или пожалеешь!', type: 'intimidation' as const, skill: 'charisma', difficulty: 12 }
        ]
      },
      {
        speaker: 'Астарион',
        text: 'Да, меня тоже схватили эти мерзкие иллитиды. Но теперь у нас есть более серьёзная проблема - эти червяки в наших головах. Нам нужно найти лекарство, и быстро.',
        options: [
          { text: 'Мы должны найти лекарство.', type: 'normal' as const },
          { text: '[Медицина] Может, я смогу помочь.', type: 'skill' as const, skill: 'wisdom', difficulty: 12 },
          { text: 'Мы справимся вместе.', type: 'romance' as const },
          { text: '[Убеждение] Доверься мне, у меня есть план.', type: 'persuasion' as const, skill: 'charisma', difficulty: 13 }
        ]
      },
      {
        speaker: 'Астарион',
        text: 'Знаешь, дорогой, я должен признаться... Я вампир. Но не волнуйся, я не собираюсь тебя кусать. Пока что.',
        options: [
          { text: 'Вампир?! Держись от меня подальше!', type: 'normal' as const },
          { text: '[Религия] Расскажи о своём проклятии.', type: 'skill' as const, skill: 'intelligence', difficulty: 14 },
          { text: 'Это не меняет того, что ты мой спутник.', type: 'romance' as const },
          { text: '[Запугивание] Попробуй только укусить меня!', type: 'intimidation' as const, skill: 'strength', difficulty: 16 }
        ]
      }
    ],
    gale: [
      {
        speaker: 'Гейл',
        text: 'Приветствую! Гейл из Уотердипа, к вашим услугам. Вижу, вы тоже пострадали от иллитидов. Весьма неприятная ситуация.',
        options: [
          { text: 'Расскажи о себе.', type: 'normal' as const },
          { text: '[Магия] Чувствую в тебе мощную магию.', type: 'skill' as const, skill: 'intelligence', difficulty: 13 },
          { text: 'Твоя эрудиция впечатляет.', type: 'romance' as const },
          { text: '[Убеждение] Нам нужна твоя помощь.', type: 'persuasion' as const, skill: 'charisma', difficulty: 11 }
        ]
      },
      {
        speaker: 'Гейл',
        text: 'Я волшебник, специализируюсь на школе Воплощения. Хотя должен признать, у меня есть... особая проблема. Магическая бомба в груди, оставленная Мистрой.',
        options: [
          { text: 'Магическая бомба? Это опасно!', type: 'normal' as const },
          { text: '[Магия] Как это произошло?', type: 'skill' as const, skill: 'intelligence', difficulty: 15 },
          { text: 'Мы найдём способ тебе помочь.', type: 'romance' as const },
          { text: '[Запугивание] Ты подвергаешь нас всех опасности!', type: 'intimidation' as const, skill: 'charisma', difficulty: 14 }
        ]
      }
    ],
    shadowheart: [
      {
        speaker: 'Шэдоухарт',
        text: 'Я Шэдоухарт, жрица Шар. Не ожидай от меня дружелюбия - у меня есть важная миссия.',
        options: [
          { text: 'Какая миссия?', type: 'normal' as const },
          { text: '[Религия] Шар - богиня тьмы и потерь.', type: 'skill' as const, skill: 'intelligence', difficulty: 12 },
          { text: 'Возможно, мы могли бы помочь друг другу.', type: 'romance' as const },
          { text: '[Убеждение] Нам лучше работать вместе.', type: 'persuasion' as const, skill: 'charisma', difficulty: 13 }
        ]
      },
      {
        speaker: 'Шэдоухарт',
        text: 'У меня есть артефакт, который я должна доставить в Врата Балдура. Это всё, что тебе нужно знать.',
        options: [
          { text: 'Хорошо, не буду настаивать.', type: 'normal' as const },
          { text: '[Проницательность] Ты боишься чего-то.', type: 'skill' as const, skill: 'wisdom', difficulty: 16 },
          { text: 'Я доверяю тебе.', type: 'romance' as const },
          { text: '[Запугивание] Лучше расскажи всё сейчас!', type: 'intimidation' as const, skill: 'strength', difficulty: 15 }
        ]
      }
    ],
    laezel: [
      {
        speaker: 'Лаэзель',
        text: 'Истак! Ты тоже заражён цереброзом. Мы должны найти зит\'янки креш и очиститься, пока не стало слишком поздно!',
        options: [
          { text: 'Что такое креш?', type: 'normal' as const },
          { text: '[История] Гитьянки - воины астрального плана.', type: 'skill' as const, skill: 'intelligence', difficulty: 14 },
          { text: 'Твоя решимость восхищает.', type: 'romance' as const },
          { text: '[Запугивание] Не приказывай мне!', type: 'intimidation' as const, skill: 'strength', difficulty: 17 }
        ]
      }
    ],
    wyll: [
      {
        speaker: 'Уилл',
        text: 'Уилл Рэйвенгард, Клинок Границ, к вашим услугам. Я защищаю невинных от демонов и дьяволов.',
        options: [
          { text: 'Клинок Границ?', type: 'normal' as const },
          { text: '[Религия] Ты заключил договор с дьяволом.', type: 'skill' as const, skill: 'intelligence', difficulty: 13 },
          { text: 'Благородная цель.', type: 'romance' as const },
          { text: '[Убеждение] Расскажи о своём прошлом.', type: 'persuasion' as const, skill: 'charisma', difficulty: 12 }
        ]
      }
    ],
    karlach: [
      {
        speaker: 'Карлах',
        text: 'Эй, солдат! Карлах! Только что сбежала из Авернуса. Чёртов Зариэль превратила меня в боевую машину!',
        options: [
          { text: 'Авернус? Первый слой Ада?', type: 'normal' as const },
          { text: '[Планы] Расскажи об Авернусе.', type: 'skill' as const, skill: 'intelligence', difficulty: 15 },
          { text: 'Рада, что ты на свободе.', type: 'romance' as const },
          { text: '[Убеждение] Мы поможем тебе отомстить.', type: 'persuasion' as const, skill: 'charisma', difficulty: 11 }
        ]
      }
    ],
    minsc: [
      {
        speaker: 'Минск',
        text: 'Минск и Бу приветствуют тебя! Мы готовы сражаться со злом, где бы оно ни пряталось!',
        options: [
          { text: 'Кто такой Бу?', type: 'normal' as const },
          { text: '[Обращение с животными] Привет, Бу!', type: 'skill' as const, skill: 'wisdom', difficulty: 10 },
          { text: 'Ты настоящий герой, Минск.', type: 'romance' as const },
          { text: '[Убеждение] Присоединяйся к нам!', type: 'persuasion' as const, skill: 'charisma', difficulty: 8 }
        ]
      }
    ],
    halsin: [
      {
        speaker: 'Халсин',
        text: 'Природа благословила нашу встречу. Я Халсин, архидруид этой рощи. Вижу, тебя тоже коснулась тень цереброзов.',
        options: [
          { text: 'Можешь ли ты нам помочь?', type: 'normal' as const },
          { text: '[Природа] Роща в опасности.', type: 'skill' as const, skill: 'wisdom', difficulty: 12 },
          { text: 'Твоя мудрость впечатляет.', type: 'romance' as const },
          { text: '[Убеждение] Нам нужен твой совет.', type: 'persuasion' as const, skill: 'charisma', difficulty: 11 }
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
    minsc: { name: 'Минск', color: 'bg-yellow-600', description: 'Рейнджер с хомяком' },
    halsin: { name: 'Халсин', color: 'bg-emerald-600', description: 'Архидруид' }
  }

  const currentSpeakerData = speakers[currentSpeaker as keyof typeof speakers]
  const currentDialogueData = dialogues[currentSpeaker as keyof typeof dialogues]?.[currentDialogue]

  const rollD20 = () => Math.floor(Math.random() * 20) + 1

  const getModifier = (stat: number) => Math.floor((stat - 10) / 2)

  const getPositiveResponse = (speaker: string, type: string) => {
    const responses = {
      astarion: type === 'romance' ? 'Какой очаровательный ответ, дорогой.' : 'Впечатляющая проницательность.',
      gale: type === 'romance' ? 'Ваша доброта согревает моё сердце.' : 'Превосходное понимание магии!',
      shadowheart: type === 'romance' ? 'Возможно, ты не так плох, как остальные.' : 'Хм, неожиданно мудро.',
      laezel: type === 'romance' ? 'Ты показываешь силу духа.' : 'Достойный воин понимает стратегию.',
      wyll: type === 'romance' ? 'Благородные слова от благородного сердца.' : 'Мудрый совет.',
      karlach: type === 'romance' ? 'Эй, ты не так уж плох!' : 'Отличная идея, солдат!',
      minsc: type === 'romance' ? 'Бу одобряет твою доброту!' : 'Минск и Бу впечатлены!',
      halsin: type === 'romance' ? 'Природа благословила тебя мудростью.' : 'Ты понимаешь баланс.'
    }
    return responses[speaker as keyof typeof responses] || 'Интересно...'
  }

  const getIntimidationResponse = (speaker: string, success: boolean) => {
    if (success) {
      const responses = {
        astarion: 'Ох, какой грозный! Хорошо, хорошо...',
        gale: 'Нет нужды в угрозах, друг мой.',
        shadowheart: 'Тьма научила меня не бояться угроз.',
        laezel: 'Ха! Попробуй запугать воина гитьянки!',
        wyll: 'Я видел демонов страшнее тебя.',
        karlach: 'Серьёзно? После Авернуса?',
        minsc: 'Бу говорит, что ты не так страшен.',
        halsin: 'Природа не терпит агрессии без причины.'
      }
      return responses[speaker as keyof typeof responses] || 'Хм, понятно...'
    } else {
      return 'Твои угрозы меня не пугают.'
    }
  }

  const getFailureResponse = (speaker: string) => {
    const responses = {
      astarion: 'Милый, но ты ошибаешься.',
      gale: 'Боюсь, это не совсем так.',
      shadowheart: 'Ты не понимаешь.',
      laezel: 'Твоё невежество очевидно.',
      wyll: 'Не совсем правильно, друг.',
      karlach: 'Не-а, солдат.',
      minsc: 'Бу качает головой.',
      halsin: 'Природа учит нас терпению.'
    }
    return responses[speaker as keyof typeof responses] || 'Не думаю, что это так.'
  }

  const getNeutralResponse = (speaker: string) => {
    const responses = {
      astarion: 'Понятно.',
      gale: 'Интересная точка зрения.',
      shadowheart: 'Хм.',
      laezel: 'Приемлемо.',
      wyll: 'Понимаю.',
      karlach: 'Ага.',
      minsc: 'Бу кивает.',
      halsin: 'Мудрые слова.'
    }
    return responses[speaker as keyof typeof responses] || 'Понятно.'
  }

  const handleOptionClick = (option: DialogueOption) => {
    let success = true
    let rollResult = ''

    if (option.type === 'skill' || option.type === 'intimidation' || option.type === 'persuasion') {
      const roll = rollD20()
      const statValue = character.stats[option.skill as keyof typeof character.stats] || 10
      const modifier = getModifier(statValue)
      const total = roll + modifier
      success = total >= (option.difficulty || 15)
      
      const skillName = option.type === 'intimidation' ? 'Запугивание' : 
                       option.type === 'persuasion' ? 'Убеждение' : 
                       option.skill
      rollResult = `Бросок ${skillName}: ${roll} + ${modifier} = ${total} ${success ? '(Успех)' : '(Провал)'}`
    }

    // Add to dialogue history
    const newHistory = [
      ...dialogueHistory,
      `Вы: ${option.text}`,
      ...(rollResult ? [rollResult] : [])
    ]

    // Determine response based on success/failure
    let response = ''
    if (option.type === 'romance' || (option.type === 'skill' && success) || 
        (option.type === 'persuasion' && success)) {
      response = getPositiveResponse(currentSpeaker, option.type)
      // Improve relationship
      const updatedParty = party.map(member => {
        if (member.id === currentSpeaker) {
          return {
            ...member,
            relationship: Math.min(100, (member.relationship || 0) + 10)
          }
        }
        return member
      })
      onUpdateParty(updatedParty)
    } else if (option.type === 'intimidation') {
      if (success) {
        response = getIntimidationResponse(currentSpeaker, true)
      } else {
        response = getIntimidationResponse(currentSpeaker, false)
        // Worsen relationship on failed intimidation
        const updatedParty = party.map(member => {
          if (member.id === currentSpeaker) {
            return {
              ...member,
              relationship: Math.max(-100, (member.relationship || 0) - 15)
            }
          }
          return member
        })
        onUpdateParty(updatedParty)
      }
    } else if (option.type === 'skill' && !success) {
      response = getFailureResponse(currentSpeaker)
    } else {
      response = getNeutralResponse(currentSpeaker)
    }

    newHistory.push(`${currentSpeakerData.name}: ${response}`)
    setDialogueHistory(newHistory)
    
    // Move to next dialogue or end
    if (currentDialogue < (currentDialogueData ? dialogues[currentSpeaker as keyof typeof dialogues].length - 1 : 0)) {
      setTimeout(() => setCurrentDialogue(currentDialogue + 1), 1500)
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
              {Object.entries(speakers).map(([id, speaker]) => {
                const partyMember = party.find(p => p.id === id)
                const relationship = partyMember?.relationship || 0
                
                return (
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
                      <div className="text-left flex-1">
                        <p className="text-amber-100 text-sm font-bold">{speaker.name}</p>
                        <p className="text-amber-400 text-xs">{speaker.description}</p>
                        {partyMember && (
                          <div className="flex items-center mt-1">
                            <div className="w-12 h-1 bg-amber-900 border border-amber-600">
                              <div 
                                className={`h-full ${
                                  relationship >= 50 ? 'bg-green-500' :
                                  relationship >= 0 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.abs(relationship)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-amber-400 ml-1">{relationship}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
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
                        option.type === 'intimidation' ? 'border-l-4 border-red-500 bg-red-900/20' :
                        option.type === 'persuasion' ? 'border-l-4 border-green-500 bg-green-900/20' :
                        'pixel-button'
                      }`}
                    >
                      <div>
                        <p className="font-bold mb-1">{option.text}</p>
                        {option.type === 'skill' && (
                          <p className="text-xs opacity-75">
                            🎲 Проверка {option.skill} (Сложность: {option.difficulty})
                          </p>
                        )}
                        {option.type === 'romance' && (
                          <p className="text-xs opacity-75 text-pink-300">
                            💕 Романтический вариант
                          </p>
                        )}
                        {option.type === 'intimidation' && (
                          <p className="text-xs opacity-75 text-red-300">
                            😠 Запугивание (Сложность: {option.difficulty})
                          </p>
                        )}
                        {option.type === 'persuasion' && (
                          <p className="text-xs opacity-75 text-green-300">
                            🗣️ Убеждение (Сложность: {option.difficulty})
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