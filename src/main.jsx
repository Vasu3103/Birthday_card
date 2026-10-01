import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { birthday } from './content';
import './styles.css';

const pages = [
  { slug: 'birthday', label: 'For you' },
  { slug: 'memories', label: 'My favourite girl' },
  { slug: 'love-notes', label: 'Little love notes' },
  { slug: 'letter', label: 'Your letter' },
  { slug: 'make-a-wish', label: 'Make a wish' },
];
const currentPage = () => Math.max(0, pages.findIndex(page => `#${page.slug}` === window.location.hash));

function MusicPlayer({ controlRef }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!error) return;
    const timeout = window.setTimeout(() => setError(''), 5000);
    return () => window.clearTimeout(timeout);
  }, [error]);
  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio || loading || !audio.paused) return;
    setError(''); setLoading(true);
    // Call play directly from the submit/click gesture so phone browsers allow it.
    try { audio.volume = 0.35; await audio.play(); }
    catch { setError('Tap the music button to start your song.'); }
    finally { setLoading(false); }
  };
  React.useImperativeHandle(controlRef, () => ({ play: startMusic }));
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio || loading) return;
    if (!audio.paused) { audio.pause(); return; }
    void startMusic();
  };
  return <div className="music-player">
    <audio ref={audioRef} src={birthday.musicSrc} loop preload="none" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setLoading(false); setError('The music could not play. Please try again.'); }}/>
    <button className={`music-toggle ${playing ? 'music-playing' : ''}`} type="button" onClick={toggleMusic} disabled={loading} aria-label={playing ? 'Pause background music' : 'Play background music'} aria-pressed={playing} aria-busy={loading} title={playing ? 'Pause music' : 'Play music'}><span aria-hidden="true">{playing ? 'Ⅱ' : '♫'}</span></button>
    {error && <span className="music-message" role="status">{error}</span>}
  </div>;
}

