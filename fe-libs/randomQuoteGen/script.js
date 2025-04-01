$(document).ready(function () {
  let firstTime = true;
  let quotes = [];
  
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

  async function setUI() {

    if (quotes.length === 0) return;

    const quote = getRandomItem(quotes);
    const theme = getRandomItem(colorThemes);

    // Text animation
    $('.quote-text, .quote-author').animate({ opacity: 0 }, 300, function () {
      const quoteText = quote.quote;
      $('#text').text(quoteText);
      if (quoteText.length > 120) {
        $('#text').removeClass('fs-1').addClass('fs-4');
      } else {
        $('#text').removeClass('fs-4').addClass('fs-1');
      }
      $('#author').text(`— ${quote.author}`);
      $('.quote-text, .quote-author').animate({ opacity: 1 }, 300);
    });

    // Background gradient
    $('body').css('background', `linear-gradient(135deg, ${theme.background}, white)`);

    // Quote
    $('.quote-text, .quote-author').css('color', theme.text);

    // Btn + icon styles
    $('.btn').css({
      backgroundColor: theme.text,
      borderColor: theme.background
    });

    // Twitter link
    $('#tweet-quote').attr(
      'href',
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" — ${quote.author}`)}`
    );

    // Icon colors
    $('.bi-quote').css('color', theme.text);

    // Tweet + refresh
    $('.bi-twitter-x, .bi-arrow-clockwise').css('color', "#ffffff");
    
    // Footer
    $('footer').css('color', theme.text);
    $('.footer-a').css('color', theme.text);

    // First time fade-in
    if (firstTime) {
      $('#quote-box, footer, .btn, .bi').fadeTo(600, 1);
      firstTime = false;
    }
  }

  // Initial quote
  setUI();

  // Next quote
  $('#new-quote').click(setUI);

  async function loadQuotes() {
    try {
      const response = await fetch('https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json');
      const data = await response.json();
      quotes = data.quotes;
      setUI();
    } catch (error) {
      $('#text').text('Failed to load quotes 😞');
      $('#author').text('');
      console.error('Error loading quotes:', error);
    }
  }

  // Init
  loadQuotes();

  $('#new-quote').click(() => setUI());
});
