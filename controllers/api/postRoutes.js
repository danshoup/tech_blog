const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/');

router.get('/:id');

router.post('/');

router.put('/:id');

router.delete('/:id');

module.exports = router;