function Photo({ memory, index, liked, onLike, suppressTap }) {
  const [failed, setFailed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [heartBurst, setHeartBurst] = useState(0);
  return <div className="memory-scrapbook">
    <span className="memory-sticker" aria-hidden="true">✧ just Jiya</span>
    <button className={`photo-flip ${flipped ? 'flipped' : ''}`} aria-label={flipped ? 'Show photo again' : 'Turn photo over for a secret note'} aria-expanded={flipped} onClick={() => {
      if (suppressTap.current) { suppressTap.current = false; return; }
      setFlipped(value => !value);
    }}>
      <div className="flip-inner">
        <article className="polaroid journey-photo flip-front" aria-hidden={flipped}>
          <div className={`photo ${memory.color}`}>
            {memory.src && !failed ? <img src={memory.src.startsWith('/photos/') ? `${import.meta.env.BASE_URL}${memory.src.slice(1)}` : memory.src} style={{ objectPosition: memory.position }} alt={memory.caption} draggable={false} decoding="async" onError={() => setFailed(true)} /> : <div className="photo-placeholder"><span className="sketch-heart">♡</span><span>A little space for<br/>my favourite girl</span><small>PHOTO {String(index + 1).padStart(2, '0')}</small></div>}
          </div><p>{memory.caption}</p><span className="photo-tag">{memory.tag}</span>
        </article>
        <div className="flip-back" aria-hidden={!flipped}><span className="back-heart">♡</span><span className="eyebrow">BEHIND THIS PHOTO</span><p>{memory.note || 'If I could live this moment again, I would still choose you.'}</p><span className="handwritten">My favourite girl. Always. ♡</span><small>tap to turn it back</small></div>
      </div>
    </button>
    <button className={`memory-love ${liked ? 'loved' : ''}`} aria-label={liked ? 'Remove heart from this memory' : 'Send a heart to this memory'} aria-pressed={liked} onClick={() => { onLike(); if (!liked) setHeartBurst(value => value + 1); }}><span aria-hidden="true">{liked ? '♥' : '♡'}</span>{liked ? 'My beautiful baby ♥' : 'Send Jiya a little love'}</button>
    {heartBurst > 0 && <div key={heartBurst} className="memory-heart-burst" aria-hidden="true">{Array.from({length:7},(_,index) => <span key={index} style={{'--heart-x':`${(index - 3) * 26}px`,'--heart-delay':`${index * .05}s`}}>♥</span>)}</div>}
  </div>;
}
function PartyBurst({ burst }) {
  return <div key={burst} className="party-burst" aria-hidden="true">
    <span className="party-cone cone-left">🎉</span><span className="party-cone cone-right">🎉</span>
    {Array.from({length:48},(_,index) => <i key={index} className={index % 5 === 0 ? 'party-heart' : ''} style={{'--side':index % 2 === 0 ? '8%' : '92%','--dx':`${(index % 2 === 0 ? 1 : -1) * (40 + (index * 43) % 280)}px`,'--dy':`${-120 - (index * 29) % 360}px`,'--spin':`${index * 47}deg`,'--party-delay':`${(index % 6) * .045}s`,'--color':['#d44e8f','#9f78db','#e5b340','#67bdb3'][index % 4]}}>{index % 5 === 0 ? '♥' : ''}</i>)}
    {[0,1,2].map(index => <div key={index} className={`sparkle-bloom bloom-${index}`}>{Array.from({length:10},(_,ray) => <span key={ray} style={{'--angle':`${ray * 36}deg`}}/>)}</div>)}
  </div>;
}
function App() {
  const [page, setPage] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [question, setQuestion] = useState(false);
  const [answer, setAnswer] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [wrongTries, setWrongTries] = useState(0);
  const [lovedMemories, setLovedMemories] = useState([]);
  const [extraGift, setExtraGift] = useState(false);
  const [memory, setMemory] = useState(0);
  const [opened, setOpened] = useState(false);
  const [line, setLine] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const [wished, setWished] = useState(false);
  const [burst, setBurst] = useState(0);
  const headingRef = useRef(null);
  const musicControlsRef = useRef(null);
  const firstRender = useRef(true);
  const swipeStart = useRef(null);
  const suppressPhotoTap = useRef(false);
  useEffect(() => {
    const sync = () => {
      const destination = currentPage();
      if (destination === 0) {
        setUnlocked(false); setQuestion(false); setAnswer(''); setAnswerError(''); setWrongTries(0);
      }
      if (!unlocked && destination > 0) {
        window.history.replaceState(null, '', '#birthday');
        setPage(0); setQuestion(true);
      } else setPage(destination);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [unlocked]);
  useEffect(() => {
    document.title = `${pages[page].label} · Happy birthday, ${birthday.name}`;
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);
  useEffect(() => {
    if (!burst) return;
    const timeout = window.setTimeout(() => setBurst(0), 4500);
    return () => window.clearTimeout(timeout);
  }, [burst]);
  const go = index => {
    if (index > 0 && (page === 0 || !unlocked)) { setAnswer(''); setAnswerError(''); setQuestion(true); return; }
    window.location.hash = pages[index].slug;
  };
  const submitAnswer = event => {
    event.preventDefault();
    if (answer.trim().toLowerCase() !== birthday.unlockAnswer.toLowerCase()) {
      const cuteReplies = [
        'Baby, that is cute... but Vasu has a cheekier nickname for his favourite troublemaker. Try again? ♡',
        'Jiya, you stole my heart but forgot your nickname? My adorable little menace. One more try! ♡',
        'Wrong answer, still the right girl. Vasu is not going anywhere, baby. Try again! ♡'
      ];
      setAnswerError(cuteReplies[wrongTries % cuteReplies.length]); setWrongTries(value => value + 1);
      return;
    }
    void musicControlsRef.current?.play();
    setUnlocked(true); setQuestion(false); setAnswerError('');
    window.location.hash = pages[1].slug;
  };
  const restart = () => {
    setUnlocked(false); setLovedMemories([]); setExtraGift(false); setWrongTries(0); setMemory(0); setOpened(false); setLine(0); setRevealed([]); setWished(false); setBurst(0); setQuestion(false); setAnswer(''); setAnswerError(''); go(0);
  };
  const toggleNote = index => setRevealed(values => values.includes(index) ? values.filter(value => value !== index) : [...values, index]);
  return <div className={`journey-app theme-${page}`}>
    <div className="ambient" aria-hidden="true"><span>♡</span><span>✧</span><span>♡</span><span>✦</span><span>✧</span><span>♡</span></div>
    <header className="nav"><a className="wordmark" href="#birthday">from Vasu, with love<span>♡</span></a><div className="header-actions"><MusicPlayer controlRef={musicControlsRef}/><span className="journey-counter">{String(page + 1).padStart(2, '0')} / 05</span></div></header>
    <nav className="journey-progress" aria-label="Birthday journey">{pages.map((item, index) => <a key={item.slug} href={`#${item.slug}`} onClick={event => { if (index > 0 && (page === 0 || !unlocked)) { event.preventDefault(); setAnswer(''); setAnswerError(''); setQuestion(true); } }} className={index === page ? 'active' : ''} aria-current={index === page ? 'page' : undefined}><span className="step-dot">{index < page ? '✓' : index + 1}</span><span className="step-label">{item.label}</span></a>)}</nav>
    <main className="journey-main">
      <section key={page} className={`journey-screen screen-${page}`} aria-labelledby="page-heading">
        {page === 0 && <>
          <div className={`welcome-art ${question ? 'gift-small' : ''}`} aria-hidden="true"><span>✧</span><div className="gift-box">♡<div className="gift-ribbon"/></div><span>✧</span></div>
          <span className="eyebrow">JIYA TURNS 20 · VASU IS STILL SMITTEN</span>
          <h1 id="page-heading" ref={headingRef} tabIndex={-1}>Happy birthday,<br/><em>{birthday.name}.</em></h1>
          <p className="screen-description">{birthday.subtitle}</p>
          {question ? <form className="nickname-card" onSubmit={submitAnswer}>
            <span className="nickname-heart" aria-hidden="true">♡</span>
            <h3>A little Vasu-and-Jiya secret.</h3>
            <label htmlFor="nickname">What do I lovingly call you?</label>
            <input id="nickname" type="text" value={answer} onChange={event => { setAnswer(event.target.value); setAnswerError(''); }} autoFocus autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="Your special nickname" required maxLength={80} aria-invalid={!!answerError} aria-describedby={answerError ? 'nickname-error' : 'nickname-hint'}/>
            <p id={answerError ? 'nickname-error' : 'nickname-hint'} className={answerError ? 'nickname-error' : 'nickname-hint'} aria-live="polite">{answerError || 'The cheeky nickname, baby. Not the sweet one. ♡'}</p>
            <button className="primary" type="submit">Unlock my surprises <span>♡</span></button>
            <button className="text-button" type="button" onClick={() => { setQuestion(false); setAnswerError(''); headingRef.current?.focus(); }}>Back to my birthday card</button>
          </form> : <>
            <button className="primary" onClick={() => go(1)}>Let’s unwrap them <span>→</span></button>
            <span className="handwritten hero-note">made by your Vasu, just for you ♡</span>
          </>}
        </>}
        {page === 1 && <>
          <span className="eyebrow">5.8 YEARS. STILL MY FAVOURITE FACE.</span>
          <h2 id="page-heading" ref={headingRef} tabIndex={-1}>Just Jiya.<br/><em>Simply beautiful.</em></h2>
          <p className="screen-description">Eight photos of my favourite girl. Tap each one for a compliment from your very smitten Vasu.</p>
          {birthday.memories.length > 0 ? <>
            <div className="memory-stage" aria-live="polite" onPointerDown={event => { suppressPhotoTap.current = false; swipeStart.current = { x: event.clientX, y: event.clientY }; }} onPointerUp={event => {
              const start = swipeStart.current;
              swipeStart.current = null;
              if (!start) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) { suppressPhotoTap.current = true; setMemory(value => Math.max(0, Math.min(birthday.memories.length - 1, value + (dx < 0 ? 1 : -1)))); }
            }} onPointerCancel={() => { swipeStart.current = null; }}><Photo key={memory} memory={birthday.memories[memory]} index={memory} liked={lovedMemories.includes(memory)} suppressTap={suppressPhotoTap} onLike={() => setLovedMemories(values => values.includes(memory) ? values.filter(value => value !== memory) : [...values, memory])}/></div>
            <div className="mini-controls"><button className="round-button" aria-label="Previous photo" disabled={memory === 0} onClick={() => setMemory(value => value - 1)}>←</button><div className="memory-dots" aria-label="Choose a photo">{birthday.memories.map((_, index) => <button key={index} className={index === memory ? 'selected' : ''} aria-label={`Photo ${index + 1}`} aria-pressed={index === memory} onClick={() => setMemory(index)}><span/></button>)}</div><button className="round-button" aria-label="Next photo" disabled={memory === birthday.memories.length - 1} onClick={() => setMemory(value => value + 1)}>→</button></div><p className="swipe-hint">Swipe to explore · Tap the photo for a secret</p>
          </> : <p className="handwritten">A little gallery for my beautiful Jiya ♡</p>}
        </>}
        {page === 2 && <>
          <span className="eyebrow">WHY VASU IS ABSOLUTELY GONE FOR YOU</span>
          <h2 id="page-heading" ref={headingRef} tabIndex={-1}>Baby, you’re <em>something else.</em></h2>
          <p className="screen-description">Beauty, kindness, and a little Dayan magic. Tap to see what you do to me.</p>
          <div className="love-note-grid">{birthday.reasons.map((reason, index) => {
            const isRevealed = revealed.includes(index);
            return <button key={index} className={`love-note ${isRevealed ? 'revealed' : ''}`} onClick={() => toggleNote(index)} aria-expanded={isRevealed} aria-label={isRevealed ? `Hide note: ${reason.title}` : `Reveal love note ${index + 1}`}>
              <span className="note-icon" aria-hidden="true">{isRevealed ? reason.icon : '♡'}</span>
              {isRevealed ? <><strong>{reason.title}</strong><span className="note-text">{reason.text}</span><small>tap to tuck it away</small></> : <><strong>Love note {String(index + 1).padStart(2, '0')}</strong><span className="handwritten">tap to open</span></>}
            </button>;
          })}</div>
          <p className="handwritten note-count" aria-live="polite">{revealed.length === birthday.reasons.length ? 'Diagnosis: Vasu is hopelessly in love. ♡' : `${revealed.length} of ${birthday.reasons.length} little secrets opened`}</p>
        </>}
        {page === 3 && <>
          <span className="eyebrow">FROM VASU’S HEART TO JIYA’S</span>
          <h2 id="page-heading" ref={headingRef} tabIndex={-1}>For my Jiya.<br/><em>My baby.</em></h2><p className="screen-description">A little funny. A little emotional. Completely yours.</p>
          <div className={`letter journey-letter ${opened ? 'is-open' : ''}`}>
            {opened ? <>
              <span className="letter-label">5.8 YEARS, A WHOLE LOT OF LOVE</span><h3>Dear {birthday.name},</h3>
              <p key={line} className="letter-line" aria-live="polite">{birthday.letter[line] || 'I’m so lucky I get to love you. ♡'}</p>
              {line === Math.max(0, birthday.letter.length - 1) && <div className="signature">Always yours,<br/><span>{birthday.from} ♡</span></div>}
              {birthday.letter.length > 1 && <div className="letter-controls"><button className="text-button" disabled={line === 0} onClick={() => setLine(value => value - 1)}>← Previous</button><span>{line + 1} / {birthday.letter.length}</span><button className="text-button" disabled={line === birthday.letter.length - 1} onClick={() => setLine(value => value + 1)}>Read more →</button></div>}
            </> : <div className="closed-letter"><span className="envelope" aria-hidden="true">✉</span><h3>Jiya, this one is personal.</h3><p>Vasu tried to be cool. Then he wrote this. ♡</p><button className="primary" onClick={() => setOpened(true)}>Open your letter <span>♡</span></button></div>}
          </div>
        </>}
        {page === 4 && <>
          <div className="birthday-bunting" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/></div><span className="eyebrow">20 CANDLES’ WORTH OF LOVE. ONE LITTLE WISH.</span>
          <h2 id="page-heading" ref={headingRef} tabIndex={-1}>{wished ? <>Here’s to <em>20, Jiya.</em></> : <>Make a wish,<br/><em>baby.</em></>}</h2>
          <div className={`cake ${wished ? 'blown' : ''}`} aria-hidden="true"><div className="flame"/><div className="candle"/><div className="cake-top"/><div className="cake-base">♡</div><div className="cake-plate"/></div>
          <p className="screen-description final-wish" aria-live="polite">{wished ? birthday.wish : 'Close your eyes, Jiya. Make your twentieth-birthday wish. Vasu promises not to ask what it is.'}</p>
          <button className="primary" onClick={() => { setWished(true); setBurst(value => value + 1); }}>{wished ? 'More birthday magic' : 'Blow out the candle'} <span>✧</span></button>
          <span className="handwritten hero-note">{wished ? `All my love, ${birthday.from} ♡` : 'My favourite Dayan deserves all the magic ♡'}</span>
          {wished && <div className="celebration-extras">
            <p className="celebration-banner" role="status">Happy 20th, baby! Yours, Vasu. ♡</p>
            <div className="popper-buttons"><button className="popper-button" onClick={() => setBurst(value => value + 1)}><span aria-hidden="true">🎉</span>Pop some joy</button><button className="popper-button" onClick={() => setBurst(value => value + 1)}><span aria-hidden="true">✨</span>Sprinkle magic</button></div>
            <button className={`last-gift ${extraGift ? 'gift-open' : ''}`} aria-expanded={extraGift} onClick={() => setExtraGift(value => !value)}><span aria-hidden="true">{extraGift ? '♡' : '🎁'}</span>{extraGift ? <><strong>Vasu’s wish? More us.</strong><span>{birthday.finalNote}</span><small>tap to tuck this away</small></> : <><strong>Baby, one more thing from Vasu...</strong><span>Tap to unwrap my wish.</span></>}</button>
          </div>}
        </>}
      </section>
      <div className="journey-navigation" aria-label="Page controls"><button className="text-button" disabled={page === 0} onClick={() => go(page - 1)}>← Back</button><span className="navigation-caption">{pages[page].label}</span>{page > 0 && page < pages.length - 1 ? <button className="primary" onClick={() => go(page + 1)}>{['', 'A little love', 'Your letter', 'One last surprise'][page]} <span>→</span></button> : page === pages.length - 1 ? <button className="text-button" onClick={restart}>Start again ↻</button> : <button className="primary" onClick={() => go(1)}>Begin the surprise <span>→</span></button>}</div>
    </main>
    <footer className="journey-footer"><p>For Jiya. From Vasu. With all my love. ♡</p></footer>
    {burst > 0 && <PartyBurst burst={burst}/>}
    {burst > 0 && <div key={burst} className="confetti" aria-hidden="true">{Array.from({length: 80}, (_, index) => <i key={index} style={{'--x': `${(index * 37) % 100}%`, '--delay': `${(index % 8) * .08}s`, '--rotate': `${index * 29}deg`, '--color': ['#cc6b80', '#e3b865', '#b2afce', '#edaa90'][index % 4]}}/>)}</div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
