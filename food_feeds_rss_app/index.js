import promptModule from "prompt-sync";
import Parser from "rss-parser";
const prompt = promptModule({sigint: true});
const parser = new Parser();
const customItems = [];
const main = async () => {
  const urls = [
    "https://www.bonappetit.com/feed/recipes-rss-feed/rss",
    "https://www.budgetbytes.com/category/recipes/feed/",
  ];
  const feedItems = [];
  const awaitableRequests = urls.map(url => parser.parseURL(url));
  const responses = await Promise.all(awaitableRequests);
  aggregate(responses, feedItems);
  print(feedItems);
}
const aggregate = (responses, feedItems) => {
  for(let {items} of responses) {
    for(let {title, link} of items) {
      if(title.toLowerCase().includes('chicken')) {
        feedItems.push({title,link});
      }
    }
  }
}
const print = feedItems => {
  const res = prompt('Add item: ');
  const [title, link] = res.split(',');
  if(![title, link].includes(undefined)) customItems.push({title, link});
  console.clear();
  console.table(feedItems.concat(customItems));
  console.log('Last updated', (new Date()).toUTCString() );
}
setInterval(main,2000);