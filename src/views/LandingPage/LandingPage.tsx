import React, { useState } from 'react';
import './styles.css';
import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';
import LoginV2 from '../../components/Login/LoginV2';

function LandingPage() {
  const [loginModal , setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  const handleLoginClick = () => {
    setLoginModal(!loginModal);
  };

  const handleRegisterClick = () => {
    setRegisterModal(!registerModal);
  };


  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="auth-buttons">
          <button className="login-btn" onClick={handleLoginClick}>Login</button>
          <button className="register-btn" onClick={handleRegisterClick}>Register</button>
        </div>
      </header>

      <main className="landing-main">
        <h1 className="main-heading">Welcome to Play Arena</h1>
        <p className="subheading">
          Explore courts and book sessions in <strong>Sports</strong>, <strong>Fitness</strong>, and <strong>Wellness</strong> — all in one place.
        </p>

        <div className="category-cards">
          <div className="card">
            <img src="https://i.imgur.com/sQwFwY2.png" alt="Sports" />
            <h3>Sports</h3>
            <p>Book courts for Football, Cricket, Badminton, and more.</p>
          </div>
          <div className="card">
            <img src="https://i.imgur.com/kFzvzjn.png" alt="Fitness" />
            <h3>Fitness</h3>
            <p>Join group workouts, gym sessions, or personal training.</p>
          </div>
          <div className="card">
            <img src="https://i.imgur.com/X8ljSBg.png" alt="Wellness" />
            <h3>Wellness</h3>
            <p>Relax with Yoga, Zumba, and guided meditation programs.</p>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>© 2025 Play Arena. All rights reserved.</p>
      </footer>


      {loginModal && (
        <LoginV2 handleModal={handleLoginClick}></LoginV2>
      )}
      {registerModal && (
        <Register handleModal={handleRegisterClick}></Register>
      )}
    </div>
  );
}

export default LandingPage;
