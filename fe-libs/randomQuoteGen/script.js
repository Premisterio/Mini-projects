$(document).ready(function () {
  const quotes = [
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "Two things are infinite: the universe and human stupidity.", author: "Albert Einstein" },
    { text: "So many books, so little time.", author: "Frank Zappa" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" }
  ];


  const colorThemes = [
    {
      background: 'hsl(200, 70%, 80%)',
      text: 'hsl(200, 70%, 30%)'
    },
    {
      background: 'hsl(160, 40%, 80%)',
      text: 'hsl(160, 60%, 25%)'
    },
    {
      background: 'hsl(90, 30%, 75%)',
      text: 'hsl(90, 50%, 30%)'
    },
    {
      background: 'hsl(20, 50%, 85%)',
      text: 'hsl(20, 70%, 35%)'
    },
    {
      background: 'hsl(270, 25%, 80%)',
      text: 'hsl(270, 45%, 30%)'
    },
    {
      background: 'hsl(220, 30%, 75%)',
      text: 'hsl(220, 55%, 30%)'
    },
    {
      background: 'hsl(150, 35%, 80%)',
      text: 'hsl(150, 60%, 25%)'
    },
    {
      background: 'hsl(10, 50%, 85%)',
      text: 'hsl(10, 70%, 35%)'
    },
    {
      background: 'hsl(40, 40%, 80%)',
      text: 'hsl(40, 60%, 30%)'
    },
    {
      background: 'hsl(190, 30%, 75%)',
      text: 'hsl(190, 55%, 30%)'
    }
  ];

  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function setUI() {
    const quote = getRandomItem(quotes);
    const theme = getRandomItem(colorThemes);

    // Text animation
    $('.quote-text, .quote-author').animate({ opacity: 0 }, 300, function () {
      $('#text').text(quote.text);
      $('#author').text(`— ${quote.author}`);
      $('.quote-text, .quote-author').animate({ opacity: 1 }, 300);
    });

    // Background gradient
    $('body').css('background', `linear-gradient(135deg, ${theme.background}, white)`);

    // Quote color
    $('.quote-text, .quote-author').css('color', theme.text);

    // Btn + icon styles
    $('.btn').css({
      backgroundColor: theme.text,
      borderColor: theme.background
    });

    // Twitter share link
    $('#tweet-quote').attr(
      'href',
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" — ${quote.author}`)}`
    );

    // Fade in quote box if hidden
    $('#quote-box').fadeTo(600, 1);
    // Set quote icon color to match text (inside box)
    $('.bi-quote').css('color', theme.text);
    // Set other icons (tweet + refresh) to also use the text color for better contrast on soft button background
    $('.bi-twitter-x, .bi-arrow-clockwise').css('color', "#ffffff");
    // Footer styles
    $('footer').css('color', theme.text);
    $('.footer-a').css('color', theme.text);
  }

  // Initial quote
  setUI();

  // Event: next quote
  $('#new-quote').click(setQuote);
});
