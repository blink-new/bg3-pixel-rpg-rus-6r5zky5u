import React from 'react'

interface MainMenuProps {
  onStartGame: () => void
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-700 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 text-center fade-in">
        {/* Game Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-amber-200 mb-4 pixel-glow">
          ВРАТА БАЛДУРА
        </h1>
        <h2 className="text-xl md:text-2xl text-amber-300 mb-8">
          Пиксельное Приключение
        </h2>

        {/* Subtitle */}
        <p className="text-amber-400 mb-12 max-w-2xl mx-auto px-4 text-sm leading-relaxed">
          Отправляйтесь в эпическое путешествие с легендарными героями. 
          Используйте магию D&D, стройте отношения и сражайтесь за судьбу мира.
        </p>

        {/* Menu Options */}
        <div className="space-y-4 mb-8">
          <button 
            onClick={onStartGame}
            className="pixel-button text-lg px-8 py-4 w-64 block mx-auto interactive"
            style={{ touchAction: 'manipulation' }}
          >
            НОВАЯ ИГРА
          </button>
          
          <button 
            className="pixel-button text-lg px-8 py-4 w-64 opacity-50 cursor-not-allowed block mx-auto"
            disabled
          >
            ЗАГРУЗИТЬ ИГРУ
          </button>
          
          <button 
            className="pixel-button text-lg px-8 py-4 w-64 opacity-50 cursor-not-allowed block mx-auto"
            disabled
          >
            НАСТРОЙКИ
          </button>
        </div>

        {/* Character Preview */}
        <div className="flex justify-center flex-wrap gap-4 mb-8 px-4">
          {[
            { name: 'Астарион', color: 'bg-red-600' },
            { name: 'Гейл', color: 'bg-purple-600' },
            { name: 'Лаэзель', color: 'bg-green-600' },
            { name: 'Уилл', color: 'bg-blue-600' },
            { name: 'Шэдоухарт', color: 'bg-gray-600' },
            { name: 'Карлах', color: 'bg-orange-600' },
            { name: 'Минск', color: 'bg-yellow-600' }
          ].map((char, index) => (
            <div key={char.name} className="text-center">
              <div 
                className={`character-portrait ${char.color} mb-2 interactive`}
                style={{ touchAction: 'manipulation' }}
              >
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {char.name[0]}
                </div>
              </div>
              <p className="text-amber-300 text-xs">{char.name}</p>
            </div>
          ))}
        </div>

        {/* Version info */}
        <p className="text-amber-600 text-xs">
          Версия 1.0 • Создано с помощью Blink
        </p>
      </div>
    </div>
  )
}

export default MainMenu