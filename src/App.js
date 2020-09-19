import React,{useEffect, useState} from 'react';
import logo from './logo.svg';
import axios from 'axios'
import './App.css';


function App() {
  const[data,setData] = useState({
    flag:false,
    result:''
  })
  const[predicted,setPredicted] = useState([])
  useEffect(()=>{
async function tablePredicted(){
  const res = await axios.get(`http://localhost:3001/predicted`)
  if(res.data)
  setPredicted(res.data)
}
tablePredicted()
  },[])
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
<React.Fragment>

</React.Fragment>
{predicted.length &&
<table class="table">
<thead>
  <tr>
    <th>Date</th>
    <th>Predicted</th>
    <th>Actual</th>
  </tr>
</thead>
<tbody>
  {predicted.map((result)=>(
<tr>
<td>{result.Date}</td>
<td>{result.predicted}</td>
<td>{result.actual}</td>
</tr>
  ))}
</tbody>
</table>}
   </React.Fragment>
  );
}

export default App;
