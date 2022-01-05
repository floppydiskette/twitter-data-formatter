const argv = require('minimist')(process.argv.slice(2));

// node . <tweet.js file>

function help() {
  console.log(`
    Usage:
      before running, make sure to change the first line of tweet.js to
        module.exports = [
      i am too lazy to make a workaround for this
    
      node . <tweet.js file>
    Options:
      --help, -h  Show this help message.
  `);
}

// function to return only the text of non-retweeted tweets
function getText(tweet) {
  if (tweet.tweet.retweeted) {
    return null;
  } else {
    return tweet.tweet.full_text;
  }
}


function main() {
  // if help is passed, or no arguments are passed, show help
  if (argv.help || !argv._.length) {
    help();
    return;
  }

  // parse first argument as a file path
  let filePath = argv._[0];

  // if the file path does not contain a full path, assume it is in the same directory as the script
  // thus add __dirname to the beginning of the file path
  if (!filePath.includes('/')) {
    filePath = __dirname + '/' + filePath;
  }

  // require the file
  const tweets = require(filePath);

  // create a new array with only the text of non-retweeted tweets
  const text = tweets.map(getText).filter(Boolean);

  // create a string with the following format
  // TWEET:
  //   <tweet content>
  // TWEET:
  //   <tweet content>
  // etc...

  const tweetString = text.map((tweet, index) => {
    return `TWEET ${index + 1}:
      ${tweet}
    `;
  }).join('\n');

  // write the string to output.txt
  const outputFile = 'output.txt';
  require('fs').writeFileSync(outputFile, tweetString);

  // print a message indicating that the file was written
  console.log(`
    The file ${outputFile} was written.
  `);

  return;
}

main();