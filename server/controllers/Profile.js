const models = require('../models');

const { Profile } = models;

const makerPage = (req, res) => res.render('app');

const makeProfile = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.about) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const profileData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    about: req.body.about,
  };

  //There can only be one user profile per user- see if one exists and update it
  //or make a new one if it doesn't exist
  try {
    const docs = await Profile.find('owner : req.session.account._id').select('name age about').lean().exec();
    if(docs.length === 0){
      const newProfile = new Profile(profileData);
      await newProfile.save();
      return res.status(201).json({
        name: newProfile.name, age: newProfile.age, about: newProfile.about,
      });
    }
    else{
      Profile.findOneAndUpdate('owner : req.session.account._id', profileData);
    }

  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Profile already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making profile!' });
  }
};

//Get the profile belonging to the user
const getOwnProfile = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Profile.find(query).select('name age about').lean().exec();

    return res.json({ profiles: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving profile!' });
  }
};

//Get all the profiles of all users to show
const getProfiles = async (req, res) => {
  try {
    const docs = await Profile.find().select('name age about').lean().exec();

    return res.json({ profiles: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving profiles!' });
  }
};

module.exports = {
  makerPage,
  makeProfile,
  getOwnProfile,
  getProfiles,
};
