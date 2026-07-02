import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 text-white overflow-hidden">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-4xl">⚽</span>
          <span className="text-2xl font-black text-white drop-shadow-lg">PlaySmart</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-full text-sm transition">Log In</Link>
          <Link href="/signup" className="bg-white text-orange-500 font-black px-4 py-2 rounded-full text-sm transition hover:scale-105">Sign Up FREE</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-block bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm font-bold mb-6">
            🏆 #1 Sports Learning App for Kids
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 drop-shadow-lg">
            Learn Sports<br/>
            <span className="text-yellow-200">The Fun Way!</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
            Master football, cricket and basketball through fun lessons, quizzes and games. Just like Duolingo — but for sports! 🎮
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/learn" className="bg-white text-orange-500 font-black px-8 py-4 rounded-2xl text-xl transition hover:scale-105 shadow-xl">
              🚀 Start Learning FREE
            </Link>
            <Link href="/how-it-works" className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-bold px-8 py-4 rounded-2xl text-xl transition">
              How it works →
            </Link>
          </div>
          <p className="text-white/70 text-sm mt-4">✅ Free forever • ✅ No ads • ✅ Safe for kids</p>
        </div>

        {/* Mascot / visual */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="w-64 h-64 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-9xl animate-bounce shadow-2xl">
              ⚽
            </div>
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-yellow-300 text-yellow-900 font-black text-sm px-3 py-2 rounded-2xl shadow-lg animate-pulse">
              🔥 Streak: 7 days!
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-400 text-white font-black text-sm px-3 py-2 rounded-2xl shadow-lg">
              ⭐ 250 XP earned!
            </div>
            <div className="absolute top-1/2 -right-12 bg-purple-400 text-white font-black text-sm px-3 py-2 rounded-2xl shadow-lg">
              🏅 Badge unlocked!
            </div>
          </div>
        </div>
      </section>

      {/* Sports selector */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-black text-center text-white mb-8 drop-shadow">Choose Your Sport</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: '⚽', sport: 'Football', desc: 'Learn positions, rules, tactics and famous players', color: 'from-green-400 to-green-600', lessons: 24, available: true },
            { emoji: '🏏', sport: 'Cricket', desc: 'Understand batting, bowling, fielding and the rules', color: 'from-blue-400 to-blue-600', lessons: 18, available: false },
            { emoji: '🏀', sport: 'Basketball', desc: 'Master dribbling, shooting, defence and game strategy', color: 'from-orange-400 to-red-500', lessons: 20, available: false },
          ].map((s) => (
            <div key={s.sport} className={`bg-gradient-to-br ${s.color} rounded-3xl p-6 text-white relative overflow-hidden hover:scale-105 transition cursor-pointer shadow-xl`}>
              {!s.available && (
                <div className="absolute top-3 right-3 bg-white/30 text-white text-xs font-bold px-2 py-1 rounded-full">Coming Soon!</div>
              )}
              <div className="text-6xl mb-4">{s.emoji}</div>
              <h3 className="text-2xl font-black mb-2">{s.sport}</h3>
              <p className="text-white/80 text-sm mb-4">{s.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs">{s.lessons} lessons</span>
                {s.available ? (
                  <Link href="/learn" className="bg-white text-green-600 font-black px-4 py-2 rounded-xl text-sm hover:scale-105 transition">
                    Start →
                  </Link>
                ) : (
                  <span className="bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-sm">Soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — Duolingo style */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-black text-center text-white mb-10 drop-shadow">How PlaySmart Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', emoji: '🎯', title: 'Pick a Sport', desc: 'Choose Football, Cricket or Basketball' },
            { step: '2', emoji: '📖', title: 'Take Lessons', desc: 'Fun bite-sized lessons with visuals' },
            { step: '3', emoji: '🧠', title: 'Answer Quizzes', desc: 'Test what you learned with fun questions' },
            { step: '4', emoji: '🏆', title: 'Earn Rewards', desc: 'Get XP, badges and climb the leaderboard' },
          ].map((item) => (
            <div key={item.step} className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/30 transition">
              <div className="w-12 h-12 bg-white text-orange-500 font-black text-xl rounded-full flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="text-white font-black text-lg mb-2">{item.title}</h3>
              <p className="text-white/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/20 backdrop-blur rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '10K+', label: 'Kids Learning' },
            { value: '3', label: 'Sports' },
            { value: '60+', label: 'Lessons' },
            { value: '100%', label: 'Free' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black text-white">{stat.value}</p>
              <p className="text-white/70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h2 className="text-4xl font-black text-white mb-4 drop-shadow">Ready to become a Sports Expert? 🏆</h2>
        <p className="text-white/80 text-lg mb-8">Join thousands of kids already learning sports the fun way!</p>
        <Link href="/learn" className="bg-white text-orange-500 font-black px-10 py-5 rounded-2xl text-xl transition hover:scale-105 shadow-xl inline-block">
          🚀 Start Playing for FREE
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 px-6 py-6 text-center text-white/60 text-sm">
        <p>© 2026 PlaySmart — Making sports education fun for every child 🌍</p>
      </footer>
    </main>
  );
}