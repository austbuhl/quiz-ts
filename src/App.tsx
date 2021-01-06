import React, { useState, useEffect } from 'react'
import { fetchQuizQuestions } from './API'
import QuestionCard from './components/QuestionCard'
import { QuestionState } from './API'
import { GlobalStyle, Wrapper, Leaderboard } from './App.styles'

export type AnswerObject = {
  question: string
  answer: string
  correct: boolean
  correctAnswer: string
}

const TOTAL_QUESTIONS = 10

type ScoreObject = {
  id: number
  difficulty: string
  score: number
  createdAt: Date
  updatedAt: Date
  User: {
    id: number
    username: string
    createdAt: Date
    updatedAt: Date
  }
}

const App = () => {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [current, setCurrent] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)
  const [difficulty, setDifficulty] = useState('easy')
  const [topScores, setTopScores] = useState<ScoreObject[]>([])
  const [username, setUsername] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const startQuiz = async () => {
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, difficulty)

    setQuestions(newQuestions)
    fetchTopScores()
    setScore(0)
    setUserAnswers([])
    setCurrent(0)
    setLoading(false)
    setSubmitted(false)
  }

  useEffect(() => {
    if (userAnswers.length === TOTAL_QUESTIONS) {
      setGameOver(true)
    }
  }, [userAnswers])

  const fetchTopScores = () => {
    fetch('http://localhost:5000/scores')
      .then((res) => res.json())
      .then((scores) => setTopScores(scores))
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value
      const correct = questions[current].correct_answer === answer
      if (correct) setScore((prev) => prev + 1)

      const answerObject = {
        question: questions[current].question,
        answer,
        correct,
        correctAnswer: questions[current].correct_answer
      }

      setUserAnswers((prev) => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    const nextQuestion = current + 1
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setCurrent(nextQuestion)
    }
  }

  const adjustDifficulty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value)
  }

  const renderTopScores = () => {
    return topScores
      .sort((a, b) => b.score - a.score)
      .filter((score) => score.difficulty.toLowerCase() === difficulty)
      .slice(0, 10)
      .map((score) => (
        <li key={score.id}>{`${score.User.username} - ${score.score}`}</li>
      ))
  }

  const submitScore = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetch('http://localhost:5000/scores', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accepts: 'application/json'
      },
      body: JSON.stringify({
        username: username,
        score: score,
        difficulty: difficulty
      })
    })
      .then((res) => res.json())
      .then((score) => {
        setTopScores([score, ...topScores])
        setUsername('')
        setSubmitted(true)
      })
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>Quiz APP</h1>
        {!gameOver && <p className='score'>Score: {score}</p>}
        {gameOver && userAnswers.length > 0 && (
          <Leaderboard>
            <h3>{`Leaderboard - ${difficulty.toUpperCase()}`}</h3>
            <ol>{renderTopScores()}</ol>
            <p className='score'>Final Score: {score}</p>
            {!submitted && (
              <form onSubmit={submitScore}>
                <input
                  type='text'
                  placeholder='Enter Name'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button className='submit'>Submit Score</button>
              </form>
            )}
            <button className='start' onClick={() => setUserAnswers([])}>
              Restart?
            </button>
          </Leaderboard>
        )}

        {gameOver && userAnswers.length === 0 && (
          <select
            name='difficulty'
            id='difficulty'
            value={difficulty}
            onChange={adjustDifficulty}
          >
            <option value='easy'>Easy</option>
            <option value='medium'>Medium</option>
            <option value='hard'>Hard</option>
          </select>
        )}
        {gameOver && userAnswers.length === 0 && (
          <>
            <button className='start' onClick={startQuiz}>
              Start
            </button>
          </>
        )}
        {loading && <p>Loading Questions...</p>}

        {!loading && !gameOver && (
          <QuestionCard
            questionNum={current + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[current].question}
            answers={questions[current].answers}
            userAnswer={userAnswers ? userAnswers[current] : undefined}
            callback={checkAnswer}
          />
        )}

        {!gameOver &&
          !loading &&
          userAnswers.length === current + 1 &&
          current !== TOTAL_QUESTIONS - 1 && (
            <button className='next' onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </>
  )
}

export default App
