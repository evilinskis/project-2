const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleProfile = (e, onProfileMade) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#profileName').value;
  const age = e.target.querySelector('#profileAge').value;
  const about = e.target.querySelector('#profileAbout').value;

  if(!name || !age || !about) {
    helper.handleError('All fields are required!');
    return false;
  }

  helper.sendPost(e.target.action, {name, age, about}, onProfileMade);
  return false;
}

const ProfileForm = (props) => {
  return(
      <form id="profileform"
        onSubmit={(e) => handleProfile(e, props.triggerReload)}
        name="profileForm"
        action="/maker"
        method="POST"
        className="profileForm"
      >
        <label htmlFor="name">Name: </label>
        <input id="profileName" type="text" name="name" placeholder="Name" />

        <label htmlFor="age">Age: </label>
        <input id="profileAge" type="number" min="0" name="age" />

        <label htmlFor="about">Describe Yourself: </label>
        <input id="profileAbout" type="textarea" name="about" placeholder="Describe Yourself" />

        <input className="makeProfileSubmit" type="submit" value="Make Profile" />
      </form>
  );
};

const UserProfile = (props) => {
  return(
      <div id="UserProfile">
        <img src=""></img>
        <h3 id="ownName"></h3>
        <h3 id="ownAge"></h3>
        <p id="ownAbout"></p>
      </div>
  );
};

const ProfileList = (props) => {
  const [profiles, setProfiles] = useState(props.profiles);

  useEffect(() => {
    const loadProfilesFromServer = async () => {
      const response = await fetch ('/getProfiles');
      const data = await response.json();
      setProfiles(data.profiles);
    };
    loadProfilesFromServer();
  }, [props.reloadProfiles]);

  if(profiles.length === 0) {
    return (
      <div className="profileList">
        <h3 className="emptyProfile">No Matches Yet!</h3>
      </div>
    );
  }

  const profileNodes = profiles.map(profile => {
    return(
      <div key={profile.id} className="profile">
        <img src="/assets/img/profilepic.jpg" alt="profile picture" className="profilePic" />
        <h3 className="profileName">Name: {profile.name}</h3>
        <h3 className="profileAge">Age: {profile.age}</h3>
        <h3 className="profileAbout">About: {profile.about}</h3>
      </div>
    );
  });

  return (
    <div className="profileList">
      {profileNodes}
    </div>
  );
};

const App = () => {
  const [reloadProfiles, setReloadProfiles] = useState(false);

  return (
    <div id="wrapper">
      <div id="makeProfile">
        <ProfileForm triggerReload={() => setReloadProfiles(!reloadProfiles)} />
      </div>
      <div id="profiles">
        <ProfileList profiles={[]} reloadProfiles={reloadProfiles} />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render( <App /> );
};

window.onload = init;