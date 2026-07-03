'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const players = [
  { id: 'messi', name: 'Lionel Messi', flag: '🇦🇷', team: 'Inter Miami', number: '10', shirt: '#ff6b9d', shorts: '#1a3a6b' },
  { id: 'ronaldo', name: 'Cristiano Ronaldo', flag: '🇵🇹', team: 'Al Nassr', number: '7', shirt: '#ffd700', shorts: '#1a5c2e' },
  { id: 'mbappe', name: 'Kylian Mbappé', flag: '🇫🇷', team: 'Real Madrid', number: '9', shirt: '#ffffff', shorts: '#1a1a6b' },
  { id: 'haaland', name: 'Erling Haaland', flag: '🇳🇴', team: 'Man City', number: '9', shirt: '#6ecfff', shorts: '#0a3a5c' },
];

const scenarios = [
  {
    id: 1,
    title: 'One on One!',
    desc: 'The keeper rushes out at you!',
    correctOption: 0,
    options: [
      { text: 'Chip over keeper', icon: '🎯', result: 'goal', msg: 'GENIUS CHIP! Perfectly lobbed over the keeper! 🏆' },
      { text: 'Shoot hard', icon: '💥', result: 'saved', msg: 'SAVED! Too close to keeper. Should have chipped!' },
      { text: 'Dribble round', icon: '🔄', result: 'tackle', msg: 'TACKLED! Too risky. Chip was the answer!' },
      { text: 'Pass back', icon: '↩️', result: 'miss', msg: 'Chance gone! Always shoot when through on goal!' },
    ]
  },
  {
    id: 2,
    title: 'Free Kick!',
    desc: 'Wall of 4 players. Last minute. Do or die!',
    correctOption: 1,
    options: [
      { text: 'Blast through', icon: '⚡', result: 'saved', msg: 'BLOCKED! The wall stopped it. Curl it next time!' },
      { text: 'Curl around wall', icon: '🌀', result: 'goal', msg: 'UNSTOPPABLE CURL! Top corner! 🏆' },
      { text: 'Pass sideways', icon: '👋', result: 'miss', msg: 'Too slow! The free kick was yours to take!' },
      { text: 'Chip over wall', icon: '🎯', result: 'saved', msg: 'Too high! A curl around was needed here!' },
    ]
  },
  {
    id: 3,
    title: 'Counter Attack!',
    desc: '3 vs 2! Your teammate is FREE on the right!',
    correctOption: 2,
    options: [
      { text: 'Shoot yourself', icon: '🦶', result: 'saved', msg: 'SAVED! Teammate was in a better position!' },
      { text: 'Dribble through', icon: '💨', result: 'tackle', msg: 'TACKLED! The pass was far smarter!' },
      { text: 'Pass to teammate', icon: '✨', result: 'goal', msg: 'PERFECT VISION! Teammate taps it in! 🏆' },
      { text: 'Slow down', icon: '🐢', result: 'miss', msg: 'Defence recovered! Always play at pace!' },
    ]
  },
];

type GamePhase = 'idle' | 'running' | 'decide' | 'shooting' | 'goal' | 'wrong' | 'rewinding';
type AppPhase = 'select' | 'intro' | 'game' | 'results';

