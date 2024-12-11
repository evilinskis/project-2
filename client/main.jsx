const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

//handles profile creation from profile form
const handleProfile = (e, onProfileMade) => {
  e.preventDefault();

  const name = e.target.querySelector('#profileName').value;
  const age = e.target.querySelector('#profileAge').value;
  const about = e.target.querySelector('#profileAbout').value;

  if(!name || !age || !about) {
    window.alert('All fields are required!');
    return false;
  }

  helper.sendPost(e.target.action, {name, age, about}, onProfileMade);
  return false;
}

//handles profile searching from search form
const handleSearch = (e, onSearch) => {
  e.preventDefault();

  const name = e.target.querySelector('#searchName').value;
  const age = e.target.querySelector('#searchAge').value;
  const about = e.target.querySelector('#searchAbout').value;

  helper.sendPost(e.target.action, {name, age, about}, onSearch)
  
  const searchData = helper.sendSearch(e.target.action, {name, age, about});
  return searchData;
}

//form for profile creation
const ProfileForm = (props) => {
  return(
      <form id="profileForm"
        onSubmit={(e) => handleProfile(e, props.triggerReload)}
        name="profileForm"
        action="/makeProfile"
        method="POST"
        className="form"
      >
        <label htmlFor="name">Name: </label>
        <input id="profileName" type="text" name="name" className="formInput" placeholder="Name" />

        <label htmlFor="about">Describe Yourself: </label>
        <input id="profileAbout" type="textarea" className="formInput" name="about" placeholder="Describe Yourself" />

        <label htmlFor="age">Age: </label>
        <input id="profileAge" type="number" min="0" className="formInput" name="age" />

        <input className="appSubmit" type="submit" value="Edit Profile" />
      </form>
  );
};

//form for searching profiles
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
        <input id="searchName" type="text" name="name" className="formInput" placeholder="Name" />

        <label htmlFor="about">Keywords: </label>
        <input id="searchAbout" type="textarea" className="formInput" name="about" placeholder="Keywords" />

        <label htmlFor="age">Age: </label>
        <input id="searchAge" type="number" min="0" className="formInput" name="age" />

        <input className="appSubmit" type="submit" value="Search" />
    </form>
  );
};

//user's own profile display
const UserProfile = (props) => {

  const [profile, setProfile] = useState(props.profile);

  useEffect(() => {
    const loadProfileFromServer = async () => {
      const response = await fetch ('/getOwnProfile');
      const data = await response.json();
      setProfile(data.profile);
    };
    loadProfileFromServer();
  }, [props.reloadProfile]);

  if(profile === null) {
    return (
      <div className="profile">
        <h3 className="emptyProfile">Create Your Profile!</h3>
      </div>
    );
  }

  return(
      <div id="userProfile" >
      <div className='pWrapper'>
        <img src="/assets/img/profilepic.jpg" className="profilePic"></img>
        <h3 id="ownName">Name: {profile.name}</h3>
        <h3 id="ownAge">Age: {profile.age}</h3>
      </div>
        <p id="ownAbout">About Me: {profile.about}</p>
      </div>
  );
};

//list of other user's profiles
const ProfileList = (props) => {
  const [profiles, setProfiles] = useState(props.profiles);
  useEffect(() => {
    
    
    const loadProfilesFromServer = async () => {
    
    /* attempt at a search function- it throws an error
      const name = document.querySelector('#searchName').value;
      const age = document.querySelector('#searchAge').value;
      const about = document.querySelector('#searchAbout').value;

      const response = await fetch ('/search' + 
      new URLSearchParams({name: name, age: age, about: about}).toString,
      {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }});
    */
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
        <div className='pWrapper'>
          <img src="/assets/img/profilepic.jpg" alt="profile picture" className="profilePic" />
          <h3 className="profileName">Name: {profile.name}</h3>
          <h3 className="profileAge">Age: {profile.age}</h3>
        </div>
          <h3 className="profileAbout">About Me: {profile.about}</h3>
      </div>
    );
  });

  return (
    <div className="profileList">
      {profileNodes}
    </div>
  )

};

//vertical banner ad- would probably have an image in a full version but it's just text here
const AdSpace = (props) => {
  return(
    <div id="advert">
      <h3 id="adTitle">{props.title}</h3>
      <p id="adText">{props.text}</p>
    </div>
  );
};

const App = () => {
  const [reloadProfiles, setReloadProfiles] = useState(false);
  const [reloadProfile, setReloadProfile] = useState(false);

  return (
      <div id="wrapper">
        <AdSpace title={"CLICK NOW!!"} text={"Hot Milfs In Area"}/>
        <div id="userMenu">
          <ProfileForm triggerReload={() => setReloadProfile(!reloadProfile)} />
          <UserProfile profile={[]} reloadProfile={reloadProfile}/>
        </div>
        <div id="profilesmenu">
          <SearchForm triggerReload={() => setReloadProfiles(!reloadProfiles)} />
          <ProfileList profiles={[]} reloadProfiles={reloadProfiles} />
        </div>
        <AdSpace title={"WIN BIG"} text={"Start Gambling Today!"}/>
      </div>

  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render( <App /> );
};

window.onload = init;