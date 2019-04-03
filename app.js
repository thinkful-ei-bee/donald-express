'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Would you like some extra paper towels?');
});

app.get('/pizza/pineapple', (req, res) => {
  res.send('You have great taste');
});

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
  `;
  res.send(responseText);
});

app.get('/sum', (req, res) => {
  const a = req.query.a;
  const b = req.query.b;
  const c = parseInt(a) + parseInt(b);

  const sum = `The sum of ${req.query.a} and ${req.query.b} is ${c}`;
  res.send(sum);
});

app.get('/cipher', (req, res) => {
  const text = req.query.text;
  const shift = parseInt(req.query.shift);
  const base = 'A'.charCodeAt(0);

  const shifted = text
    .toUpperCase()
    .split('')
    .map(letter => {
      const code = letter.charCodeAt(0);
      if (code < base || code > base + 26) {
        return letter;
      }
      // get the distance from A
      let diff = code - base;
      diff = diff + shift;
      // in case shift takes the value past Z, cycle back to the beginning
      diff = diff % 26;

      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join('');

  res.send(shifted);
});

app.get('/lotto', (req, res) => {
  const { numbers } = req.query;

  if (!numbers) {
    return res.status(200).send('numbers is required');
  }

  if (!Array.isArray(numbers)) {
    return res.status(200).send('numbers must be an array');
  }

  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  if (guesses.length !== 6) {
    return res
      .status(400)
      .send('numbers must contain 6 integers between 1 and 20');
  }

  // fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20)
    .fill(1)
    .map((_, i) => i + 1);

  //randomly choose 6
  const winningNumbers = [];
  for (let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  //compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  switch (diff.length) {
    case 0:
      responseText = 'Wow! Unbelievable! You could have won the mega millions!';
      break;
    case 1:
      responseText = 'Congratulations! You win $100!';
      break;
    case 2:
      responseText = 'Congratulations, you win a free ticket!';
      break;
    default:
      responseText = 'Sorry, you lose';
  }
  res.send(responseText);
});
