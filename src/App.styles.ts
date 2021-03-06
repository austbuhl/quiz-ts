import styled, { createGlobalStyle } from 'styled-components'
import BGIMage from './imgs/BG.jpg'

export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    background-image: url(${BGIMage});
    background-size: cover;
    margin: 0;
    padding: 0 20px;
    display: flex;
    justify-content: center;
  }

  * {
    box-sizing: border-box;
    font-family: 'Catamaran', sans-serif;
  }
  `

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  /* > p {
    color: white;
  } */

  .score {
    /* color: black; */
    font-size: 2rem;
    margin: 0;
  }

  h1 {
    font-family: Fascinate Inline;
    background-image: linear-gradient(180deg, gray, #87f1ff);
    background-size: 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    filter: drop-shadow(2px 2px black);
    font-size: 70px;
    text-align: center;
    font-weight: 400;
    margin: 20px;
  }

  .start,
  .next,
  .submit {
    cursor: pointer;
    background: linear-gradient(180deg, white, #ffcc91);
    border: 2px solid #d38558;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    height: 40px;
    margin: 20px 0;
    padding: 0 40px;
  }

  .start {
    max-width: 200px;
  }

  select {
    border-radius: 10px;
    outline-width: 0;
  }
`
export const Leaderboard = styled.div`
  max-width: 1100px;
  background: #ebfeff;
  border-radius: 10px;
  border: 2px solid #0085a3;
  padding: 20px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  text-align: center;

  p {
    font-size: 1rem;
  }

  input {
    border-radius: 10px;
    outline-width: 0;
    padding: 0.5em;
    width: 100%;
  }
`
