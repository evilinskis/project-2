const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setAbout = (about) => _.escape(about).trim();

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  about: {
    type: String,
    required: true,
    trim: true,
    set: setAbout,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ProfileSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  about: doc.about,
});

const ProfileModel = mongoose.model('Profile', ProfileSchema);
module.exports = ProfileModel;
