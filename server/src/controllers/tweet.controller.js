const tweetService = require("../services/tweet.service");

exports.getFeed = async (req, res, next) => {
  try {
    const tweets = await tweetService.getTweets(req.query.sort);
    res.json(tweets);
  } catch (error) {
    next(error);
  }
};

exports.createTweet = async (req, res, next) => {
  try {
    const { content, sportCategory, tags } = req.body;
    const authorId = req.user.id;

    const tweet = await tweetService.createTweet(
      { content, sportCategory, tags },
      authorId,
    );

    res.status(201).json(tweet);
  } catch (error) {
    next(error);
  }
};

exports.upvoteTweet = async (req, res, next) => {
  try {
    const tweetId = parseInt(req.params.id);
    const userId = req.user.id;

    await tweetService.upvoteTweet(tweetId, userId);

    res.json({ message: "Upvoted" });
  } catch (error) {
    next(error);
  }
};

exports.downvoteTweet = async (req, res, next) => {
  try {
    const tweetId = parseInt(req.params.id);
    const userId = req.user.id;

    await tweetService.downvoteTweet(tweetId, userId);

    res.json({ message: "Downvoted" });
  } catch (error) {
    next(error);
  }
};
