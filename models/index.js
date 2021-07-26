const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');


// User has many Posts
User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});

// Post belongs to User
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// Comment belongs to User
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});


// Commment belongs to Post
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// User has many Comments
User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
});

// Post has many Comments
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'cascade'
});

module.exports = { 
    User, 
    Post, 
    Comment 
};