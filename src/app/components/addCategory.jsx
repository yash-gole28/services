'use client'

import axios from 'axios'
import React, { useState } from 'react'



const AddCategory = () => {
    
    const [ data , setData ] =useState({categoryName:"" , description:"" ,appointmentColor:""})


    const handleChange = (event) =>{
        
        setData({...data ,[event.target.name]:event.target.value})
      
    
    }
    const handleSubmit = async(event) => {
        event.preventDefault()
        try{
            const response = await axios.post("https://nestcraft-task-backend.onrender.com/api/v1/category/add-category",{data})
            if(response.data.success){
                alert("added")
                setData({categoryName:"" , description:"" ,appointmentColor:""})
            }
        }catch(error){
            console.log(error)
        }
    }

  return (
    <div>
        <div className='pop-top'>
            <h3>Add New Service Category</h3>
            <span> x </span>
        </div>
      <form className='form' onSubmit={handleSubmit} action="">
        <label htmlFor="category">Category Name</label>
        <input type="text" onChange={handleChange} name='categoryName' value={data.categoryName} id='category'placeholder='eg. Hair Services'/>
        <label htmlFor="category">Appointment Color</label>
        <select type="text" onChange={handleChange} value={data.appointmentColor} name='appointmentColor' id='category'>
            <option className='options' value="" disabled></option>
            <option className='options'value="#ef7676" name='appointmentColor'>red</option>
            <option className='options' value="#7a7ae1" name='appointmentColor'>blue</option>
        </select>
    
        <label htmlFor="description">description</label>
        <textarea id='description'maxLength={200} value={data.description} name='description' onChange={handleChange}/>
        <div>
           
        </div>

        <button className='save-btn' type="submit">Save</button>
      </form>

    </div>
  )
}

export default AddCategory