function PlayerSVG({ shirt, shorts, number, flag, running }: {
  shirt: string; shorts: string; number: string; flag: string; running: boolean;
}) {
  return (
    <svg width="28" height="56" viewBox="0 0 28 56">
      <ellipse cx="14" cy="54" rx="10" ry="3" fill="rgba(0,0,0,0.3)" />
      <rect x="8" y="36" width="5" height="14" rx="2" fill={shorts}
        style={{ transformOrigin: '10px 36px', transform: running ? 'rotate(20deg)' : 'none' }} />
      <rect x="15" y="36" width="5" height="14" rx="2" fill={shorts}
        style={{ transformOrigin: '18px 36px', transform: running ? 'rotate(-20deg)' : 'none' }} />
      <rect x="6" y="47" width="8" height="5" rx="2" fill="#111" />
      <rect x="14" y="47" width="8" height="5" rx="2" fill="#111" />
      <rect x="8" y="42" width="5" height="6" rx="1" fill="white" />
      <rect x="15" y="42" width="5" height="6" rx="1" fill="white" />
      <rect x="5" y="20" width="18" height="18" rx="3" fill={shirt} />
      <text x="14" y="32" textAnchor="middle" fill={shirt === '#ffffff' ? '#333' : 'white'} fontSize="7" fontWeight="bold">{number}</text>
      <rect x="-1" y="22" width="7" height="5" rx="2" fill={shirt}
        style={{ transformOrigin: '3px 22px', transform: running ? 'rotate(-20deg)' : 'none' }} />
      <rect x="22" y="22" width="7" height="5" rx="2" fill={shirt}
        style={{ transformOrigin: '25px 22px', transform: running ? 'rotate(20deg)' : 'none' }} />
      <ellipse cx="14" cy="12" rx="9" ry="10" fill="#ffcc99" />
      <rect x="5" y="4" width="18" height="6" rx="3" fill="#4a3728" />
      <circle cx="10" cy="13" r="1.5" fill="#333" />
      <circle cx="18" cy="13" r="1.5" fill="#333" />
      <text x="14" y="-2" textAnchor="middle" fontSize="8">{flag}</text>
    </svg>
  );
}

function GoalKeeperSVG({ rushing }: { rushing: boolean }) {
  return (
    <svg width="28" height="52" viewBox="0 0 28 52">
      <ellipse cx="14" cy="50" rx="10" ry="3" fill="rgba(0,0,0,0.3)" />
      <rect x="8" y="34" width="5" height="14" rx="2" fill="#333"
        style={{ transformOrigin: '10px 34px', transform: rushing ? 'rotate(20deg)' : 'none' }} />
      <rect x="15" y="34" width="5" height="14" rx="2" fill="#333"
        style={{ transformOrigin: '18px 34px', transform: rushing ? 'rotate(-20deg)' : 'none' }} />
      <rect x="6" y="45" width="8" height="5" rx="2" fill="#111" />
      <rect x="14" y="45" width="8" height="5" rx="2" fill="#111" />
      <rect x="8" y="40" width="5" height="6" rx="1" fill="white" />
      <rect x="15" y="40" width="5" height="6" rx="1" fill="white" />
      <rect x="6" y="18" width="16" height="18" rx="3" fill="#ffa500" />
      <text x="14" y="30" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">GK</text>
      <rect x="-4" y="20" width="10" height="5" rx="2" fill="#ffa500"
        style={{ transformOrigin: '-4px 20px', transform: rushing ? 'rotate(-40deg)' : 'rotate(-15deg)' }} />
      <rect x="22" y="20" width="10" height="5" rx="2" fill="#ffa500"
        style={{ transformOrigin: '27px 20px', transform: rushing ? 'rotate(40deg)' : 'rotate(15deg)' }} />
      <circle cx="-3" cy="24" r="4" fill="#ffff00" />
      <circle cx="31" cy="24" r="4" fill="#ffff00" />
      <ellipse cx="14" cy="12" rx="9" ry="10" fill="#ffcc99" />
      <rect x="5" y="4" width="18" height="6" rx="3" fill="#8B4513" />
      <circle cx="10" cy="12" r="1.5" fill="#333" />
      <circle cx="18" cy="12" r="1.5" fill="#333" />
    </svg>
  );
}

function WallPlayerSVG({ color }: { color: string }) {
  return (
    <svg width="20" height="46" viewBox="0 0 20 46">
      <ellipse cx="10" cy="44" rx="8" ry="2.5" fill="rgba(0,0,0,0.3)" />
      <rect x="5" y="28" width="4" height="12" rx="1.5" fill="#333" />
      <rect x="11" y="28" width="4" height="12" rx="1.5" fill="#333" />
      <rect x="4" y="40" width="6" height="4" rx="1" fill="#111" />
      <rect x="10" y="40" width="6" height="4" rx="1" fill="#111" />
      <rect x="3" y="16" width="14" height="14" rx="2.5" fill={color} />
      <ellipse cx="10" cy="10" rx="7" ry="8" fill="#ffcc99" />
      <rect x="3" y="4" width="14" height="5" rx="2" fill="#333" />
      <rect x="-3" y="14" width="6" height="10" rx="2" fill={color}
        style={{ transformOrigin: '-3px 14px', transform: 'rotate(-30deg)' }} />
      <rect x="17" y="14" width="6" height="10" rx="2" fill={color}
        style={{ transformOrigin: '20px 14px', transform: 'rotate(30deg)' }} />
    </svg>
  );
}

