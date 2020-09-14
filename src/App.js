import React,{useState} from 'react';
import logo from './logo.svg';
import axios from 'axios'
import './App.css';


function App() {
  const[data,setData] = useState({
    flag:false,
    result:''
  })
  const{result,flag} = data;
  async function predict(par){
    setData({
      ...data,
      flag:true
    })
    const response = await axios.get(`http://localhost:3001/${par}`)
    setData({
      ...data,
      flag:false,
      result:response.data.result
    })
    console.log(result)
  }
  return (
   <React.Fragment>
   <div style={{textAlign:'center',fontSize:'larger'}}>Check the value of 1 USD after <input type = "number" onChange={(e)=>{
     predict(e.target.value)
     console.log(e.target.value)
   }}></input> days in INR</div>
<div style={{textAlign:'center', fontSize:'10rem'}}>
{!flag && <div><i class="fa fa-inr" aria-hidden="true"></i>{result}</div> }
</div>
   </React.Fragment>
  );
}

export default App;
