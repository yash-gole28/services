'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import AddCategory from '../components/addCategory';
import GreenButton from '../components/greenButton';

const page = () => {
    const [listData, setListData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [popUp, setPopUp] = useState(false);
    const [addService, setAddService] = useState({ services: "", category: "", price: "", duration: "", gender: "" });
    const [deleteServiceId, setDeleteServiceId] = useState(null);
    const [delPopUp, setDelPopUp] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');

    // Toggle pop-up
    const handlePopUp = () => {
        setPopUp(prevPopUp => !prevPopUp);
    };

    // Delete service
    const handleDelete = (id) => {
        setDeleteServiceId(id);
        setDelPopUp(true);
    };

    // Edit service
    const handleEdit = (id) => {
        setEditingId(id);
    };

    // Save edited service
    const handleSave = async (id) => {
        try {
            const response = await axios.post("https://nestcraft-task-backend.onrender.com/api/v1/service/update", { id, serviceData });
            if (response.data.success) {
                alert("Updated successfully");
            }
        } catch (error) {
            console.error("Error updating service:", error);
            alert("An error occurred while updating the service");
        }
        setEditingId(null);
    };

    // Confirm service deletion
    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`https://nestcraft-task-backend.onrender.com/api/v1/service/delete-service?id=${deleteServiceId}`);
            if (response.data.success) {
                setDelPopUp(false);
                getServices();
                alert("Service deleted successfully!");
            } else {
                alert("Failed to delete service");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("An error occurred while deleting the service");
        }
    };

    // Fetch categories
    const getCategories = async () => {
        try {
            const response = await axios.get('https://nestcraft-task-backend.onrender.com/api/v1/category/get-categories');
            if (response.data.success) {
                setListData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Fetch services
    const getServices = async () => {
        try {
            const response = await axios.get("https://nestcraft-task-backend.onrender.com/api/v1/service/get-services");
            if (response.data.success) {
                setServiceData(response.data.data);
            } else {
                alert("Failed to fetch services");
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            alert("An error occurred while fetching services");
        }
    };

    // Handle form input change
    const handleChange = (event) => {
        setAddService({ ...addService, [event.target.name]: event.target.value });
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            if(addService.services && addService.category && addService.price && addService.duration && addService.gender ){
                const response = await axios.post("https://nestcraft-task-backend.onrender.com/api/v1/service/add-service", { addService });
            if (response.data.success) {
                setAddService({ services: "", category: "", price: "", duration: "", gender: "" });
                getServices();
                alert("Service added successfully!");
            } else {
                alert("Failed to add service");
            } 
            }else{
                alert('all fields are mandatory')
            }
            
        } catch (error) {
            console.error("Error adding service:", error);
            alert("An error occurred while adding the service");
        }
    };

    // Filtered list based on search keyword
    const filteredList = serviceData.filter(item =>
        item.services && (item.category.toLowerCase().includes(searchKeyword.toLowerCase()) || item.services.toLowerCase().includes(searchKeyword.toLowerCase()) || item.gender.toLowerCase().includes(searchKeyword.toLowerCase()))
    );

    // Fetch categories and services on component mount
    useEffect(() => {
        getCategories();
        getServices();
    }, []);

  return (
    <div className='screen'>
    <div className={popUp ? "active-pop" : "inActive-pop"}>
        <AddCategory />
    </div>
    <div className='nav'>
        <Link style={{textDecoration:'none'}} href="/">
            <div className='col-btn f-weight'>View Service Category</div>
        </Link>
        <div onClick={handlePopUp}>
            <GreenButton title="Add Service category +" />
        </div>
    </div>
    <div className='search-container'><input className='search' placeholder='search' type="text" onChange={(e) => setSearchKeyword(e.target.value)} value={searchKeyword} /></div>
    <div>
        <table>
            <thead>
                <tr>
                    <th style={{ paddingRight: "20px" }}> <input type="checkbox" name="" id="" /> </th>
                    <th className='t-services'>Services</th>
                    <th className='t-category'>Category</th>
                    <th className='t-price'>Price</th>
                    <th className='t-duration'>Duration</th>
                    <th className='t-gender'>Gender</th>
                    <th className='t-action'>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredList.map((data, index) => (
                    <tr key={index}>
                        <td style={{ paddingRight: "20px" }}> <input type="checkbox" name="" id="" /> </td>
                        <td className='t-services'>
                            {editingId === data._id ?
                                <input type="text" value={data.services} onChange={(e) => setServiceData((prevData) => prevData.map((item) => item._id === data._id ? { ...item, services: e.target.value } : item))} readOnly={false} />
                                : data.services}
                        </td>
                        <td className='t-category'>
                            {editingId === data._id ?
                                <input type="text" value={data.category} onChange={(e) => setServiceData((prevData) => prevData.map((item) => item._id === data._id ? { ...item, category: e.target.value } : item))} readOnly={false} />
                                : data.category}
                        </td>
                        <td className='t-price'>
                            {editingId === data._id ?
                                <input type="text" value={data.price} onChange={(e) => setServiceData((prevData) => prevData.map((item) => item._id === data._id ? { ...item, price: e.target.value } : item))} readOnly={false} />
                                : data.price}
                        </td>
                        <td className='t-duration'>
                            {editingId === data._id ?
                                <input type="text" value={data.duration} onChange={(e) => setServiceData((prevData) => prevData.map((item) => item._id === data._id ? { ...item, duration: e.target.value } : item))} readOnly={false} />
                                : data.duration}
                        </td>
                        <td className='t-gender'>
                            {editingId === data._id ?
                                <input type="text" value={data.gender} onChange={(e) => setServiceData((prevData) => prevData.map((item) => item._id === data._id ? { ...item, gender: e.target.value } : item))} readOnly={false} />
                                : data.gender}
                        </td>
                        <td className='editing-row'>
                            <button className='x-btn' onClick={() => handleDelete(data._id)}>x</button>
                            {editingId === data._id && editingId !== null ? (
                                <button className='save' onClick={() => handleSave(data._id)}>Save</button>
                            ) : (
                                <button className='edit' onClick={() => handleEdit(data._id)}><i className="fa-regular fa-pen-to-square"></i></button>
                            )}

                        </td>
                    </tr>
                ))}
                <tr>
                    <td style={{ paddingRight: "20px" }}> <input type="checkbox" name="" id="check" /> </td>
                    <td className='t-services'> <input onChange={handleChange} name='services' value={addService.services} type="text" /> </td>
                    <td className='t-category'>
                        <select onChange={handleChange} value={addService.category} name="category">
                            <option value="">Select category</option>
                            {listData.map((data, index) => (
                                <option key={index} value={data.categoryName}>{data.categoryName}</option>
                            ))}
                        </select>
                    </td>
                    <td className='t-price'> <input onChange={handleChange} value={addService.price} name='price' type="text" /> </td>
                    <td className='t-duration'> <input onChange={handleChange} value={addService.duration} name='duration' type="text" /> </td>
                    <td className='t-gender'>
                        <select onChange={handleChange} value={addService.gender} name="gender">
                            <option value="">Select gender</option>
                            <option value="male">male</option>
                            <option value="female">female</option>
                            <option value="both">both</option>
                        </select>
                    </td>
                    <td className='t-action'> <button onClick={handleSubmit}>Add More + </button> </td>
                </tr>
            </tbody>
        </table>
    </div>

    {delPopUp && (
        <div className='delete-popup'>
            <div>Confirm delete?</div>
            <div>
                <button className='confirm-yes' onClick={confirmDelete}>Yes</button>
                <button className="confirm-no" onClick={() => setDelPopUp(false)}>No</button>
            </div>
        </div>
    )}
</div>
  )
}

export default page