function FootballPitch({
  phase, playerShirt, playerShorts, playerNumber, playerFlag, scenarioIdx
}: {
  phase: GamePhase;
  playerShirt: string;
  playerShorts: string;
  playerNumber: string;
  playerFlag: string;
  scenarioIdx: number;
}) {
  const isRunning = phase === 'running';
  const isDecide = phase === 'decide';
  const isShooting = phase === 'shooting';
  const isGoal = phase === 'goal';
  const isWrong = phase === 'wrong' || phase === 'rewinding';
  const isFreekick = scenarioIdx === 1;

  const keeperRight = (isDecide || isShooting || isGoal) && scenarioIdx === 0
    ? '32%' : '6%';

  const playerLeft = isRunning ? '52%'
    : isDecide || isShooting ? '58%'
    : isGoal ? '72%'
    : isWrong ? '18%'
    : '18%';

  const ballLeft = isRunning ? '60%'
    : isDecide ? '65%'
    : isShooting || isGoal ? '91%'
    : isWrong ? '20%'
    : '20%';

  const ballTop = isShooting ? '28%' : isGoal ? '47%' : '50%';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-green-900"
      style={{ height: '280px', background: 'linear-gradient(180deg, #0d0d1f 0%, #161628 28%, #1a5c1a 28%)' }}>

      {/* Stands */}
      <div className="absolute top-0 left-0 right-0" style={{ height: '78px' }}>
        <div className="flex px-2 pt-2 gap-0.5">
          {[...Array(32)].map((_, i) => (
            <div key={i} className="flex-1 rounded-t"
              style={{
                height: `${14 + (i % 4) * 3}px`,
                background: ['#e63946','#2196f3','#ffffff','#ffd700','#4caf50','#ff9800','#9c27b0'][i % 7],
                opacity: 0.75
              }} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800 opacity-80" />
        <div className="absolute top-1 left-6 w-2 h-10 bg-yellow-100 rounded-t-full opacity-90"
          style={{ boxShadow: '0 0 8px rgba(255,255,200,0.8)' }} />
        <div className="absolute top-1 right-6 w-2 h-10 bg-yellow-100 rounded-t-full opacity-90"
          style={{ boxShadow: '0 0 8px rgba(255,255,200,0.8)' }} />
      </div>

      {/* Pitch */}
      <div className="absolute left-0 right-0 bottom-0" style={{ top: '78px' }}>
        {/* Grass */}
        <div className="absolute inset-0 flex">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-1"
              style={{ background: i % 2 === 0 ? '#2d8a2d' : '#329632' }} />
          ))}
        </div>

        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 202" preserveAspectRatio="none">
          <rect x="8" y="4" width="384" height="194" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" />
          <line x1="200" y1="4" x2="200" y2="198" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <circle cx="200" cy="101" r="45" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
          <circle cx="200" cy="101" r="3" fill="rgba(255,255,255,0.7)" />
          <rect x="306" y="46" width="86" height="110" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
          <rect x="350" y="68" width="42" height="66" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <circle cx="330" cy="101" r="2.5" fill="rgba(255,255,255,0.8)" />
          <path d="M330 61 A40 40 0 0 1 330 141" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <rect x="8" y="46" width="86" height="110" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <rect x="8" y="68" width="42" height="66" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        </svg>

        {/* Goal */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2" style={{ width: '26px', height: '78px' }}>
          <div className="absolute inset-0 opacity-25"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 9px),repeating-linear-gradient(90deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 9px)' }} />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-l-sm"
            style={{ boxShadow: '0 0 8px rgba(255,255,255,0.9)' }} />
          <div className="absolute left-0 top-0 right-0 h-1 bg-white"
            style={{ boxShadow: '0 0 8px rgba(255,255,255,0.9)' }} />
          <div className="absolute left-0 bottom-0 right-0 h-1 bg-white"
            style={{ boxShadow: '0 0 8px rgba(255,255,255,0.9)' }} />
        </div>

        {/* Free kick wall */}
        {isFreekick && (
          <div className="absolute flex gap-0.5 transition-all duration-500"
            style={{ right: '26%', top: '50%', transform: 'translateY(-60%)' }}>
            {[0,1,2,3].map(i => (
              <WallPlayerSVG key={i} color={i % 2 === 0 ? '#cc0000' : '#ffffff'} />
            ))}
          </div>
        )}

        {/* Goalkeeper */}
        <div className="absolute transition-all"
          style={{
            right: keeperRight,
            top: '50%',
            transform: 'translateY(-55%)',
            transitionDuration: isDecide && scenarioIdx === 0 ? '800ms' : '400ms',
            transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
          }}>
          <GoalKeeperSVG rushing={isDecide && scenarioIdx === 0} />
        </div>

        {/* Player */}
        <div className="absolute transition-all"
          style={{
            left: playerLeft,
            top: '50%',
            transform: 'translateY(-55%)',
            transitionDuration: isWrong ? '600ms' : isRunning ? '1300ms' : '500ms',
            transitionTimingFunction: isRunning ? 'cubic-bezier(0.4,0,0.2,1)' : 'ease-out',
          }}>
          <div className={isRunning ? 'animate-bounce' : ''} style={{ animationDuration: '0.35s' }}>
            <PlayerSVG
              shirt={playerShirt}
              shorts={playerShorts}
              number={playerNumber}
              flag={playerFlag}
              running={isRunning}
            />
          </div>
        </div>

        {/* Ball */}
        <div className="absolute transition-all"
          style={{
            left: ballLeft,
            top: ballTop,
            transform: 'translateY(-50%)',
            transitionDuration: isShooting ? '450ms' : isWrong ? '600ms' : isRunning ? '1300ms' : '300ms',
            transitionTimingFunction: isShooting ? 'cubic-bezier(0.1,0,0,1)' : 'ease-out',
          }}>
          <div className={`w-6 h-6 rounded-full border-2 border-gray-300 relative ${isRunning || isShooting ? 'animate-spin' : ''}`}
            style={{
              background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #cccccc 100%)',
              animationDuration: isShooting ? '0.15s' : '0.25s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}>
            <div className="absolute rounded-full bg-gray-700"
              style={{ top: '3px', left: '3px', width: '8px', height: '8px' }} />
          </div>
        </div>

        {/* Wrong overlay */}
        {isWrong && (
          <div className="absolute inset-0 bg-red-600/25 flex items-center justify-center">
            <div className="bg-red-700/85 text-white font-black text-base px-5 py-2.5 rounded-2xl animate-pulse shadow-xl">
              ⏪ REWINDING...
            </div>
          </div>
        )}

        {/* Goal overlay */}
        {isGoal && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-yellow-400/15" />
            <div className="relative animate-bounce text-center z-10">
              <div className="text-4xl font-black text-white"
                style={{ textShadow: '0 0 20px gold, 0 0 40px gold, 0 0 60px #ffa500' }}>
                ⚽ GOAL! ⚽
              </div>
            </div>
            {[...Array(18)].map((_, i) => (
              <div key={i} className="absolute animate-bounce pointer-events-none"
                style={{
                  left: `${4 + i * 5.2}%`,
                  top: `${10 + (i % 4) * 20}%`,
                  animationDelay: `${i * 0.06}s`,
                  animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                  fontSize: '1rem',
                }}>
                {['⭐','🎊','✨','🏆','🎉','💥'][i % 6]}
              </div>
            ))}
          </div>
        )}

        {/* Decide banner */}
        {isDecide && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-orange-500 text-white font-black text-xs px-5 py-2 rounded-full animate-pulse"
              style={{ boxShadow: '0 0 20px rgba(255,140,0,0.7)' }}>
              ⚡ DECIDE NOW!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BeThePlayerPage() {
  const [appPhase, setAppPhase] = useState<AppPhase>('select');
  const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
  const [player, setPlayer] = useState<typeof players[0] | null>(null);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'goal' | 'wrong' } | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const scenario = scenarios[scenarioIdx];

  const startRun = useCallback(() => {
    setGamePhase('running');
    setFeedback(null);
    const t = setTimeout(() => setGamePhase('decide'), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (appPhase === 'game') {
      const t = setTimeout(() => startRun(), 600);
      return () => clearTimeout(t);
    }
  }, [appPhase, startRun]);

  useEffect(() => {
    if (appPhase === 'game' && scenarioIdx > 0) {
      const t = setTimeout(() => startRun(), 400);
      return () => clearTimeout(t);
    }
 }, [scenarioIdx, startRun]);

  const handleChoice = (idx: number) => {
    if (gamePhase !== 'decide') return;
    setAttempts(a => a + 1);
    const opt = scenario.options[idx];

    if (opt.result === 'goal') {
      setGamePhase('shooting');
      setTimeout(() => {
        setGamePhase('goal');
        setScore(s => s + 1);
        setFeedback({ msg: opt.msg, type: 'goal' });
      }, 500);
    } else {
      setGamePhase('wrong');
      setFeedback({ msg: opt.msg, type: 'wrong' });
      const t1 = setTimeout(() => {
        setGamePhase('rewinding');
        const t2 = setTimeout(() => {
          setFeedback(null);
          startRun();
        }, 700);
        return () => clearTimeout(t2);
      }, 1000);
      return () => clearTimeout(t1);
    }
  };

  const nextScenario = () => {
    setFeedback(null);
    setAttempts(0);
    if (scenarioIdx + 1 < scenarios.length) {
      setScenarioIdx(i => i + 1);
    } else {
      setAppPhase('results');
    }
  };

  const resetGame = () => {
    setAppPhase('select');
    setScenarioIdx(0);
    setScore(0);
    setPlayer(null);
    setFeedback(null);
    setGamePhase('idle');
    setAttempts(0);
  };

  return (
    <main className="min-h-screen text-white flex flex-col"
      style={{ background: 'linear-gradient(180deg, #050d05 0%, #0a0a1a 100%)' }}>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-10">
        <Link href="/learn" className="text-gray-400 text-sm hover:text-white transition">← Back</Link>
        <span className="text-orange-400 font-black text-sm">⚽ Be The Player</span>
        {appPhase === 'game'
          ? <span className="text-gray-500 text-sm">{scenarioIdx + 1}/{scenarios.length}</span>
          : <span className="w-8" />}
      </div>

      {/* PLAYER SELECT */}
      {appPhase === 'select' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="text-6xl mb-4 animate-bounce">⚽</div>
          <h1 className="text-3xl font-black text-white mb-1 text-center">Choose Your Player!</h1>
          <p className="text-gray-400 text-sm mb-8 text-center">Step into the boots of a legend</p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {players.map(p => (
              <button key={p.id}
                onClick={() => { setPlayer(p); setAppPhase('intro'); }}
                className="rounded-2xl p-5 text-left hover:scale-105 transition active:scale-95 shadow-xl border border-white/10 hover:border-orange-400/50"
                style={{ background: `linear-gradient(135deg, ${p.shirt}22, #000)` }}>
                <div className="text-5xl mb-3">{p.flag}</div>
                <div className="font-black text-white text-base">{p.name}</div>
                <div className="text-xs mt-1 text-gray-400">{p.team}</div>
                <div className="text-3xl font-black mt-2"
                  style={{ color: p.shirt === '#ffffff' ? '#aaa' : p.shirt }}>
                  #{p.number}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INTRO */}
      {appPhase === 'intro' && player && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
          <div className="w-32 h-32 rounded-full border-4 border-orange-400 flex items-center justify-center text-7xl shadow-2xl"
            style={{
              background: `radial-gradient(circle, ${player.shirt}33, #000)`,
              boxShadow: `0 0 40px ${player.shirt}44`
            }}>
            {player.flag}
          </div>
          <div>
            <p className="text-orange-400 text-xs uppercase tracking-widest mb-1">You are playing as</p>
            <h2 className="text-4xl font-black text-white">{player.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{player.team} • #{player.number}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 max-w-xs w-full">
            <p className="text-orange-400 text-xs font-bold uppercase mb-2">
              Situation {scenarioIdx + 1} of {scenarios.length}
            </p>
            <p className="text-white font-black text-xl">{scenario.title}</p>
            <p className="text-gray-400 text-sm mt-1">{scenario.desc}</p>
          </div>
          <button onClick={() => setAppPhase('game')}
            className="bg-orange-500 hover:bg-orange-400 text-white font-black px-12 py-5 rounded-2xl text-2xl transition shadow-2xl shadow-orange-500/30 hover:scale-105 active:scale-95 animate-pulse">
            KICK OFF! ⚽
          </button>
        </div>
      )}

      {/* GAME */}
      {appPhase === 'game' && player && (
        <div className="flex-1 flex flex-col px-3 py-3 gap-3">
          {/* Progress */}
          <div className="flex gap-2">
            {scenarios.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i < scenarioIdx ? 'bg-green-500' : i === scenarioIdx ? 'bg-orange-500' : 'bg-gray-800'
              }`} />
            ))}
          </div>

          {/* Pitch */}
          <FootballPitch
            phase={gamePhase}
            playerShirt={player.shirt}
            playerShorts={player.shorts}
            playerNumber={player.number}
            playerFlag={player.flag}
            scenarioIdx={scenarioIdx}
          />

          {/* Situation */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="text-2xl">{player.flag}</div>
            <div>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-wide">{scenario.title}</p>
              <p className="text-white text-sm font-semibold">{scenario.desc}</p>
            </div>
          </div>

          {/* Options */}
          {gamePhase === 'decide' && !feedback && (
            <div>
              <p className="text-center text-orange-400 font-black text-xs uppercase tracking-widest mb-2 animate-pulse">
                ⚡ What do you do?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {scenario.options.map((opt, i) => (
                  <button key={i} onClick={() => handleChoice(i)}
                    className="p-3 rounded-xl border-2 border-gray-700 bg-gray-900 hover:border-orange-500 hover:bg-gray-800 active:scale-95 transition font-bold text-sm flex items-center gap-2">
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-xs leading-tight text-left">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Watching */}
          {(gamePhase === 'running' || gamePhase === 'idle') && (
            <div className="text-center py-2">
              <p className="text-gray-500 text-sm animate-pulse">👀 Watch the play develop...</p>
            </div>
          )}

          {/* Wrong */}
          {feedback?.type === 'wrong' && (
            <div className="bg-red-950 border border-red-800 rounded-xl p-4 text-center">
              <p className="text-red-400 font-black text-base">❌ Wrong Decision!</p>
              <p className="text-gray-400 text-sm mt-1">{feedback.msg}</p>
              <p className="text-orange-400 text-xs mt-2 animate-pulse">⏪ Rewinding... try again!</p>
            </div>
          )}

          {/* Goal */}
          {feedback?.type === 'goal' && (
            <div className="flex flex-col gap-3">
              <div className="bg-green-950 border border-green-700 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1 animate-bounce">🏆</div>
                <p className="text-green-400 font-black text-base">{feedback.msg}</p>
                {attempts > 1 && (
                  <p className="text-gray-500 text-xs mt-1">Took {attempts} attempts</p>
                )}
              </div>
              <button onClick={nextScenario}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-4 rounded-xl transition text-lg hover:scale-105 active:scale-95">
                {scenarioIdx + 1 < scenarios.length ? 'Next Situation →' : 'Full Time! 🏆'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* RESULTS */}
      {appPhase === 'results' && player && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
          <div className="text-7xl animate-bounce">🏆</div>
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-widest">Full Time!</p>
            <h2 className="text-3xl font-black text-white mt-2">
              {score === scenarios.length ? '⭐ World Class!' : score >= 2 ? '⭐ Great Game!' : '💪 Keep Practicing!'}
            </h2>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-xs">
            <p className="text-gray-500 text-sm mb-2">{player.flag} Playing as {player.name}</p>
            <div className="text-6xl font-black"
              style={{ color: player.shirt === '#ffffff' ? '#aaa' : player.shirt }}>
              {score}/{scenarios.length}
            </div>
            <p className="text-gray-400 text-sm mt-1">correct decisions</p>
            <div className="mt-3 flex justify-center gap-2">
              {scenarios.map((_, i) => (
                <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                  i < score ? 'bg-green-500' : 'bg-gray-800'
                }`}>
                  {i < score ? '✅' : '❌'}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={resetGame}
              className="border border-gray-700 text-gray-300 font-bold px-5 py-3 rounded-xl hover:border-orange-500 transition text-sm">
              Play Again
            </button>
            <Link href="/learn"
              className="bg-orange-500 hover:bg-orange-400 text-white font-black px-5 py-3 rounded-xl transition text-sm">
              Back to Lessons →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}