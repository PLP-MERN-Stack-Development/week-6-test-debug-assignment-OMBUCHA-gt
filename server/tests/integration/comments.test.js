const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Post = require('../../src/models/Post');
const User = require('../../src/models/User');
const Comment = require('../../src/models/Comment');
const { generateToken } = require('../../src/utils/auth');

let mongoServer, user, token, post;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  user = await User.create({
    username: 'commentuser',
    email: 'comment@example.com',
    password: 'password123',
  });
  token = generateToken(user);

  post = await Post.create({
    title: 'Post for comments',
    content: 'This post will have comments',
    author: user._id,
    category: new mongoose.Types.ObjectId(),
    slug: 'comment-post',
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Comments API', () => {
  it('should add a comment to a post', async () => {
    const res = await request(app)
      .post(`/api/comments/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'This is a comment' });

    expect(res.status).toBe(201);
    expect(res.body.text).toBe('This is a comment');
  });

  it('should retrieve comments for a post', async () => {
    const res = await request(app).get(`/api/comments/${post._id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should not allow unauthenticated comment creation', async () => {
    const res = await request(app)
      .post(`/api/comments/${post._id}`)
      .send({ text: 'Blocked comment' });

    expect(res.status).toBe(401);
  });
});
