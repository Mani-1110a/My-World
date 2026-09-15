import { useEffect, useMemo, useState } from "react";

const CONFIG = {
  recipient: "Bangaram",
  nickname: "Bava",
  creator: "Mani",
  birthday: "October 10, 2026",
  letter: {
    greeting: "Dear Bava,",
    paragraphs: [
      "This isn't just a birthday wish. It's a little place I made with all the feelings I never really knew how to put into words.",
      "Some people become important quietly. There wasn't one particular moment when I decided you were going to mean this much to me. It just happened.",
      "Somewhere between our conversations, the random messages, the small things you said, and the moments I remember for no reason, you became someone my heart got attached to.",
      "I know your feelings aren't the same as mine. I'm not making this website to change your mind, and I'm not asking you for an answer. Your feelings are yours, and I respect them.",
      "But my heart didn't get the same message. I still care. I still wait. I still remember. I still worry. And somewhere inside all of that, I still love you.",
      "I don't want my feelings to become a responsibility for you. I just want you to know that what I felt was real, and that you matter to me more than my words can explain.",
      "Today, I just want to celebrate you. May this year be kind to you. May you smile a little more, worry a little less, and always be happy.",
    ],
    signoff: "Happy Birthday, Bava. 🤍",
  },
  quotes: [
    "Somewhere along the way, you became part of my ordinary days.",
    "I do not have to try to remember you. My mind does it for me.",
    "And somehow, my heart still chooses you with tenderness.",
  ],
};

const stars = Array.from({ length: 72 }, (_, i) => ({
  left: `${(i * 47.3) % 100}%`,
  top: `${(i * 71.9) % 100}%`,
  delay: `${(i % 9) * 0.45}s`,
  size: i % 8 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
}));

const symbols = ["♡", "✦", "✧", "❀", "⋆", "♡", "✿", "☾", "✦", "♡", "❀", "✧"];

function SkyDecor({ warm = false, dense = false }: { warm?: boolean; dense?: boolean }) {
  return (
    <div className={`sky-decor ${warm ? "sky-decor--warm" : ""}`} aria-hidden="true">
      <div className="moon" />
      <div className="moon-glow" />
      {stars.slice(0, dense ? 72 : 48).map((star, index) => (
        <i key={index} className="star" style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: star.delay }} />
      ))}
      <div className="bokeh bokeh-one" />
      <div className="bokeh bokeh-two" />
      {symbols.slice(0, dense ? symbols.length : 7).map((symbol, index) => (
        <span key={index} className="floating-symbol" style={{ left: `${8 + index * 13}%`, animationDelay: `${index * 1.2}s` }}>{symbol}</span>
      ))}
    </div>
  );
}

function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button className="romantic-button" onClick={onClick}>{children}<span aria-hidden="true">♡</span></button>;
}

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`romantic-section ${className}`}>{children}</section>;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`soft-reveal ${className}`}>{children}</div>;
}

function Countdown() {
  const target = useMemo(() => new Date("2026-10-10T00:00:00+05:30").getTime(), []);
  const getTime = () => Math.max(0, target - Date.now());
  const [remaining, setRemaining] = useState(getTime);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getTime()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  const values = [
    [Math.floor(remaining / 86400000), "Days"],
    [Math.floor((remaining / 3600000) % 24), "Hours"],
    [Math.floor((remaining / 60000) % 60), "Minutes"],
    [Math.floor((remaining / 1000) % 60), "Seconds"],
  ];
  return <div className="countdown">{values.map(([value, label]) => <div className="countdown-unit" key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

function StoryPage({ id, number, eyebrow, title, children, className = "" }: { id: string; number: string; eyebrow: string; title: string; children: React.ReactNode; className?: string }) {
  return <Section id={id} className={`story-page ${className}`}><SkyDecor warm={className.includes("warm")} /><Reveal><div className="story-page-inner"><span className="page-number">{number} / 17</span><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><div className="story-page-copy">{children}</div></div></Reveal></Section>;
}

function Letter() {
  const [opened, setOpened] = useState(false);
  const openLetter = () => setOpened(true);
  return (
    <Section id="letter" className="letter-room">
      <div className="letter-atmosphere"><span>❀</span><span>✦</span><span>♡</span><span>✧</span><span>❀</span></div>
      <div className="section-heading on-paper-heading"><span className="eyebrow">A private little moment</span><h2>A letter for my {CONFIG.nickname}</h2><p>Open this when you are ready. 🤍</p></div>
      <div className={`letter-stage ${opened ? "is-open" : ""}`}>
        {!opened ? <>
          <div className="envelope" onClick={openLetter} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && openLetter()}>
            <div className="envelope-flap" />
            <div className="envelope-paper">FOR {CONFIG.recipient.toUpperCase()} <span>♡</span></div>
            <div className="wax-seal">M</div>
          </div>
          <Button onClick={openLetter}>Open letter</Button>
        </> : <>
          <div className="letter-burst" aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <span key={index} style={{ "--i": index } as React.CSSProperties}>{symbols[index % symbols.length]}</span>)}</div>
          <article className="love-letter">
            <div className="letter-corner letter-corner--one">❀</div><div className="letter-corner letter-corner--two">✧</div><div className="letter-corner letter-corner--three">✦</div><div className="letter-corner letter-corner--four">❀</div>
            <p className="letter-greeting">{CONFIG.letter.greeting}</p>
            {CONFIG.letter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="letter-signoff">{CONFIG.letter.signoff}</p>
            <p className="signature">— {CONFIG.creator} ✨</p>
          </article>
        </>}
      </div>
    </Section>
  );
}

function PageNav({ page, onPageChange }: { page: number; onPageChange: (page: number) => void }) {
  return <div className="page-nav" aria-label="Story navigation">
    <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1}>← Back</button>
    <div className="page-progress"><span>{String(page).padStart(2, "0")} / 17</span><i><b style={{ width: `${(page / 17) * 100}%` }} /></i></div>
    <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === 17}>{page === 17 ? "Finished" : "Next →"}</button>
  </div>;
}

