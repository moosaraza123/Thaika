import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import "./style/Profile.css";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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
      'state_changed',
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

        
  return (
    <>
      <div className="mainProfileDiv">
        <form action="">
          <h1>Profile</h1>
          <div className="profile_detail">
            <input
              type="file"
              ref={fileRef}
              hidden
              accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <img
              srcset={formData.avatar || currentUser.avatar}
              onClick={() => fileRef.current.click()}
            />
           <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'  style={{color:  "red"}}>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'style={{color:  "#00BFA6"}}>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
            <input type="text" placeholder="Username" id="username" />

            <input type="email" placeholder="Email" id="email" />

            <input type="password" placeholder="Password" id="password" />

            <button>Update</button>
            <div className="deleteAccount">
              <span>sign out</span>
              <span>delete account</span>
            </div>
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
