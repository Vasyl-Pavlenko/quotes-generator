import React, { useEffect, useState, useCallback } from 'react';
import { Loader } from './Loader/Loader';
import './App.css';
import { FaQuoteLeft } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaTumblr } from "react-icons/fa";

const URL = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';
const colors = [
  '#16a085',
  '#27ae60',
  '#2c3e50',
  '#f39c12',
  '#e74c3c',
  '#9b59b6',
  '#FB6964',
  '#342224',
  '#472E32',
  '#BDBB99',
  '#77B1A9',
  '#73A857'
];

const getRandomQuote = (quotes) => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

const setRandomQuoteStyles = () => {
  const color = Math.floor(Math.random() * colors.length);
  document.body.style.backgroundColor = colors[color];
  document.body.style.color = colors[color];
  document.querySelectorAll('.button').forEach(button => {
    button.style.backgroundColor = colors[color];
  });
};

export const App = () => {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(URL);
      const data = await response.json();
      const quotesArray = data.quotes;
      setQuotes(quotesArray);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsError(true);
      setErrorMessage('Oops... Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const getQuote = useCallback(() => {
    if (quotes.length > 0) {
      const randomQuote = getRandomQuote(quotes);
      setQuote(randomQuote.quote);
      setAuthor(randomQuote.author);
      setRandomQuoteStyles();
    }
  }, [quotes]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && !isError && quotes.length > 0) {
      getQuote();
    }
  }, [isLoading, isError, quotes, getQuote]);

  const tweetQuoteUrl = 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' +
    encodeURIComponent('"' + quote + '" ' + author);
  const tumblrQuoteUrl = 'https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=' +
    encodeURIComponent(author) +
    '&content=' +
    encodeURIComponent(quote) +
    '&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button';

  return (
    <>
      {isLoading && <Loader />}
      {isError && (
        <p className="error-message">{errorMessage}</p>
      )}
      {!isLoading && !isError && (
        <div
          className="wrapper quote-box"
          id="quote-box"
        >
          <div
            className="quote-text"
            id="text"
          >
            <FaQuoteLeft />
            <span>{quote}</span>
          </div>

          <div
            className="quote-author"
            id="author"
          >
            - {author}
          </div>

          <div className="buttons">
            <a
              href={tweetQuoteUrl}
              className="button tweet-quote"
              id="tweet-quote"
              title="Tweet this quote!"
              target="_top"
            >
              <FaTwitter className='icon' />
            </a>

            <a
              href={tumblrQuoteUrl}
              className="button tumblr-quote"
              id="tumblr-quote"
              title="Post this quote on tumblr!"
              target="_blank"
              rel="noreferrer"
            >
              <FaTumblr className='icon' />
            </a>

            <button
              className="button new-quote"
              id="new-quote"
              onClick={getQuote}
            >
              New quote
            </button>
          </div>
        </div>
      )}
      <div className="footer">
        by <a
          className="footer-link"
          href="https://codepen.io/Vasyl-Pavlenko/"
        >Vasyl Pavlenko</a>
      </div>
    </>
  );
};
