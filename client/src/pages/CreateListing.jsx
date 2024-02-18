import React from 'react';
import './style/CreateListing.css';

function CreateListing() {
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
           
            <label htmlFor='image'>Upload Image:</label>
            <input type='file' id='image' name='image' accept='image/*' required  multiple/>
          </div>
          <button id='uploadbtn' >Upload</button>
          <button type='submit'>Create Listing</button>
        </form>
      </main>
    </>
  );
}

export default CreateListing;
