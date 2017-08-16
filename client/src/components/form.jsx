import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Button from 'react-bootstrap/lib/Button';
import FormField from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormControlFeedback from 'react-bootstrap/lib/FormControlFeedback';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Add from 'material-ui/svg-icons/content/add';
import Remove from 'material-ui/svg-icons/content/remove';
import schemeArr from './scheme.js';
import axios from 'axios';
import CircularProgress from 'material-ui/CircularProgress';

const style = {
    divStyle : {
        position:'absolute',
        top:'30%',
        left:'40%'
    },
    heightFull : {
        backgroundColor: 'rgba(136, 130, 130, 0.1)',
        height : "100%",
        padding : "30px"
    }
}

class Form extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            queryArr : [{
                schemeNameCode : "FC1",
                pickedDate : new Date(),
                InvestedAmount : 10000,
                invalidQuery : true ,
                schemeName : "Axis Banking & PSU Debt Fund - Bonus option",
                option : "Bonus Option",
                schemeArr:schemeArr.find(function(obj){
                    return obj.key === "FC1"
                }).options
               
            }],
            count : 1,
            bar : false
        }
    }

    handleAmountChange(index,e,value){
        let invalidQuery = false;
        var queryArr = this.state.queryArr;
        queryArr[index].InvestedAmount = value;
        if(value === ""){
            invalidQuery = true;
        }
        this.setState({
            queryArr : queryArr,
            invalidQuery : invalidQuery
        })
    }

    handleSchemeNameChange(index,e,option,value){
        var queryArr = this.state.queryArr;
        queryArr[index].schemeNameCode = value;
        let schemeArry= schemeArr.find(function(obj){
                    return obj.key === value
        }).options
        queryArr[index].option = schemeArry[0];
        queryArr[index].schemeArr = schemeArry
        queryArr[index].schemeName = schemeArr.find((obj) => {
                    return obj.key === queryArr[index].schemeNameCode
        }).name + ( schemeArry[0] ? " - " + schemeArry[0] : "");
        this.setState({
            queryArr : queryArr
        });
    }

     handleOptionChange(index,e,option,value){ 
        var queryArr = this.state.queryArr;
        queryArr[index].option = value;
        queryArr[index].schemeName = schemeArr.find((obj) => {
                    return obj.key === queryArr[index].schemeNameCode
        }).name + " - " + value;
        this.setState({
            queryArr : queryArr
        });
    }

    handleDateChange(index,e,date){
         var queryArr = this.state.queryArr;
        queryArr[index].pickedDate = date;
        this.setState({
            queryArr : queryArr
        });
    }

    disableDate(date){
        if(date > Date.now()){
            return true;
        }
        return false;
    }

    getPayLoad(){
        let param=[];
        this.state.queryArr.forEach((elem) => {
            let tempObj = {
                schemeName : elem.schemeName,
                amount : elem.InvestedAmount,
                date : this.convertDateFrmt(elem.pickedDate)
            }
            param.push(tempObj);
        });
        return param;
    }

    convertDateFrmt(dateObj){
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
        let date = new Date(dateObj)
        let day = date.getDate()
        day = (day < 10) ? "0"+day : day;
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear();
        return day+"-"+month+"-"+year;
    }

    submitQuery(index,event){
        console.log(this.state)
        let param = this.getPayLoad();
        this.setState({
            bar:true
        })
        axios.post('/submitQuery', param)
        .then((response) => { 
            this.setState({
                returnAmount : response.data.tot,
                bar : false
            })
        })
        .catch((error) => {
            this.setState({
                bar : false
            })
        });
    }

    resetQuery(index,event){
        this.setState({
            returnAmount : ""
        });
    }

    addQuery(event){
        var queryArr = this.state.queryArr;
        var count = this.state.count;
        queryArr.push({
                schemeNameCode : "FC1",
                pickedDate : new Date(),
                InvestedAmount : 10000,
                invalidQuery : true ,
                schemeName : "Axis Banking & PSU Debt Fund - Bonus option",
                option : "Bonus Option",
                schemeArr : schemeArr.find(function(obj){
                    return obj.key === "FC1"
            }).options
               
            });
        this.setState({
            queryArr:queryArr,
            count:count+1
        })
        this.resetQuery();
    }

    removeQuery(index,event){ 
        var queryArr = this.state.queryArr;
        var count = this.state.count;
        queryArr.splice(index, 1);
        this.setState({
            queryArr:queryArr,
            count:count-1
        })
    }

    render() {
        return (
        <div style={style.heightFull} >
           {this.state.bar ?   
                    <CircularProgress size={20} thickness={3} /> : <br />}
        {this.state.queryArr.map((query,index) => {
            return  <div key={index}>
                             <FormField inline >
    <FormGroup controlId="formInlineName">

                    <TextField
                        hintText="(In numbers..Ex : 10000)"
                        floatingLabelText="Invested amount"
                        type="number"
                        value = {query.InvestedAmount}
                        onChange={this.handleAmountChange.bind(this,index)}
                    />
                        </FormGroup>

                        <FormGroup controlId="formInlineName">

                    <SelectField
                        floatingLabelText="Scheme Name"
                        value={query.schemeNameCode}
                        onChange={this.handleSchemeNameChange.bind(this,index)}
                        autoWidth={true}
                    >
                    <MenuItem value="FC1" primaryText="Axis Banking & PSU Debt Fund" />
                    <MenuItem value="FC2" primaryText="Axis Dynamic Bond Fund" />
                    <MenuItem value="FC3" primaryText="Axis Fixed Income Opportunities Fund" />
                    <MenuItem value="FC4" primaryText="Axis Income Saver" />
                    <MenuItem value="FC5" primaryText="Axis Short Term Fund" /> 
                    <MenuItem value="FC6" primaryText="Axis Regular Savings Fund" />
                    <MenuItem value="FC7" primaryText="Axis Treasury Advantage Fund" /> 
                    <MenuItem value="FC8" primaryText="Axis Enhanced Arbitrage Fund" /> 
                    <MenuItem value="FC9" primaryText="Axis Equity Fund" /> 
                    <MenuItem value="FC10" primaryText="Axis Equity Saver Fund" /> 
                    <MenuItem value="FC12" primaryText="Axis Focused 25 Fund" /> 
                    <MenuItem value="FC13" primaryText="Axis Midcap Fund " /> 
                    <MenuItem value="FC14" primaryText="Axis Children's Gift Fund" /> 
                    <MenuItem value="FC15" primaryText="Axis Triple Advantage Fund " />
                    <MenuItem value="FC16" primaryText="Axis Liquid Fund " /> 
                    <MenuItem value="FC17" primaryText="Axis Constant Maturity 10 Year Fund " /> 
                    <MenuItem value="FC18" primaryText="Axis Long Term Equity Fund " /> 
                    <MenuItem value="FC19" primaryText="Axis Gold Fund " /> 
                    <MenuItem value="FC20" primaryText="Axis Nifty ETF " /> 
                    <MenuItem value="FC21" primaryText="Axis Corporate Debt Opportunities Fund " />
                    <MenuItem value="FC23" primaryText="Axis Gold ETF" />
                    <MenuItem value="FC22" primaryText="Axis Dynamic Equity Fund" />
                    </SelectField>
                        </FormGroup>
                                                <FormGroup controlId="formInlineName">
                             <SelectField
                        floatingLabelText="Options"
                        onChange={this.handleOptionChange.bind(this,index)}
                        value ={query.option}
                        autoWidth={true}
                    >
                    {
                        query.schemeArr.map(function(val,index){
                            return <MenuItem value={val} key={index} primaryText={val} /> 
                        })
                    }
                    </SelectField>
                        </FormGroup>

                        <FormGroup controlId="formInlineName">
                    <DatePicker hintText="Choose date of investment" 
                                            floatingLabelText="Date of investment"
                                mode="landscape" 
                                shouldDisableDate={this.disableDate}
                                value={query.pickedDate}
                                onChange={this.handleDateChange.bind(this,index)}
                    />
                        </FormGroup>
                        <FormGroup controlId="formInlineName">
                        
                               <RaisedButton label={<Add/>}
                    primary={true} 
                    onTouchTap={this.addQuery.bind(this)} 
                                        disabled={this.state.count >= 4}
                     />     
                                             </FormGroup>
                        <FormGroup controlId="formInlineName">

                     <RaisedButton label={<Remove/>}
                    secondary={true} 
                    onTouchTap={this.removeQuery.bind(this,index)} 
                    disabled={this.state.count <= 1}
                     />     
                                             </FormGroup>

                      </FormField>

                </div>
        })}
        <RaisedButton label="Submit query" 
                                primary={true} 
                                onTouchTap={this.submitQuery.bind(this)} 
                                disabled={this.state.invalidQuery}
        />
        <br />
        <TextField
                        hintText="Return amount"
                        floatingLabelText="Return amount"
                        type="number"
                        value = {this.state.returnAmount}
                        disabled = {true}
                        />

        </div>
        )
    }
}


export default Form;