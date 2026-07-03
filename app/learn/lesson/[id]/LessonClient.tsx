'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';

const lessons: Record<number, {
  title: string;
  emoji: string;
  slides: { heading: string; content: string; visual: string }[];
  quiz: { question: string; options: string[]; correct: number; explanation: string }[];
}> = {
  1: {
    title: 'The Football Pitch',
    emoji: '🟩',
    slides: [
      { heading: 'Welcome to Football!', content: 'Football is the most popular sport in the world! Over 4 billion people love this amazing game. Let\'s start by learning about where it\'s played!', visual: '⚽' },
      { heading: 'What is a Pitch?', content: 'A football pitch is the big green field where the game is played. It\'s shaped like a rectangle and covered in grass!', visual: '🟩' },
      { heading: 'How Big is a Pitch?', content: 'A football pitch is about 100 metres long and 68 metres wide. That\'s bigger than 10 swimming pools put together!', visual: '📏' },
      { heading: 'Special Lines on the Pitch', content: 'The pitch has special white lines. The middle line splits the pitch in half. There are also penalty boxes near each goal!', visual: '⬜' },
    ],
    quiz: [
      { question: 'What shape is a football pitch?', options: ['Circle', 'Triangle', 'Rectangle 🟩', 'Hexagon'], correct: 2, explanation: 'A football pitch is shaped like a rectangle — long and wide!' },
      { question: 'What covers the football pitch?', options: ['Sand 🏖️', 'Grass 🌱', 'Ice ❄️', 'Mud'], correct: 1, explanation: 'Football pitches are covered in grass — that\'s why they\'re bright green!' },
      { question: 'What does the middle line do?', options: ['It\'s just for decoration', 'It splits the pitch in half ⚽', 'It marks where goals go', 'It shows where players sit'], correct: 1, explanation: 'The middle line splits the pitch into two halves — one for each team!' },
    ]
  },
  2: {
    title: 'The Football',
    emoji: '⚽',
    slides: [
      { heading: 'The Most Famous Ball!', content: 'The football is round and black and white. It\'s the most recognised sports ball in the entire world!', visual: '⚽' },
      { heading: 'What\'s Inside?', content: 'A football is made of leather on the outside and is filled with air on the inside. The air makes it bouncy and easy to kick!', visual: '💨' },
      { heading: 'How Heavy is it?', content: 'A football weighs about 450 grams — about the same as a big chocolate bar!', visual: '⚖️' },
      { heading: 'Black and White Pattern', content: 'The classic football has 32 panels — 20 white hexagons and 12 black pentagons sewn together!', visual: '🔵' },
    ],
    quiz: [
      { question: 'What shape is a football?', options: ['Square', 'Oval', 'Round ⚽', 'Triangle'], correct: 2, explanation: 'A football is perfectly round!' },
      { question: 'What is inside a football?', options: ['Water 💧', 'Sand', 'Air 💨', 'Cotton'], correct: 2, explanation: 'Footballs are filled with air — that\'s what makes them bounce!' },
      { question: 'How many panels does a classic football have?', options: ['10', '20', '32 ⚽', '50'], correct: 2, explanation: 'A classic football has 32 panels — 20 white and 12 black!' },
    ]
  },
  3: {
    title: 'The Goal',
    emoji: '🥅',
    slides: [
      { heading: 'What is a Goal?', content: 'A goal is how teams score points in football! When the ball crosses the goal line inside the net, that\'s a GOAL! 🎉', visual: '🥅' },
      { heading: 'How Big is a Goal?', content: 'A football goal is 7.32 metres wide and 2.44 metres tall. That\'s taller than most adults!', visual: '📏' },
      { heading: 'Who Protects the Goal?', content: 'The GOALKEEPER is the special player who protects the goal. They are the only player allowed to use their hands!', visual: '🧤' },
      { heading: 'How Do You Score?', content: 'You can score with your feet, head, or any part of your body EXCEPT your hands!', visual: '⚽' },
    ],
    quiz: [
      { question: 'What happens when the ball goes into the net?', options: ['A foul is called', 'A GOAL is scored! 🎉', 'The game stops forever', 'Nothing happens'], correct: 1, explanation: 'When the ball crosses the goal line inside the net, a goal is scored!' },
      { question: 'Who is allowed to use their hands in football?', options: ['Everyone!', 'No one', 'The Goalkeeper 🧤', 'The Captain'], correct: 2, explanation: 'The Goalkeeper is the only player who can use their hands!' },
      { question: 'Can you score a goal with your head?', options: ['No, never!', 'Yes! Headers count! ⚽', 'Only on Tuesdays', 'Only the captain can'], correct: 1, explanation: 'Yes! Scoring with your head is called a header!' },
    ]
  },
  4: {
    title: 'How to Score',
    emoji: '🎯',
    slides: [
      { heading: 'Scoring Goals!', content: 'The whole point of football is to score more goals than the other team! The team with the most goals at the end WINS! 🏆', visual: '🏆' },
      { heading: 'Shooting', content: 'To score, you need to SHOOT the ball into the goal. Players use the inside of their foot for accuracy!', visual: '🦶' },
      { heading: 'Headers', content: 'You can also score with your head! When a player jumps and hits the ball with their forehead, it\'s called a HEADER!', visual: '🤯' },
      { heading: 'Volleys', content: 'A VOLLEY is when you kick the ball before it hits the ground. Volleys can be incredibly powerful!', visual: '⚡' },
    ],
    quiz: [
      { question: 'How does a team win in football?', options: ['By running fastest', 'By scoring more goals 🏆', 'By having best uniforms', 'By biggest team'], correct: 1, explanation: 'The team that scores the most goals wins the match!' },
      { question: 'What is it called when you score with your head?', options: ['A volley', 'A header 🤯', 'A penalty', 'A free kick'], correct: 1, explanation: 'Scoring with your forehead is called a header!' },
      { question: 'What is a VOLLEY?', options: ['A type of pizza', 'Kicking before ball hits ground ⚡', 'A type of throw', 'Scoring from far away'], correct: 1, explanation: 'A volley is when you kick the ball before it touches the ground!' },
    ]
  },
  5: {
    title: 'The Goalkeeper',
    emoji: '🧤',
    slides: [
      { heading: 'The Last Line of Defence!', content: 'The Goalkeeper is the most unique player on the team. Their job is to stop the other team from scoring!', visual: '🧤' },
      { heading: 'Special Powers!', content: 'The goalkeeper is the ONLY player allowed to use their hands — but only inside the penalty box!', visual: '🙌' },
      { heading: 'What do Goalkeepers Wear?', content: 'Goalkeepers wear special gloves to help them catch and hold the ball. They also wear a different colour shirt!', visual: '🧤' },
      { heading: 'Famous Goalkeepers', content: 'Some of the most famous goalkeepers include Manuel Neuer, Alisson Becker and Gianluigi Buffon!', visual: '⭐' },
    ],
    quiz: [
      { question: 'What is special about the goalkeeper?', options: ['They score all goals', 'They can use their hands 🙌', 'They run the fastest', 'They wear no shoes'], correct: 1, explanation: 'The goalkeeper is the only player allowed to use their hands!' },
      { question: 'Where can the goalkeeper use their hands?', options: ['Everywhere', 'Nowhere', 'Inside the penalty box 🟦', 'Only at corners'], correct: 2, explanation: 'The goalkeeper can only use their hands inside their own penalty box!' },
      { question: 'Why do goalkeepers wear different coloured shirts?', options: ['It looks cool', 'So everyone can tell them apart 🧤', 'It makes them faster', 'Rules for scoring'], correct: 1, explanation: 'Goalkeepers wear a different colour so players and referees can identify them!' },
    ]
  },
  6: {
    title: 'Defenders',
    emoji: '🛡️',
    slides: [
      { heading: 'The Wall of Defence!', content: 'Defenders are players whose main job is to STOP the other team from scoring!', visual: '🛡️' },
      { heading: 'Types of Defenders', content: 'There are Centre-Backs in the middle and Full-Backs on the sides. Centre-backs are tall and strong, full-backs are fast!', visual: '↔️' },
      { heading: 'What do Defenders do?', content: 'Defenders tackle opponents, head away crosses, block shots and pass safely to teammates!', visual: '💪' },
      { heading: 'Famous Defenders', content: 'Virgil van Dijk, Sergio Ramos and Paolo Maldini are legendary defenders!', visual: '⭐' },
    ],
    quiz: [
      { question: 'What is the main job of a defender?', options: ['Score goals', 'Stop other team scoring 🛡️', 'Take corners', 'Referee the game'], correct: 1, explanation: 'Defenders main job is to prevent the opposition from scoring!' },
      { question: 'What are full-backs known for?', options: ['Being very tall', 'Being very fast ⚡', 'Having big hands', 'Scoring penalties'], correct: 1, explanation: 'Full-backs play on the sides and are usually very fast!' },
      { question: 'What does a defender do when the ball comes in from the side?', options: ['Run away', 'Head it away 🥅', 'Catch it', 'Sit down'], correct: 1, explanation: 'Defenders head away crosses to clear the danger!' },
    ]
  },
  7: {
    title: 'Midfielders',
    emoji: '🔄',
    slides: [
      { heading: 'The Engine of the Team!', content: 'Midfielders play in the MIDDLE of the pitch. They connect the defenders and the attackers!', visual: '🔄' },
      { heading: 'Types of Midfielders', content: 'There are defensive midfielders, central midfielders and attacking midfielders!', visual: '⚡' },
      { heading: 'What do Midfielders do?', content: 'Midfielders pass the ball, tackle opponents and often run over 10km in a single match!', visual: '🏃' },
      { heading: 'Famous Midfielders', content: 'Luka Modrić, Kevin De Bruyne and Andrea Pirlo are legendary midfielders!', visual: '⭐' },
    ],
    quiz: [
      { question: 'Where do midfielders play?', options: ['In goal', 'In the middle of the pitch 🔄', 'Only on the left side', 'Behind the goal'], correct: 1, explanation: 'Midfielders play in the middle, connecting defence and attack!' },
      { question: 'How far can a midfielder run in one match?', options: ['1 km', '5 km', 'Over 10 km 🏃', '50 km'], correct: 2, explanation: 'Midfielders can run over 10km in a single match!' },
      { question: 'What do attacking midfielders do?', options: ['Only defend', 'Create and score goals ⚽', 'Stand still', 'Only pass backwards'], correct: 1, explanation: 'Attacking midfielders create chances and score goals!' },
    ]
  },
  8: {
    title: 'Forwards',
    emoji: '⚡',
    slides: [
      { heading: 'The Goal Scorers!', content: 'Forwards have the most exciting job — SCORING GOALS! They play at the front of the team!', visual: '⚡' },
      { heading: 'Types of Forwards', content: 'Centre-forwards score most goals. Wingers play on the sides and are incredibly fast!', visual: '🏃' },
      { heading: 'Skills of a Forward', content: 'Forwards need great shooting, heading, speed and the ability to stay calm under pressure!', visual: '🎯' },
      { heading: 'Famous Forwards', content: 'Lionel Messi, Cristiano Ronaldo and Erling Haaland are the most famous forwards in the world!', visual: '⭐' },
    ],
    quiz: [
      { question: 'What is the main job of a forward?', options: ['Stop goals', 'Score goals ⚡', 'Take goal kicks', 'Referee decisions'], correct: 1, explanation: 'Forwards are the goal scorers!' },
      { question: 'What are wingers known for?', options: ['Being the tallest', 'Being incredibly fast 🏃', 'Having the best gloves', 'Standing still'], correct: 1, explanation: 'Wingers use their speed to beat defenders!' },
      { question: 'Which of these is a famous forward?', options: ['Manuel Neuer', 'Virgil van Dijk', 'Erling Haaland ⭐', 'Luka Modrić'], correct: 2, explanation: 'Erling Haaland is one of the most feared strikers in the world!' },
    ]
  },
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

  useEffect(() => {
    if (phase !== 'complete') return;

    const existingId = localStorage.getItem('playsmart_user_id');
    const userId = existingId || 'user_' + Math.random().toString(36).substr(2, 9);
    if (!existingId) localStorage.setItem('playsmart_user_id', userId);

    const prevXp = parseInt(localStorage.getItem('playsmart_xp') || '0');
    const prevStreak = parseInt(localStorage.getItem('playsmart_streak') || '0');
    const newXp = prevXp + 50;
    const newStreak = prevStreak + 1;

    localStorage.setItem('playsmart_xp', String(newXp));
    localStorage.setItem('playsmart_streak', String(newStreak));

    const completed = JSON.parse(localStorage.getItem('playsmart_completed') || '[]');
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem('playsmart_completed', JSON.stringify(completed));
    }

    supabase.from('user_progress').upsert({
      user_id: userId,
      lesson_id: lessonId,
      score: correct,
    }).then(() => {});

    supabase.from('user_stats').upsert({
      user_id: userId,
      xp: newXp,
      streak: newStreak,
    }, { onConflict: 'user_id' }).then(() => {});

  }, [phase]);

  if (!lesson) return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-gray-400 mb-4">This lesson is coming soon!</p>
        <Link href="/learn" className="text-orange-400 font-bold">← Back to lessons</Link>
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
              <p className="text-orange-400 font-bold text-sm uppercase tracking-wide mb-2">
                Question {quizIndex + 1} of {lesson.quiz.length}
              </p>
              <h2 className="text-2xl font-black text-white">{lesson.quiz[quizIndex].question}</h2>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {lesson.quiz[quizIndex].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base transition ${
                    selected === null
                      ? 'border-gray-700 bg-gray-800 hover:border-orange-500 hover:bg-gray-700'
                      : i === lesson.quiz[quizIndex].correct
                      ? 'border-green-400 bg-green-500/20 text-green-400'
                      : selected === i
                      ? 'border-red-400 bg-red-500/20 text-red-400'
                      : 'border-gray-700 bg-gray-800 opacity-50'
                  }`}
                >
                  <span className="mr-3 text-gray-500 font-black">{['A', 'B', 'C', 'D'][i]}.</span>
                  {option.replace(/[\u{1F300}-\u{1FAD6}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()}
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