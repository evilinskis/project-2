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

const handleSearch = (e, onSearch) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#searchName').value;
  const age = e.target.querySelector('#searchAge').value;
  const about = e.target.querySelector('#searchAbout').value;
  
  helper.sendPost(e.target.action, {name, age, about}, onSearch);
  return false;
}

const ProfileForm = (props) => {
  return(
      <form id="profileForm"
        onSubmit={(e) => handleProfile(e, props.triggerReload)}
        name="profileForm"
        action="/maker"
        method="POST"
        className="form"
      >
        <label htmlFor="name">Name: </label>
        <input id="profileName" type="text" name="name" placeholder="Name" />

        <label htmlFor="about">Describe Yourself: </label>
        <input id="profileAbout" type="textarea" name="about" placeholder="Describe Yourself" />

        <label htmlFor="age">Age: </label>
        <input id="profileAge" type="number" min="0" name="age" />

        <input className="makeProfileSubmit" type="submit" value="Edit Profile" />
      </form>
  );
};

const SearchForm = (props) => {
  return(
    <form id="searchForm"
        onSubmit={(e) => handleSearch(e, props.triggerReload)}
        name="searchForm"
        action="/search"
        method="POST"
        className="form"
    >
        <label htmlFor="name">Name: </label>
        <input id="searchName" type="text" name="name" placeholder="Name" />

        <label htmlFor="about">Keywords: </label>
        <input id="searchAbout" type="textarea" name="about" placeholder="Keywords" />

        <label htmlFor="age">Age: </label>
        <input id="searchAge" type="number" min="0" name="age" />

        <input className="makeSearcjSubmit" type="submit" value="Search" />
    </form>
  );
};

const UserProfile = (props) => {

  /*
  const [profile, setProfile] = useState(props.profile);

  useEffect(() => {
    const loadProfileFromServer = async () => {
      const response = await fetch ('/getOwnProfile');
      const data = await response.json();
      setProfile(data.profile);
    };
    loadProfileFromServer();
  }, [props.reloadProfile]);

  if(profile.length === 0) {
    return (
      <div className="profile">
        <h3 className="emptyProfile">Create Your Profile!</h3>
      </div>
    );
  }

  return(
      <div id="userProfile">
        <img src="/assets/img/profilepic.jpg" className="profilePic"></img>
        <h3 id="ownName">{profile.name}</h3>
        <h3 id="ownAge">{profile.age}</h3>
        <p id="ownAbout">{profile.about}</p>
      </div>
  );
  */

    return(
      <div id="userProfile">
        <img src="/assets/img/profilepic.jpg" className="profilePic"></img>
        <div className="pWrapper">
          <h3 id="ownName">Name Name</h3>
          <h3 id="ownAge">37</h3>
        </div>
        <p id="ownAbout">I like travel and reading #escapism</p>
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
  )

  return(
    <div className="profileList">
        <div className="profile">
        <img src="/assets/img/profilepic.jpg" alt="profile picture" className="profilePic" />
        <div className="pWrapper">
          <h3 className="profileName">Name Name</h3>
          <h3 className="profileAge">38</h3>
        </div>
        <p className="profileAbout">Looking for someone who loves escapism</p>
      </div>
    </div>
  )
};

//This would be fully dynamic in a full version
//but it's a placeholder for now
const AdSpace = (props) => {
  return(
    <div id="advert">
      <h3 id="adTitle">CLICK NOW!!!</h3>
      <p id="adText">HOT MILFS IN AREA</p>
    </div>
  );
};

const App = () => {
  const [reloadProfiles, setReloadProfiles] = useState(false);
  const [reloadProfile, setReloadProfile] = useState(false);

  return (
      <div id="wrapper">
        <AdSpace />
        <div id="user">
          <ProfileForm triggerReload={() => setReloadProfile(!reloadProfile)} />
          <UserProfile profile={[]} reloadProfile={reloadProfile}/>
        </div>
        <div id="others">
          <SearchForm triggerReload={() => setReloadProfiles(!reloadProfiles)} />
          <ProfileList profiles={[]} reloadProfiles={reloadProfiles} />
        </div>
        <AdSpace />
      </div>

  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render( <App /> );
};

window.onload = init;