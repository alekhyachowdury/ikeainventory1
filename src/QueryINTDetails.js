import React, { Component } from 'react';

import './App.css';
import axios from 'axios';




class QueryINTDetails extends Component {



	state={
		Intname:"",
		req: {},
		resp:"no data",
		respJson: {},
		respFlag: false
	}

handleOnChangeINT(e){
	console.log(e.target.value)
    this.setState({Intname: e.target.value})
   }




queryINT(){
	console.log(this.state,"Crrent State")
	var ep = 'http://localhost:1880/invoke'
	this.state.req.Intname = this.state.Intname
    console.log(this.state.req);

	axios.post( ep ,  this.state.req).then(res => {
			 console.log("response received");
			 //console.log(res.data);
             this.setState({resp: JSON.stringify(res.data)})
             this.setState({respJson: res.data})
			 //console.log(this.state.resp);
			console.log(this.state.respJson.server);
			 if(this.state.resp != "no data")
			 {
				 this.setState({respFlag : true})
			 }
        
      })
	}

render()  {
	return (
	    <div>
			<div className="inputDisplay">
			<div>
		 		<label for="INT" >Enter INT: </label>
		 		<input  type="text" onChange={(e)=> this.handleOnChangeINT (e)} value={this.state.INT} name="INT" />
			</div>				
			<button className="query" onClick={()=> this.queryINT()} >Query</button>
			</div>
			
			{
			this.state.respFlag ? 
			<div  className="outputMain">
			 
			<div className="outputDisplay"> 
			<div className="App-header">
		   		<label>Integration Details</label>
		   	</div> 
			    <div className="inputText">
					<label for="INTNAME" >INTNAME</label>
					<input  type="text" value={this.state.respJson.Intname} name="INTNAME" size="35" />  
				</div>
				<div className="inputText">
					<label for="SOLUTIONNAME" >SOLUTIONNAME</label>
					<input  type="text" value={this.state.respJson.Solutionname} name="SOLUTIONNAME" size="35"/>  
				</div>
				<div className="inputText">
					<label for="TECHNOLOGY" >TECHNOLOGY</label>
					<input  type="text" value={this.state.respJson.Technology} name="TECHNOLOGY" size="35"/>  
				</div>
				<div className="inputText">
					<label for="SOURCE" >SOURCE</label>
					<input  type="text" value={this.state.respJson.Source} name="SOURCE" size="35"/>  
				</div>
				<div className="inputText">
					<label for="TARGET" >TARGET</label>
					<input  type="text" value={this.state.respJson.Target} name="TARGET" size="35" />  
				</div>
				<div className="inputText">
					<label for="SERVER" >SERVER</label>
					<input  type="text" value={this.state.respJson.Server} name="SERVER" size="35"/>
				</div>
				<div className="inputText">
					<label for="GITLINK" >GITLINK</label>
					<input  type="textarea" value={this.state.respJson.GitLink} name="GITLINK" size="35" />
				</div>
			 </div>
			 <div className="compositeDisplay">
			 <div className="App-header">
		   		<label>Composite List</label>
		   	 </div> 
				{
				this.state.respJson.CompositeList.map((composite,index)=>{
					if(composite != "")
					{
		   			return (
		   					<div key={index} className="inputText">
		   							<label for="COMPOSITE" >COMPOSITE</label>
									<input  type="text" value={composite} name="COMPOSITE" size="40"/>
                             </div> 
			   
		   					)
		   					}
							}
							)
				}    
			</div>  
		   <div className="queueDisplay">
		   <div className="App-header">
		   <label>Queues and Topics</label>
		   </div>            

				{
				this.state.respJson.QueueList.map((queue,index)=>{
					if(queue != "")
					{
		   			return (
		   					<div key={index} className="inputText">
		   							<label for="Queue" > {index} :: </label>
									<input  type="text" value={queue} name="Queue" size="47"/>
                             </div> 
			   
		   					)
		   					}
							}
							)
				}    
			</div>                    

			</div> :
			<div></div>
			}
			
		</div>
		
			
			
		
	

		)			



}
}

export default QueryINTDetails
	