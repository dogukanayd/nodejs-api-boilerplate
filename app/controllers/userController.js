const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./../models/User');

/*eslint-disable*/
/**
 * @api {post} /auth/register Register
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String} fullName Required
 * @apiParam {String} email  Required
 * @apiParam {String} password     Required
 *
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "message": "User created"
 *  }
 */
exports.register = (req, res) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Mail exists',
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          fullName: req.body.fullName,
          email: req.body.email,
          password: hash,
        });
        newUser
          .save()
          .then((result) => {
            res.status(201).json({
              message: 'User created',
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      });
    });
};


/**
 * @api {post} /auth/login Login
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} email required
 * @apiParam {String} password required
 *

 * @apiSuccessExample {json} Success-Response:
 *   {
*      "message": "Auth successful",
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvZ3VrYW5AZG9ndWthbi5jb20iLCJ1c2VySWQiOiI1YmM4OTM1MzY1NmZiYzE0NWY0MzllYWQiLCJpYXQiOjE1Mzk4NzIyMTgsImV4cCI6MTUzOTg3NTgxOH0.4Na9EQT0i9Rdbb0t2QSxevEdB0QipzPUGhJbKFB9oKs"
  *  }
*/
exports.login = (req, res) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Username or password is wrong',
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Username or password is wrong',
          });
        }
        if (result) {
          const expires = '6h';
          const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY, {
              expiresIn: expires,
            },
          );
          return res.status(200).json({
            message: 'Auth successful',
            token,
            expiresIn: expires,
            userId: user[0]._id,
          });
        }
        res.status(401).json({
          message: 'Username or password is wrong',
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
