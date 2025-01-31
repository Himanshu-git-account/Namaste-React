import RestaurantCard from "./RestaurantCard"
import { useEffect, useState } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from '../utils/useOnlineStatus';

const Body = () => {

    // Local State variable -Super Powerful variable
    const [listOfRestaurants, setlistofRestaurants] = useState([]);
    const [filteredRestaurants,setFilteredRestaurants] =useState([]);
    const [searchText, setsearchText] = useState("");

    // Whenever state variable update react triggers reconciliation cycle( re-renders the component)
    console.log("Body rendered");
        useEffect(()=>{
            fetchData();
        }, []);

      const fetchData= async () =>{
        const data = await fetch("https://corsproxy.org/?https%3A%2F%2Fwww.swiggy.com%2Fdapi%2Frestaurants%2Flist%2Fv5%3Flat%3D17.4853202%26lng%3D78.4453532%26is-seo-homepage-enabled%3Dtrue%26page_type%3DDESKTOP_WEB_LISTING%20%20%20%20%20%20%20%20%20");
        const jsondata = await data.json();
        console.log(jsondata);
        // Optional Chaining
        setlistofRestaurants(JSON.parse(JSON.stringify(jsondata?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants)));
        setFilteredRestaurants(JSON.parse(JSON.stringify(jsondata?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants)));
      };


      const onlineStatus =useOnlineStatus();
      if(onlineStatus === false) return <h1>Looks like you are offline!! Please check your internet conection</h1>;
      
  //Condtional Rendering
    return listOfRestaurants.length === 0 ? ( <Shimmer /> ) : (
        <div className="body">
            <div className="filter">
              <div className="search">
                <input type="text" className="search-box" placeholder="Search for an Restaurant" value={searchText} onChange={(e)=>setsearchText(e.target.value)}/>
                <button className="search-btn" onClick={()=>{
                  // Filter the restaurant card and update the UI
                  // searchText 
                  console.log(searchText);

                  const filteredRestaurants = listOfRestaurants.filter((res)=>{
                   return res.info.name.toLowerCase().includes(searchText.toLowerCase());
                  });

                  setFilteredRestaurants(filteredRestaurants);
                }}>Search</button>
              </div>
                <button className="filter-btn" onClick={()=>{
                   // Filtering Logic
                   const filteredRestaurants = listOfRestaurants.filter(res=>res.info.avgRating>=4);
                   setFilteredRestaurants(filteredRestaurants);
                }}>Top Rated Restaurants</button>
            </div>
            <div className="res-container">
            {filteredRestaurants.map((restaurant)=>  (
            <Link key={restaurant.info.id} to={"/restaurants/" + restaurant.info.id}> 
            <RestaurantCard resData ={restaurant} /> 
            </Link>
              ))}
            </div>
        </div>
    )
}

export default Body;