export default function AppPremium() {
  const [page, setPage] = useState(1);
  const goTo = (nextPage: number) => setPage(Math.min(17, Math.max(1, nextPage)));
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);
  return <main className={`romantic-app step-page step-page--${page}`}>
    <Section className="hero" id="home"><SkyDecor dense /><div className="hero-content"><span className="eyebrow">A little world made with love</span><h1>For my<br /><em>{CONFIG.recipient}</em></h1><p className="hero-subtitle">A little piece of my heart,<br />made just for you.</p><Button onClick={() => goTo(2)}>Enter my little world</Button><div className="hero-date">{CONFIG.birthday} <span>•</span> just for {CONFIG.nickname}</div></div><div className="scroll-cue">tap next to continue <span>↓</span></div></Section>
    <Section className="countdown-section" id="countdown"><SkyDecor /><Reveal><span className="eyebrow">Until your birthday begins</span><h2>Someone has been waiting<br />for this moment<span className="rose-text">…</span></h2><p className="lead-copy">Not because today is just another day.<br />Because you deserve something made with care.</p><Countdown /><Button onClick={() => goTo(3)}>Open the story</Button></Reveal></Section>
    <Section className="story-section" id="story"><SkyDecor warm dense /><Reveal><div className="story-panel"><span className="eyebrow">For my {CONFIG.nickname}</span><h2>This isn't just a birthday wish.</h2><p>It's a little place I made with all the feelings I never really knew how to put into words.</p><p>So, before you read anything else, just stay here for a little while. 🤍</p><Button onClick={() => goTo(4)}>Step inside <span aria-hidden="true">→</span></Button></div></Reveal></Section>
    <StoryPage id="timeline" number="04" eyebrow="Some people become important quietly" title="There wasn't one particular moment."><p>There wasn't one particular moment when I decided you were going to mean this much to me.</p><p className="story-emphasis">It just happened.</p><p>Somewhere between our conversations, the random messages, the small things you said, and the moments I remember for no reason, you became someone my heart got attached to.</p><p>And somehow, without even realizing it, you became a part of my everyday thoughts.</p></StoryPage>
    <StoryPage id="phone" number="05" eyebrow="You became my notification" title="Sometimes it's just a message from you." className="warm-page"><div className="phone-scene"><div className="phone-mockup"><div className="phone-speaker" /><div className="phone-screen"><span className="phone-time">10:10</span><div className="message-bubble">Just a simple message.</div><div className="message-bubble message-bubble--soft">But somehow, seeing your name can change my whole mood. ♡</div></div></div></div><p>I check my phone. Then again. Then again.</p><p>And when there is nothing, my mind starts creating a hundred questions.</p><p className="story-emphasis">Sometimes I know I'm overthinking. But that's what happens when someone matters too much.</p></StoryPage>
    <StoryPage id="silence" number="06" eyebrow="And then there is the silence" title="Your silence affects me more than I wish it did."><p>When you don't reply, I try to tell myself not to think about it. I keep myself busy. I tell myself, “Don't overthink.”</p><p>But somewhere in my mind, I'm still waiting for that one notification.</p><p className="story-emphasis">I wish my heart knew how to be a little quieter.</p></StoryPage>
    <StoryPage id="iknow" number="07" eyebrow="I know" title="Your feelings are yours."><div className="statement-list"><span>I know your feelings aren't the same as mine.</span><span>I'm not making this to change your mind.</span><span>I'm not asking you for an answer.</span><span>I respect your feelings.</span></div></StoryPage>
    <StoryPage id="heart" number="08" eyebrow="But my heart didn't get the same message" title="My mind understands. My heart… not so much." className="heart-page"><div className="particle-heart">♡</div><p>I still care. I still wait. I still remember. I still worry.</p><p className="story-emphasis">And somewhere inside all of that, I still love you.</p></StoryPage>
    <Section className="memories-section" id="memories"><div className="section-heading"><span className="eyebrow">I don't want to force a place in your life</span><h2>Nothing from you. No pressure.</h2><p>I don't want you to talk to me because you feel guilty, or reply because you feel like you have to.</p></div><div className="memory-grid">{["Talk normally", "Laugh together", "Share random things", "Ask if you ate", "Be happy when you're happy", "Be there when you need someone"].map((title, index) => <Reveal key={title}><article className={`memory-card memory-card--${index + 1}`}><span className="memory-icon">{symbols[index % symbols.length]}</span><h3>{title}</h3><p>{["I don't want my feelings to become a responsibility for you.", "I still want to be able to talk to you normally.", "Share the small, ordinary pieces of life.", "Care in the simplest ways.", "Without demanding anything in return.", "Just be there, gently."][index]}</p></article></Reveal>)}</div></Section>
    <StoryPage id="ordinary" number="10" eyebrow="Maybe that's what my love looks like" title="Not holding you. Not controlling you."><div className="ordinary-grid"><span>Just caring. <b>♡</b></span><span>Even when it is difficult. <b>✦</b></span><span>Even when I don't know what tomorrow looks like. <b>✧</b></span><span>Even when I don't know what place I have in your life. <b>♡</b></span></div><p className="story-emphasis">You became important to me before I had a chance to decide whether I wanted you to be.</p></StoryPage>
    <Section className="quote-section" id="quote"><SkyDecor dense /><Reveal><div className="quote-mark">“</div><blockquote>I don't know how to imagine you with someone else.</blockquote><p className="lead-copy">I don't have a right to decide who you choose. Your happiness matters to me, even when my heart has to learn how to accept it.</p><span className="quote-rule" /></Reveal></Section>
    <StoryPage id="gallery" number="12" eyebrow="Bava…" title="You may never understand how deeply you've become a part of me."><div className="gallery-placeholders"><div><span>♡</span><p>You matter to me.</p><small>Your presence matters.</small></div><div><span>✦</span><p>Your messages matter.</p><small>Even the smallest moments have a place in my heart.</small></div><div><span>☾</span><p>Your silence matters too.</p><small>Sometimes more than I want it to.</small></div></div></StoryPage>
    <Section className="feeling-section" id="feeling"><SkyDecor warm dense /><Reveal><div className="feeling-panel"><span className="eyebrow">I don't know what the future is</span><h2>For once, I don't want to predict it.</h2><p>Maybe life changes everything. Maybe things become different. Maybe some things stay exactly the same.</p><p>I just want to appreciate what you are to me right now.</p><p className="highlight-line">Today, you're someone I care about deeply.</p></div></Reveal></Section>
    <StoryPage id="wishes" number="14" eyebrow="If my heart could speak" title="It wouldn't ask you for promises."><div className="wish-list wish-list--large"><span>“Will you love me?”</span><span>“Will you choose me?”</span><span className="story-emphasis">It would simply say…</span><span>“Bava, I'm glad you exist in my life.”</span></div></StoryPage>
    <Letter />
    <Section className="birthday-section" id="birthday"><SkyDecor dense /><Reveal><span className="eyebrow">And today is your day 🎂</span><h2>Happy Birthday,<br /><em>{CONFIG.recipient} 🤍</em></h2><p className="lead-copy">I hope this year gives you reasons to smile genuinely, and that the things you're working toward slowly become real.</p><div className="wish-list"><span>Healthy</span><span>Peaceful</span><span>Happy</span><span>Beautiful memories</span></div><p className="lead-copy">Somewhere, there is someone who genuinely wishes good things for you.</p></Reveal></Section>
    <Section className="final-section"><SkyDecor dense /><Reveal><div className="final-heart">♡</div><h2>10 • 10 • 2026</h2><p className="lead-copy">For my Bava.</p><p className="signature">— {CONFIG.creator} 🤍</p><p className="lead-copy">It was never about getting something from you. It was about someone becoming so important to my heart that even ordinary moments started feeling special.</p><Button onClick={() => goTo(1)}>Experience it again</Button></Reveal></Section>
    <PageNav page={page} onPageChange={goTo} />
  </main>;
}
