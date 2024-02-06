import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sign from '/Sign.svg'
import Rectangle from '/Rectangle.svg'
import P from '/n.svg'
import './style/SignIn.css'

function Signin() {
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
      const res = await fetch('/api/auth/signin', {
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
      navigate('/');
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
            Dont have an account?
          </a>
          <a href="/sign-up" id="mockupText2">
            Sign Up
          </a>
        </div>

        <div className="SignInForm">
          <form onSubmit={handleSubmit}>
            

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
      sign In
</>
}

export default Signin