import React, { useRef, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import "./style/Profile.css";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  return (
    <>
      <div className="mainProfileDiv">
        <form onSubmit={handleSubmit}>
          <h1>Profile</h1>
          <div className="profile_detail">
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <img
              src={formData.avatar || currentUser.avatar}
              onClick={() => fileRef.current.click()}
            />
            <p className="text-sm self-center">
              {fileUploadError ? (
                <span className="text-red-700" style={{ color: "red" }}>
                  Error Image upload (image must be less than 2 mb)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span style={{ color: "#00BFA6" }}>
                  Image successfully uploaded!
                </span>
              ) : (
                ""
              )}
            </p>
            <input
              type="text"
              placeholder="Username"
              id="username"
              defaultValue={currentUser.username}
              onChange={handleChange}
            />

            <input
              type="email"
              placeholder="Email"
              id="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />

            <input
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
            />
            <p style={{ color: "red" }}>{error ? error : ""}</p>
            <p style={{ color: "#00BFA6" }}>
              {updateSuccess ? "User is updated successfully!" : ""}
            </p>

            <button disabled={loading}>
              {loading ? "Loading..." : "Update"}
            </button>
            <div className="deleteAccount">

              <span onClick={handleSignOut}>sign out</span>
              <span onClick={handleDeleteUser}>delete account</span>
            </div>
          </div>
        </form>
        <div className="secondmain">
          <Link className="links" to={"/create-listing"}>create Listing</Link>
          <Link className="links" onClick={handleShowListings}> show Listing</Link>
          <p style={{ color: 'red', marginTop: '5px' }}>
            {showListingsError ? 'Error showing listings' : ''}
          </p>
        </div>
      </div>
      {userListings && userListings.length > 0 && (
  <div className='listings-container'>
    <h1 className='listings-title'>
      Your Listings
    </h1>
    {userListings.map((listing) => (
      <div key={listing._id} className='listing-item'>
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls[0]}
            alt='listing cover'
            className='listing-image'
          />
        </Link>
        <Link
          className='listing-name'
          to={`/listing/${listing._id}`}
        >
          {listing.name}
        </Link>
        <div className='listing-actions'>
          <button
            onClick={() => handleListingDelete(listing._id)}
            className='delete-button'
          >
            Delete
          </button>
          <Link to={`/update-listing/${listing._id}`}>
            <button className='edit-button'>Edit</button>
          </Link>
        </div>
      </div>
    ))}
  </div>
)}

      
    </>
  );
}

export default Profile;
