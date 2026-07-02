'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

type Lesson = {
  id: number;
  title: string;
  emoji: string;
  done: boolean;
  current?: boolean;
};

type Unit = {
  id: number;
  title: string;
  emoji: string;
  color: string;
  locked?: boolean;
  lessons: Lesson[];
};

export default function LearnPage() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem('playsmart_user_id');

    if (userId) {
      supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .then(({ data }) => {
          if (data) setCompleted(data.map((d: any) => d.lesson_id));
        });

      supabase
        .from('user_stats')
        .select('xp, streak')
        .eq('user_id', userId)
        .single()
        .then(({ data }) => {
          if (data) {
            setXp(data.xp);
            setStreak(data.streak);
          }
        });
    } else {
      const c = JSON.parse(localStorage.getItem('playsmart_completed') || '[]');
      const x = parseInt(localStorage.getItem('playsmart_xp') || '0');
      const s = parseInt(localStorage.getItem('playsmart_streak') || '0');
      setCompleted(c);
      setXp(x);
      setStreak(s);
    }
  }, []);

  const allLessons = [1, 2, 3, 4, 5, 6, 7, 8];
  const firstIncomplete = allLessons.find(id => !completed.includes(id));

  const units: Unit[] = [
    {
      id: 1, title: 'What is Football?', emoji: '⚽',
      color: 'from-green-400 to-green-600', locked: false,
      lessons: [
        { id: 1, title: 'The Football Pitch', emoji: '🟩', done: completed.includes(1), current: firstIncomplete === 1 },
        { id: 2, title: 'The Football', emoji: '⚽', done: completed.includes(2), current: firstIncomplete === 2 },
        { id: 3, title: 'The Goal', emoji: '🥅', done: completed.includes(3), current: firstIncomplete === 3 },
        { id: 4, title: 'How to Score', emoji: '🎯', done: completed.includes(4), current: firstIncomplete === 4 },
      ]
    },
    {
      id: 2, title: 'The Players', emoji: '👕',
      color: 'from-blue-400 to-blue-600', locked: false,
      lessons: [
        { id: 5, title: 'The Goalkeeper', emoji: '🧤', done: completed.includes(5), current: firstIncomplete === 5 },
        { id: 6, title: 'Defenders', emoji: '🛡️', done: completed.includes(6), current: firstIncomplete === 6 },
        { id: 7, title: 'Midfielders', emoji: '🔄', done: completed.includes(7), current: firstIncomplete === 7 },
        { id: 8, title: 'Forwards', emoji: '⚡', done: completed.includes(8), current: firstIncomplete === 8 },
      ]
    },
    {
      id: 3, title: 'The Rules', emoji: '📋',
      color: 'from-purple-400 to-purple-600', locked: true,
      lessons: [
        { id: 9, title: 'Offside Rule', emoji: '🚩', done: false },
        { id: 10, title: 'Fouls & Cards', emoji: '🟨', done: false },
        { id: 11, title: 'Free Kicks', emoji: '🦶', done: false },
        { id: 12, title: 'Penalties', emoji: '🎯', done: false },
      ]
    },
    {
      id: 4, title: 'Famous Players', emoji: '⭐',
      color: 'from-yellow-400 to-orange-500', locked: true,
      lessons: [
        { id: 13, title: 'Lionel Messi', emoji: '🇦🇷', done: false },
        { id: 14, title: 'Cristiano Ronaldo', emoji: '🇵🇹', done: false },
        { id: 15, title: 'Kylian Mbappé', emoji: '🇫🇷', done: false },
        { id: 16, title: 'Erling Haaland', emoji: '🇳🇴', done: false },
      ]
    },
  ];

  const totalLessons = 16;
  const completedCount = completed.length;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <span className="text-lg font-black text-orange-400">PlaySmart</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 font-black px-3 py-1.5 rounded-full text-sm">🔥 {streak}</div>
          <div className="flex items-center gap-1 bg-purple-500/20 text-purple-400 font-black px-3 py-1.5 rounded-full text-sm">⭐ {xp} XP</div>
          <div className="flex items-center gap-1 bg-red-500/20 text-red-400 font-black px-3 py-1.5 rounded-full text-sm">❤️ 5</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            { emoji: '⚽', label: 'Football', active: true },
            { emoji: '🏏', label: 'Cricket', active: false },
            { emoji: '🏀', label: 'Basketball', active: false },
          ].map((sport) => (
            <button key={sport.label} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition ${sport.active ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {sport.emoji} {sport.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-bold text-sm">⚽ Football Journey</span>
            <span className="text-orange-400 font-black text-sm">{completedCount}/{totalLessons} lessons</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${(completedCount / totalLessons) * 100}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {units.map((unit) => (
            <div key={unit.id}>
              <div className={`bg-gradient-to-r ${unit.color} rounded-2xl p-4 mb-4 flex items-center justify-between ${unit.locked ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{unit.emoji}</span>
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-wide">Unit {unit.id}</p>
                    <p className="text-white font-black text-lg">{unit.title}</p>
                  </div>
                </div>
                {unit.locked ? (
                  <span className="text-2xl">🔒</span>
                ) : (
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{unit.lessons.length} lessons</span>
                )}
              </div>

              {!unit.locked && (
                <div className="flex flex-col items-center gap-4">
                  {unit.lessons.map((lesson, i) => (
                    <div key={lesson.id} className="flex flex-col items-center">
                      {i > 0 && <div className="w-0.5 h-6 bg-gray-700" />}
                      <Link
                        href={lesson.done || lesson.current ? `/learn/lesson/${lesson.id}` : '#'}
                        className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 transition hover:scale-110 ${
                          lesson.done ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/30'
                          : lesson.current ? 'bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/50 animate-pulse'
                          : 'bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-3xl">{lesson.done ? '✅' : lesson.emoji}</span>
                        {lesson.current && (
                          <div className="absolute -top-8 bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-full whitespace-nowrap">
                            START HERE!
                          </div>
                        )}
                      </Link>
                      <p className={`text-xs font-bold text-center mt-2 max-w-[80px] ${lesson.current ? 'text-orange-400' : lesson.done ? 'text-green-400' : 'text-gray-600'}`}>
                        {lesson.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}