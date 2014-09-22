/* global MM, $ */

/* Initialize Widgets */
var Cards = window.MindMeldCards;
Cards.initialize({
  parentSelector: '#cards',
  cardSelector: '.card',
  templateDirectory: '../../dist/widgets/cards',
  templateName: 'cardTemplate',
  duration: 300
});

var SearchInput = window.MindMeldSearchInput;

var Microphone = window.MindMeldMicrophone;

/* Helper functions for processing and submitting data */

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

var submitText = function(text) {
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

/* Set up widget events */

Microphone.on('start', function () {
  console.log('Microphone started');
});

Microphone.on('stop', function () {
  console.log('Microphone stopped');
});

Microphone.on('error', function (event) {
  // Some errors are benign
  if (event.error === 'aborted' || event.error === 'no-speech') return;
  console.error('Microphone error', event.error);
});

Microphone.on('result', function(result) {
  SearchInput.setText(result.transcript, result.final);
  submitText(result.transcript);
});

SearchInput.on('submitText', submitText);

/* Initialize MindMeld */

var config = {
  appid: 'a8794c3630531468cfdba416823cfec507a4249c',
  cleanUrl: 'https://api-west-dev-d.expectlabs.com/',
  fayeClientUrl: 'https://push-west-dev-d.expectlabs.com:443/faye',
};

MM.start(config, function onSuccess () {
  console.log('MindMeld initialized successfully.');
  Microphone.initialize($('.mindmeld-microphone')[0]);
  SearchInput.initialize($('.mindmeld-search')[0]);

}, function onFail (error) {
  console.error('MindMeld failed to initialize:', error);
});
