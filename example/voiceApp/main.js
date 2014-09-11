/* global MM, $ */


//////////////
// Initial import of symbols

var Cards = window.Cards;
Cards.initialize({
  parentSelector: '#cards',
  cardSelector: '.card',
  templateDirectory: '../../dist/widgets/cards',
  templateName: 'cardTemplate',
  duration: 300
});

var Microphone = window.MindMeldMicrophone;

///////
// Microphone

$(function() {

  Microphone.on('result', function(result) {
    $('#searchInput').val(result.transcript);
    $('#searchInput').toggleClass('final', result.final);
    if (result.final) submitInput(result.transcript);
  });

});

//////////////
// Search Input

$(function() {

  $('#searchInput').on('focus', function() {
    $('#searchInput').removeClass('final');
  });

  $('#searchInput').keypress(function (e) {
    // We are looking for CR (keyCode 13)
    var keyCode = e.originalEvent.keyCode;
    if (keyCode !== 13) {
      return;
    }

    // User pressed return
    $('#searchInput').blur();
    $('#searchInput').addClass('final');
    var text = $('#searchInput').val().trim();
    $('#searchInput').val(text);
    submitInput(text);

    return false;
  });

});

///////////////
// MM

// Convert the raw data for card into the data needed for the template.
// Must return new data
var processRawCardData = function (card) {
  card.title = card.title.replace(/ \| .*$/, '');
  if (card.image) {
    card.imageUrl = card.image.url;
  }

  card.description = card.description || '';
  card.description = card.description.substr(0, 150) + (card.description.length > 150 ? '…' : '');

  card.price = card.price && card.price.trim();

  if (card.categories) {
    card.category = card.categories[0];
  }

  return card;
};

var submitInput = function(text) {
  Cards.setLoading(true);
  MM.activeSession.textentries.post({
    text: text,
    type: 'text',
    weight: 1.0
  }, function onTextEntryPosted (textEntryResult) {
    MM.activeSession.documents.get({
      limit: 12
    },
    function onDocumentsRetrieved (documentResult) {
      var cards = documentResult.data.map(processRawCardData);
      Cards.setCards(cards, function onClick(event) {
        // Set the function body and return false for custom event handling.
        // return false;

        // Return true for default event handling (following link)
        return true;
      });
      Cards.setLoading(false);
    },
    function onError (error) {
      console.error('Error getting documents:', error);
      Cards.setLoading(false);
    });
  });

};

////////
// Config

var config = {
  appid: 'a8794c3630531468cfdba416823cfec507a4249c',
  cleanUrl: 'https://api-west-dev-d.expectlabs.com/',
  fayeClientUrl: 'https://push-west-dev-d.expectlabs.com:443/faye',
};

MM.start(config);
