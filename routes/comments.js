var express = require('express');
var router = express.Router();

/* GET comments page -- list all comments, newest first. */
router.get('/', function (req, res, next) {
  try {
    req.db.query(
      'SELECT name, message, rating, created_at FROM comments ORDER BY id DESC;',
      (err, results) => {
        if (err) {
          console.error('Error fetching comments:', err);
          return res.status(500).send('Error fetching comments');
        }
        res.render('comments', {
          title: 'Comments',
          comments: results,
          error: null,
          success: req.query.success === '1'
        });
      }
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});

/* POST a new comment. */
router.post('/create', function (req, res, next) {
  const name = (req.body.name || '').trim().slice(0, 60);
  const message = (req.body.message || '').trim().slice(0, 500);
  let rating = parseInt(req.body.rating, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) rating = 5;

  // Server-side validation: re-render the page with an error if fields are empty.
  if (!name || !message) {
    return req.db.query(
      'SELECT name, message, rating, created_at FROM comments ORDER BY id DESC;',
      (err, results) => {
        if (err) {
          console.error('Error fetching comments:', err);
          return res.status(500).send('Error fetching comments');
        }
        res.status(400).render('comments', {
          title: 'Comments',
          comments: results,
          error: 'Please add both your name and a message.',
          success: false
        });
      }
    );
  }

  try {
    req.db.query(
      'INSERT INTO comments (name, message, rating) VALUES (?, ?, ?);',
      [name, message, rating],
      (err, results) => {
        if (err) {
          console.error('Error adding comment:', err);
          return res.status(500).send('Error adding comment');
        }
        // Redirect after POST so a refresh doesn't resubmit.
        res.redirect('/comments?success=1');
      }
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});

module.exports = router;
