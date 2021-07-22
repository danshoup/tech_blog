const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const posttData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template; render 'homepage'
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get page to display a single blog post
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['name']
            },
          ],
        },
      ],
    });

    if (!postData) {
      res.status(404).json({ MESSAGE: 'There is no post associated with that ID...' });
      return;
    };

    const post = postData.get({ plain: true });

    res.render('single_post', {
      ...post,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err);
  }

});

// Get page to diplay 'edit blog post' handlebars
router.get('/edit_post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['name']
            },
          ],
        },
      ],
    });

    if (!postData) {
      res.status(404).json({ MESSAGE: 'There is no post associated with that ID...' });
      return;
    };

    const post = postData.get({ plain: true });

    res.render('edit_post', {
      ...post,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err);
  }

});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/new_post', (req, res) => {
  // If the user is already logged in, direct to 'new_post'
  if (req.session.logged_in) {
    res.redirect('/new_post');
    return;
  }
  res.render('login');
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect to 'homepage'
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {
  // Route to 'signup' page unless logged in; then redirict to 'homepage'
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

module.exports = router;
