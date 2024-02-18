import React from 'react';
import './style/CreateListing.css';
import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    
    maxPrice: 50,
    minPrice: 0,
    
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(files)
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };


  return (
    <>
      <main className='maintagDiv'>
        <h1 id='heading'>Create a Listing</h1>
          <form className='form'>
          <div className='form-group'>
            <label htmlFor='name'>Name:</label>
            <input type='text' id='name' name='name' required />
          </div>
          <div className='form-group'>
            <label htmlFor='description'>Description:</label>
            <textarea id='description' name='description' required></textarea>
          </div>
          <div className='form-group'>
            <label htmlFor='experience'>Experience (years):</label>
            <input type='number' id='experience' name='experience' required />
          </div>
          <div className='form-group'>
            <label htmlFor='max-price'>Maximum Price:</label>
            <input type='number' id='max-price' name='max-price' required />
          </div>
          <div className='form-group'>
            <label htmlFor='min-price'>Minimum Price:</label>
            <input type='number' id='min-price' name='min-price' required />
          </div>
          <div className='form-group'>
            <p>images: First image will be cover max (6) work samples</p>
           
            <label htmlFor='image'>Upload Image of work samples</label>
            <input onChange={(e)=>setFiles(e.target.files)} type='file' id='image' name='image' accept='image/*' required  multiple/>
          </div>
          <button type="button" id='uploadbtn' onClick={handleImageSubmit} >{uploading?'Uploading...':'Upload'}</button>
          <p>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='custom-container'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='custom-image'
                />
                <button
                  type='button' id='uploadbtn' onClick={()=> handleRemoveImage(index)}>Delete </button>
          </div>))}
          <button type='submit'>Create Listing</button>
          
        </form>
      </main>
    </>
  );
}

export default CreateListing;
