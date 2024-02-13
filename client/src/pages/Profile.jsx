import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import "./style/Profile.css";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

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
              srcset={formData.avatar || currentUser.avatar}
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
                <span  style={{ color: "#00BFA6" }}>
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
            <p   style={{ color: "#red" }}>{error ? error : ""} </p>
              <p  style={{ color: "#00BFA6" }}>{updateSuccess ? "User is updated successfully!" : ""}</p>

            <button disabled={loading}>
              {loading ? "Loading..." : "Update"}
            </button>
            <div className="deleteAccount">
              <span>sign out</span>
              <span>delete account</span>
             
            </div>
            
            {/* <p style={{color:"red"}}>{error ? error:" " }</p> */}
          </div>
        </form>
        <div className="secondmain">
          <button>create Listening</button>
          <button>Show Listening</button>
        </div>
      </div>
    </>
  );
}

export default Profile;
