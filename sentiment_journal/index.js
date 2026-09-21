import Spellchecker from "spellchecker";
import natural from "natural";
import prompt from 'prompt';
import { removeStopwords } from 'stopword';
prompt.start({});
prompt.message = '';
const tokenizer = new natural.WordTokenizer();

const correctSpelling = inputString => {
  const words = inputString.split(' ');
  const corrections = [];
  for(let word of words) {
    if(Spellchecker.isMisspelled(word)) {
      const options = Spellchecker.getCorrectionsForMisspelling(word);
      corrections.push(options[0]);
    } else {
      corrections.push(word);
    }
  }
  return corrections.join(' ');
}

const tokenizeInput = (inputString) => {
  return tokenizer.tokenize(inputString);
}

const stemWords = tokens => {
  const stems = [];
  for(let token of tokens) {
    const stem = natural.PorterStemmer.stem(token);
    stems.push(stem);
  }
  return stems;
}

// (async () => {
  try {
    const {inputString} = await prompt.get({
      name: 'inputString',
      description: 'How do you feel?',
    });
    const correctedSpelling = correctSpelling(inputString);
    const tokens = tokenizeInput(correctedSpelling);
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const sentimentResults = analyzer.getSentiment(tokens);
    console.log(sentimentResults);
  } catch(e) {
    console.error(`An error occured: ${e.message}`);
  }
// })();
