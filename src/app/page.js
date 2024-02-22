
'use client'
import { useEffect, useState } from "react";
import AddCategory from "./components/addCategory";
import Link from "next/link";
import GreenButton from "./components/greenButton";
import axios from "axios";

export default function Home() {

  const [listData, setListData] = useState([])
  const [deleteItem, setDeleteItem] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('');
  const [popUp, setPopUp] = useState(false)

  async function getCategories() {
    try {
      const response = await axios.get('https://nestcraft-task-backend.onrender.com/api/v1/category/get-categories')
      if (response.data.success) {
        setListData(response.data.data)

      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCheck = (id) => {
    if (deleteItem.includes(id)) {
      setDeleteItem(deleteItem.filter(itemId => itemId !== id));
    } else {
      setDeleteItem([...deleteItem, id]);
    }
  };

  const deleteChecked = async () => {
    try {
      console.log(deleteItem)
      const response = await axios.post('https://nestcraft-task-backend.onrender.com/api/v1/category/delete-category', {deleteItem});
      if (response.data.success) {
        console.log('Items deleted successfully');
        setDeleteItem([]);
        getCategories();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting items:', error);
    }
    console.log(deleteItem)
  };

  const filteredList = listData.filter(item =>
    item.categoryName && item.categoryName.toLowerCase().includes(searchKeyword.toLowerCase())
  );


  const handelPop = () => {
    setPopUp((pop) => !pop)
    getCategories()
  }

  const popClass = popUp ? "active-pop" : "inActive-pop"
  useEffect(() => {
    getCategories()
  }
    , [setListData])

  return (
    <main className="screen">
       <div className={popClass}>
        <AddCategory/>
      </div>
      <div className='nav'>
      <Link style={{textDecoration:"none"}} href="/services"> <div className='col-btn f-weight'>View Service</div></Link>
        <div onClick={handelPop}>
          <GreenButton title="Add Service category +" />
        </div>
      </div>
      <div>
        <div className="list-headings">
          <div className='flex'> <input type="checkbox" /> <h3 className='f-weight'>service category</h3></div>
          <div><input className='search' placeholder='search' type="text" onChange={(e) => setSearchKeyword(e.target.value)} value={searchKeyword} /></div>
          <button className='delete-btn' onClick={deleteChecked}>Delete</button>
        </div>
      </div>

      <div className='list-container'>
        {filteredList.map((list, index) => (
          <div className='list-content' key={index}>
            <input
              type="checkbox"
              checked={deleteItem.includes(list._id)}
              onChange={() => handleCheck(list._id)}
            />
            <div className='img-cont' style={{ backgroundColor: list.appointmentColor, width: "35px", height: "35px", borderRadius: "50%", marginLeft: "10px" }}></div>
            <div className='description-container'>
              <h4>{list.categoryName}</h4>
              <p className='description'>{list.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
