const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
try {
    const postData = await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['name']
            },
        ],
    });
    res.status(200).json(postData);
    } catch (err) {
    res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        }
                    ]
                }
            ],
        });
        if (!postData) {
            res.status(404).json({ message: 'There is no post with this id...' });
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const postData = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        req.status(200).json(postData);
    }   catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const postUpdate = await Post.update(req.body, {
            where: {
                id: req.params.id
            },
        });
        
        if (!postUpdate) {
            res.status(404).json({ message: 'Ther is no post associated with this id...'});
            return;
        }
        
        res.status(200).json(postUpdate);

    } catch (err) {
        res.status(500).json(err);
    };
});

router.delete('/:id', async (req, res) => {
    try {
        const postDelete = await Post.destroy({
            where: {
                id: req.params.id
            },
        });

        if (!postDelete) {
            res.status(404).json({ message: 'Ther is no post associated with this id...'});
            return;
        }

        res.status(200).json(postDelete);

    }   catch (err) {
        res.status(500).json(err);
    }
    
});

module.exports = router;

