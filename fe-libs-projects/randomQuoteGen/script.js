// Список цитат (можна замінити на API пізніше)
const quotes = [
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "Two things are infinite: the universe and human stupidity.", author: "Albert Einstein" },
    { text: "So many books, so little time.", author: "Frank Zappa" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" }
  ];
  
  // Функція генерації випадкової цитати
  function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  
  function displayQuote() {
    const quote = getRandomQuote();
    $('#text').text(quote.text);
    $('#author').text(`— ${quote.author}`);
    $('#tweet-quote').attr('href', `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" — ${quote.author}`)}`);
  }
  
  $(document).ready(function () {
    displayQuote(); // Показати цитату при завантаженні
  
    $('#new-quote').click(function () {
      displayQuote(); // Показати нову цитату при кліку
    });
  });
  