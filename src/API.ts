import { shuffleArray } from './utils'

export type Question = {
  category: string
  correct_answer: string
  difficulty: string
  incorrect_answers: string[]
  question: string
  type: string
}

export type QuestionState = Question & { answers: string[] }

// export type Difficulty = {
//   difficulty: string
// }

export const fetchQuizQuestions = async (
  amount: number,
  difficulty: string
) => {
  const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
  const resp = await fetch(endpoint)
  const data = await resp.json()
  return data.results.map((question: Question) => ({
    ...question,
    answers: shuffleArray([
      ...question.incorrect_answers,
      question.correct_answer
    ])
  }))
}
