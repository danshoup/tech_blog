const router = require('express').Router();
const { User, Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: {
        exclude: ['password']
      },
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      indlude: [
        {
          model: Post,
          attributes: ['id', 'title', 'content', 'createdAt']
        }
      ],
      attributes: { 
        exclude: ['password'] 
      }
    });
    if (!userData) {
      res.status(404).json({ message: 'There is no user with this id...' });
      return;
    }
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {

    const userData = await User.update(req.body, {
      individualHooks: true,
      where: { id: req.params.id },
    });

    if (!userData) {
      res.status(404).json({ 
        message: 'There was no user found with that id...'
      });

      return;
    }

    res.status(200).json(userData);


  } catch (err) {
    res.status(400).json(err);
  }

});


router.delete('/:id', async (req, res) => {
  try {

    const userData = await User.destroy({
      where: { id: req.params.id },
    });

    if (!userData) {
      res.status(404).json({ 
        message: 'There was no user found with that id...'
      });
      return;
    }

    res.status(200).json({ message: `Id: ${req.params.id} was deleted...`});

  } catch (err) {
    res.status(400).json(err);
  }

});



router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { name: req.body.name } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password; Please try again...' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password; Please try again...' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'Congratulations! You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
