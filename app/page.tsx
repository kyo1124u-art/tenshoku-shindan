"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { diagnose, LINE_URL, questions, SERVICES_URL, type Answers } from "@/config/diagnosis";

type Screen = "home" | "questions" | "loading" | "line";

function BrandMark() {
  return (
    <div className="brand" aria-label="転職診断">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>転職診断</span>
    </div>
  );
}

function ArrowIcon() {
  return <span className="arrow" aria-hidden="true">→</span>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentQuestion = questions[questionIndex];
  const result = useMemo(() => diagnose(answers), [answers]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  function start() {
    setAnswers({});
    setQuestionIndex(0);
    setScreen("questions");
  }

  function selectAnswer(optionId: string) {
    const nextAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(nextAnswers);
    timeoutRef.current = setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex((index) => index + 1);
      } else {
        setScreen("loading");
        timeoutRef.current = setTimeout(() => setScreen("line"), 3000);
      }
    }, 220);
  }

  function goBack() {
    if (questionIndex === 0) setScreen("home");
    else setQuestionIndex((index) => index - 1);
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="site-header">
        <BrandMark />
        <span className="header-note">かんたん1分・完全無料</span>
      </header>

      {screen === "home" && (
        <section className="home-screen screen-enter" aria-labelledby="hero-title">
          <div className="eyebrow"><span className="eyebrow-dot" />20〜30代の転職選びをサポート</div>
          <h1 id="hero-title">あなたに合う<br /><span>転職サービス</span>が<br />1分でわかる</h1>
          <p className="hero-copy">8つの質問に答えるだけで、<br />あなたに合う転職サービスを診断します。</p>
          <div className="promise-row" aria-label="サービスの特徴">
            <div><span>01</span>登録不要</div>
            <div><span>02</span>約1分</div>
            <div><span>03</span>完全無料</div>
          </div>
          <button className="primary-button" onClick={start}>無料診断を始める<ArrowIcon /></button>
          <p className="microcopy">回答内容は診断以外の目的には使用しません</p>
        </section>
      )}

      {screen === "questions" && currentQuestion && (
        <section className="question-screen screen-enter" aria-live="polite">
          <div className="progress-meta">
            <button className="back-button" onClick={goBack} aria-label="前の画面に戻る"><span aria-hidden="true">←</span> 戻る</button>
            <p><strong>{String(questionIndex + 1).padStart(2, "0")}</strong><span> / {String(questions.length).padStart(2, "0")}</span></p>
          </div>
          <div className="progress-track" role="progressbar" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={questionIndex + 1} aria-label={`質問 ${questionIndex + 1} / ${questions.length}`}>
            <div style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
          </div>
          <div className="question-heading" key={currentQuestion.id}>
            <p className="question-label">QUESTION {questionIndex + 1}</p>
            <h2>{currentQuestion.title}</h2>
            {currentQuestion.helper && <p className="question-helper">{currentQuestion.helper}</p>}
          </div>
          <div className="options" key={`${currentQuestion.id}-options`}>
            {currentQuestion.options.map((option, index) => {
              const selected = answers[currentQuestion.id] === option.id;
              return (
                <button className={`option-button ${selected ? "selected" : ""}`} key={option.id} onClick={() => selectAnswer(option.id)} style={{ animationDelay: `${index * 35}ms` }}>
                  <span>{option.label}</span><i aria-hidden="true">→</i>
                </button>
              );
            })}
          </div>
          <p className="auto-note">選択すると自動で次の質問へ進みます</p>
        </section>
      )}

      {screen === "loading" && (
        <section className="center-screen screen-enter" aria-live="polite">
          <div className="loader-orbit" aria-hidden="true"><div className="loader-core"><span /></div></div>
          <p className="loading-kicker">ANALYZING</p>
          <h2>診断結果を作成しています...</h2>
          <p>あなたの回答をもとに、相性のよいサービスを選定中です</p>
          <div className="loading-steps" aria-hidden="true"><i /><i /><i /></div>
        </section>
      )}

      {screen === "line" && (
        <section className="result-screen screen-enter" aria-labelledby="result-title">
          <div className="success-mark" aria-hidden="true"><span>✓</span></div>
          <p className="complete-label">DIAGNOSIS COMPLETE</p>
          <h2 id="result-title">転職診断が完了しました！</h2>
          <p className="result-lead">あなたに合った転職方法と、おすすめの転職サービスが見つかりました。</p>
          <a className="line-button" href={LINE_URL} data-diagnosis={result} target="_blank" rel="noopener noreferrer">
            <span className="line-icon" aria-hidden="true">LINE</span>
            LINEで無料診断結果を見る
            <ArrowIcon />
          </a>
          <div className="secure-note"><span aria-hidden="true">⌾</span>※LINE開けない場合は右上の「...」を押してブラウザで開く</div>
          <div className="secondary-card">
            <div className="secondary-badge">LINE登録なし</div>
            <h3>LINEを使わずに<br />第二新卒の転職サービスを探したい方へ</h3>
            <p>あなたの希望条件に合う転職サービスを無料で確認できます。</p>
            <a className="secondary-button" href={SERVICES_URL} target="_blank" rel="noopener noreferrer">
              おすすめの転職サービスを見る
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      )}

      <footer><p>© 2026 転職診断</p><span>転職を、もっと自分らしく。</span></footer>
    </main>
  );
}
