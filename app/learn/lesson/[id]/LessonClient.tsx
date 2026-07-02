'use client';
import { useState } from 'react';
import Link from 'next/link';

const lessons: Record<number, {
  title: string;
  emoji: string;
  slides: { heading: string; content: string; visual: string }[];
  quiz: { question: string; options: string[]; correct: number; explanation: string }[];
}> = {
  3: {
    title: 'The Goal',
    emoji: '🥅',
    slides: [
      { heading: 'What is a Goal?', content: 'A goal is how teams score points in football! When the ball crosses the goal line inside the net, that\'s a GOAL! 🎉', visual: '🥅' },
      { heading: 'How Big is a Goal?', content: 'A football goal is 7.32 metres wide and 2.44 metres tall. That\'s about as wide as a big car and taller than most adults!', visual: '📏' },
      { heading: 'Who Protects the Goal?', content: 'The GOALKEEPER is the special player who protects the goal. They are the only player allowed to use their hands!', visual: '🧤' },
      { heading: 'How Do You Score?', content: 'You can score with your feet, head, or any part of your body EXCEPT your hands and arms (unless you\'re the goalkeeper)!', visual: '⚽' },
    ],
    quiz: [
      { question: 'What happens when the ball goes into the net?', options: ['A foul is called', 'A GOAL is scored! 🎉', 'The game stops forever', 'Nothing happens'], correct: 1, explanation: 'That\'s right! When the ball crosses the goal line inside the net, a goal is scored!' },
      { question: 'Who is allowed to use their hands in football?', options: ['Everyone!', 'No one', 'The Goalkeeper 🧤', 'The Captain'], correct: 2, explanation: 'The Goalkeeper is the only player who can use their hands to stop the ball!' },
      { question: 'Can you score a goal with your head?', options: ['No, never!', 'Yes! Headers count! ⚽', 'Only on Tuesdays', 'Only the captain can'], correct: 1, explanation: 'Yes! You can score with your head — it\'s called a header and it\'s very exciting!' },
    ]
  }
};

export default function LessonClient({ id }: { id: string }) {
  const lessonId = parseInt(id);
  const lesson = lessons[lessonId];

  const [phase, setPhase] = useState<'slides' | 'quiz' | 'complete'>('slides');
  const [slideIndex, setSlideIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!lesson) return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-gray-400">This lesson isn't available yet!</p>
        <Link href="/learn" className="text-orange-400 font-bold mt-4 inline-block">← Back to lessons</Link>
      </div>
    </main>
  );

  const totalSteps = lesson.slides.length + lesson.quiz.length;
  const currentStep = phase === 'slides' ? slideIndex : phase === 'quiz' ? lesson.slides.length + quizIndex : totalSteps;
  const progress = Math.round((currentStep / totalSteps) * 100);

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    if (index === lesson.quiz[quizIndex].correct) setCorrect(c => c + 1);
  };

  const nextQuiz = () => {
    setSelected(null);
    setShowExplanation(false);
    if (quizIndex + 1 < lesson.quiz.length) {
      setQuizIndex(q => q + 1);
    } else {
      setPhase('complete');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/learn" className="text-gray-400 hover:text-white text-xl">✕</Link>
        <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-red-400 font-black text-sm">❤️ 5</div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 flex flex-col">

        {phase === 'slides' && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
              <div className="text-9xl animate-bounce">{lesson.slides[slideIndex].visual}</div>
              <h2 className="text-3xl font-black text-white">{lesson.slides[slideIndex].heading}</h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">{lesson.slides[slideIndex].content}</p>
            </div>
            <button
              onClick={() => slideIndex + 1 < lesson.slides.length ? setSlideIndex(s => s + 1) : setPhase('quiz')}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-4 rounded-2xl text-xl transition mt-6"
            >
              {slideIndex + 1 < lesson.slides.length ? 'Next →' : 'Start Quiz! 🧠'}
            </button>
          </div>
        )}

        {phase === 'quiz' && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <p className="text-orange-400 font-bold text-sm uppercase tracking-wide mb-2">Question {quizIndex + 1} of {lesson.quiz.length}</p>
              <h2 className="text-2xl font-black text-white">{lesson.quiz[quizIndex].question}</h2>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {lesson.quiz[quizIndex].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base transition ${
                    selected === null ? 'border-gray-700 bg-gray-800 hover:border-orange-500 hover:bg-gray-700'
                    : i === lesson.quiz[quizIndex].correct ? 'border-green-400 bg-green-500/20 text-green-400'
                    : selected === i ? 'border-red-400 bg-red-500/20 text-red-400'
                    : 'border-gray-700 bg-gray-800 opacity-50'
                  }`}
                >
                  <span className="mr-3">{['🅰️', '🅱️', '🅲', '🅳'][i]}</span>
                  {option}
                </button>
              ))}
            </div>
            {showExplanation && (
              <div className={`mt-4 p-4 rounded-2xl ${selected === lesson.quiz[quizIndex].correct ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                <p className={`font-black text-lg mb-1 ${selected === lesson.quiz[quizIndex].correct ? 'text-green-400' : 'text-red-400'}`}>
                  {selected === lesson.quiz[quizIndex].correct ? '✅ Correct! Amazing!' : '❌ Not quite!'}
                </p>
                <p className="text-gray-300 text-sm">{lesson.quiz[quizIndex].explanation}</p>
                <button onClick={nextQuiz} className="mt-3 w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl transition">
                  {quizIndex + 1 < lesson.quiz.length ? 'Next Question →' : 'Finish! 🎉'}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'complete' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            <div className="text-8xl animate-bounce">🏆</div>
            <h2 className="text-4xl font-black text-white">Lesson Complete!</h2>
            <p className="text-gray-400 text-lg">You got {correct}/{lesson.quiz.length} questions right!</p>
            <div className="flex gap-4 flex-wrap justify-center">
              <div className="bg-yellow-500/20 text-yellow-400 font-black px-6 py-3 rounded-2xl">⭐ +50 XP</div>
              <div className="bg-green-500/20 text-green-400 font-black px-6 py-3 rounded-2xl">🔥 Streak +1</div>
              {correct === lesson.quiz.length && (
                <div className="bg-purple-500/20 text-purple-400 font-black px-6 py-3 rounded-2xl">🏅 Perfect Score!</div>
              )}
            </div>
            <Link href="/learn" className="bg-orange-500 hover:bg-orange-400 text-white font-black px-10 py-4 rounded-2xl text-xl transition">
              Continue Learning →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}