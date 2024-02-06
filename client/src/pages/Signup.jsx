import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sign from '/Sign.svg'
import Rectangle from '/Rectangle.svg'
import P from '/P.svg'
import './style/sigup.css'

function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loadig, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return <>
<div className="SignupDiv">
        <div className="SignMockup">
          <img srcset={Sign} id="mockup1" />

          <div className="mockup2">
            <img srcset={Rectangle} id="mockup2" />
            <img src={P} id="mockup3" />
          </div>

          <a href="/sign-up" id="mockupText">
            Already have an account?
          </a>
          <a href="/sign-in" id="mockupText2">
            Sign In
          </a>
        </div>

        <div className="SignInForm">
          <form onSubmit={handleSubmit}>
            <div className="SinputFields">
              <label htmlFor="text" className="label">
                Username {error && <span>*</span>}
              </label>
              <input type="text" id="username" onChange={handleChange} />
            </div>

            <div className="SinputFields">
              <label htmlFor="email" className="label">
                Email{error && <span>*</span>}
              </label>
              <input type="email" id="email" onChange={handleChange} />
            </div>

            <div className="SinputFields">
              <label htmlFor="password" className="label">
                Password{error && <span>*</span>}
              </label>
              <input type="password" id="password" onChange={handleChange} />
            </div>
            <button disabled={loadig}  className="SignInBtn1">{loadig?'loading...':'Sign Up'}</button>
          {/* <OAuth/> */}
          </form>

          {error && <p>{error}</p>}
        </div>
      </div>
      sign up
</>
}

export default Signup