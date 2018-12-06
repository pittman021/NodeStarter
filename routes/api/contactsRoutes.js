const express = require('express');
const User = require('../../models/User');
const Contact = require('../../models/Contact');
const Gift = require('../../models/Gift');
const List = require('../../models/List');

module.exports = app => {
  app.get('/api/contacts', async (req, res) => {
    User.findById(req.user._id)
      .populate({
        path: 'contacts',
        populate: {
          path: 'gifts',
          model: 'Gift'
        }
      })
      .populate({
        path: 'lists',
        mode: 'List'
      })
      .exec(function(err, user) {
        if (err) {
          console.log(err);
        } else {
          const data = {};
          data.contacts = user;

          List.find({ owner: user.id }, function(err, lists) {
            if (err) {
              console.log(err);
            } else {
              data.lists = lists;
              res.json(data);
            }
          });
        }
      });
  });

  app.put('/api/contacts/:id/edit', function(req, res) {
    Contact.findByIdAndUpdate(req.params.id, req.body, function(err, updatedContact) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        return res.status(200).send({ contact: updatedContact, message: 'Contact Saved' });
      }
    });
  });

  app.delete('/api/contacts/:id', function(req, res) {
    console.log(req.params.id);
    Contact.findOneAndRemove({ _id: req.params.id }, (err, contact) => {
      console.log(contact);
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        return res.status(200).send({ contact: contact, message: 'Contact Deleted!' });
      }
    });
  });

  app.post('/api/contacts/:id/gifts/new', function(req, res) {
    console.log(req.body);
    const gift = {
      title: req.body.title,
      url: req.body.url,
      owner: req.body.owner
    };
    Gift.create(gift, function(err, newGift) {
      Contact.findById(req.params.id, function(err, foundContact) {
        if (err) {
          console.log(err);
        } else {
          foundContact.gifts.push(newGift);
          foundContact.save(function(err, data) {
            if (err) {
              console.log(err);
              return res.status(500).send(err);
            } else {
              return res.status(200).send({ gift: newGift, message: 'Gift Saved' });
            }
          });
        }
      });
    });
  });

  app.delete('/api/contacts/:id/gifts/:id', function(req, res) {
    console.log(req.params);

    Gift.findByIdAndDelete(req.params.id, function(err, removedGift) {
      if (err) {
        console.log(err);
      } else {
        console.log(removedGift);
        return res.status(200).send({ gift: removedGift, message: 'Gift Deleted' });
      }
    });
  });
};
