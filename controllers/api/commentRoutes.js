const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Post,
                    attributes: ['id', 'title', 'createdAt'],
                    indlude: [
                        {
                            model: User,
                            attributes: ['name']
                        }
                    ]
                }
            ]
        });

        res.status(200).json(commentData);

    }   catch (err) {
        res.status(500).json(err);
    }

});

router.get('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Post,
                    attributes: ['id', 'title', 'createdAt'],
                    indlude: [
                        {
                            model: User,
                            attributes: ['name']
                        }
                    ]
                }
            ]
        });
        if (!commentData) {
            res.status(404).json({ message: 'There is no comment with this id...' });
            return;
        }
        res.status(200).json(commentData);
    }   catch (err) {
        res.status(500).json(err);
    }
});


router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const commentData = await Comment.create( {
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(commentData);
    }   catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const commentUpdate = await Comment.update(req.body, {
            where: {
                id: req.params.id
            },
        });

        if (!commentUpdate) {
            res.status(404).json({ message: 'There is no comment with this id...' });
            return;
        }

        res.status(200).json(commentUpdate);

    }   catch (err) {
        res.status(500).json(err);
    };
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentDelete = await Comment.destroy({
            where: {
                id: req.params.id
            },
        });

        if (!commentDelete) {
            res.status(404).json({ message: 'There is no comment with this id...'});
            return;
        }

        res.status(200).json(commentDelete);

    }   catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;