import React, { useState } from 'react'
import { fetchQuizQuestions } from './API'
import QuestionCard from './components/QuestionCard'
import { QuestionState, Difficulty } from './API'

type AnswerObject = {
  question: string
  answer: string
  correct: boolean
  correctAnswer: string
}

const TOTAL_QUESTIONS = 10

const App = () => {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [current, setCurrent] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  const startQuiz = async () => {
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    )

    setQuestions(newQuestions)
    setScore(0)
    setUserAnswers([])
    setCurrent(0)
    setLoading(false)
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

  return (
    <div className='App'>
      <h1>Quiz APP</h1>
      {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && (
        <button className='start' onClick={startQuiz}>
          Start
        </button>
      )}
      {!gameOver && <p className='score'>Score: </p>}
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
    </div>
  )
}

export default App
