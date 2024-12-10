const models = require('../models');

const { Profile } = models;

const mainPage = (req, res) => res.render('app');

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

  // There can only be one user profile per user- see if one exists and update it
  // or make a new one if it doesn't exist
  try {
    const query = { owner: req.session.account._id };
    const docs = await Profile.find(query).select('name age about').lean().exec();
    if (docs.length === 0) {
      const newProfile = new Profile(profileData);
      await newProfile.save();
      return res.status(201).json({
        name: newProfile.name, age: newProfile.age, about: newProfile.about,
      });
    }

    Profile.findOneAndUpdate(query, profileData);
    return res.status(201).json({
      name: profileData.name, age: profileData.age, about: profileData.about,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Profile already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making profile!' });
  }
};

// Get the profile belonging to the user
const getOwnProfile = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Profile.find(query).select('name age about').lean().exec();

    return res.json({ profile: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving profile!' });
  }
};

// Get all the profiles of all users to show
const getProfiles = async (req, res) => {
  try {
    const docs = await Profile.find().select('name age about').lean().exec();

    return res.json({ profiles: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving profiles!' });
  }
};

// find profiles based on search parameters
const searchProfiles = async (req, res) => {
  try {
    let docs;

    // search with each parameter (if it exists) to narrow down results
    if (req.body.name) {
      docs = await Profile.find({ name: req.body.name }).select('name age about').lean().exec();
    }
    if (req.body.age) {
      docs = await Profile.find({ age: req.body.age }).select('name age about').lean().exec();
    }
    if (req.body.about) {
      docs = await Profile.find({ about: req.body.about }).select('name age about').lean().exec();
    }

    return res.json({ profiles: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving profiles!' });
  }
};

/*
function checkOwner(docs, req) {
  docs.forEach((profile) => {
    if (profile.owner === req.session.account._id) {
    }
  });
}
*/

module.exports = {
  mainPage,
  makeProfile,
  getOwnProfile,
  getProfiles,
  searchProfiles,
};
