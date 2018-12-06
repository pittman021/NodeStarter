const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const User = require('./models/User');
const Gift = require('./models/Gift');
const List = require('./models/List');

function seedDB() {
  Gift.remove({}, function(err, gift) {
    if (err) {
      console.log(err);
    } else {
      List.remove({}, function(err, list) {
        if (err) {
          console.log(err);
        } else {
          User.findOne({ username: 'tim' }, function(err, tim) {
            if (err) {
              console.log(err);
            } else {
              const list = {
                title: 'Christmas',
                owner: tim._id
              };

              List.create(list, function(err, newList) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('added a list');
                  Contact.findOne({ first_name: 'katharine' }, function(err, k) {
                    if (err) {
                      console.log(err);
                    } else {
                      // create gifts
                      const gift1 = new Gift({
                        title: 'Gift #1',
                        url: 'https://google.com',
                        owner: k._id
                      });

                      // create gift
                      const gift2 = new Gift({
                        title: 'Gift #2',
                        url: 'https://google.com',
                        owner: k._id
                      });
                      // save gift
                      gift1.save().then(err => {});
                      // create gift
                      gift2.save().then(err => {});

                      k.gifts.push(gift1);
                      k.gifts.push(gift2);
                      newList.contacts.push(k);

                      k.save();
                      newList.save();
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  //
}

module.exports = seedDB;
