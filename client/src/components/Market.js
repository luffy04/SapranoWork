import React, { Component } from 'react';
import axios from 'axios';
import { BiSearch } from "react-icons/bi";
import { AiFillCar } from "react-icons/ai"
import { BsHouseDoor, BsLaptop } from "react-icons/bs";
import './Market.css';

class Market extends Component {
    constructor() {
        super();
        this.state = {
            List: [],
            user: {
                id: "JHA10MNX20PYSCHO",
                name: "Luffy"
            },
            search: "",
            searchId: "",
            name: "",
            price: 0,
            index: 0,
            editIndex: -1,
            pricerr: "",
            id: "",
            show: false,
            modalShow: false,
        }
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount = () => {
        axios.get("http://192.168.0.106:5000/")
            .then(res => {
                this.setState({ List: res.data });
            }).catch(err => {
                console.log(err);
            })
    }

    onDrop = (picture) => {
        console.log(picture)
        this.setState({
            pictures: this.state.pictures.push(picture),
        });
    }

    ShowCreateGroup = () => {
        var show = this.state.show;
        this.setState({ show: !show })
    }

    Upload = (event) => {
        var reader = new FileReader();
        reader.onload = async () => {
            this.setState({ picture: reader.result });
        }
        reader.readAsDataURL(event.target.files[0]);
    }

    EditList = () => {
        var price = this.state.price;

        if (price.length == 0) {
            this.setState({ pricerr: "Price should not be empty." })
            setTimeout(() => {
                this.setState({ pricerr: "" });
            }, 2000)
            return;
        }

        if (price < 0) {
            this.setState({ pricerr: "Price should not be negative." })
            setTimeout(() => {
                this.setState({ pricerr: "" });
            }, 2000)
            return;
        }

        var data = {
            id: this.state.id,
            price: price,
        }

        axios.post("http://192.168.0.106:5000/edit", { data })
            .then(res => {
                var List = this.state.List;
                List[this.state.editIndex].price = this.state.price;
                this.setState({ List, show: false });
            }).catch(err => {
                console.log(err);
            })
    }

    Edit = (item, index) => {
        this.setState({ show: true, name: item.name, price: item.price, id: item._id, editIndex: index });
    }

    Buy = (item) => {
        axios.post("http://192.168.0.106:5000/pushCart", { item })
            .then(res => {
                var result = JSON.parse(res.config.data);
                var List = this.state.List;
                var obj = List.find(data => data._id == result.item._id);
                var index = List.indexOf(obj);
                List[index].qty = parseInt(item.qty - 1);
                this.setState({ List });
            }).catch(err => {
                console.log(err);
            })
    }

    Delete = (index) => {
        var List = this.state.List;
        List.splice(index, 1);
        this.setState({ List: List });
    }

    render() {

        return (
            <div className="market_main">
                <div className="market_left_margin">
                    <div className="market_left_margin_inside_upper">
                        <div style={{ display: "inline-block" }}>
                            <BiSearch />
                            <input type="text" id="market_input_Search" placeholder="Search" onChange={(e) => this.setState({ search: e.target.value })} />
                        </div>

                        {
                            this.state.show &&
                            <div style={{ margin: "2% 0" }}>
                                <div>
                                    Name:
                                    <span className="group_name_input" >{this.state.name}</span>
                                </div>
                                <span style={{ color: "red", fontSize: 11 }}>{this.state.namerr}</span>

                                <div>
                                    Price:
                                    <input type="number" placeholder="Price" value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })} className="group_name_input" />
                                </div>
                                <span style={{ color: "red", fontSize: 11 }}>{this.state.pricerr}</span>

                                <div style={{ textAlign: "center" }}>
                                    <button style={{ background: "chartreuse", padding: "2% 4%", color: "white" }} onClick={() => this.EditList()}>Edit</button>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="market_left_margin_inside_lower">
                        <div style={{ fontWeight: "bold" }}>Categories</div>
                        <ul>
                            <li><button onClick={() => this.setState({ search: "" })}>All Items</button></li>
                            <li><button onClick={() => this.setState({ search: this.state.user.id })}>Your Items</button></li>
                            <li><AiFillCar style={{ backgroundColor: "lightgrey", padding: "1%", borderRadius: "50%" }} /> Vehicles</li>
                            <li><BsHouseDoor style={{ backgroundColor: "lightgrey", padding: "1%", borderRadius: "50%" }} /> Property</li>
                            <li><BsLaptop style={{ backgroundColor: "lightgrey", padding: "1%", borderRadius: "50%" }} /> Laptops</li>
                        </ul>
                    </div>
                </div>
                <div className="market_right_margin">
                    <div style={{ paddingLeft: "3%", paddingTop: "2%" }}>
                        <div style={{ fontWeight: 600, color: "darkgrey" }}>Top Picks For You</div>


                        <div>
                            {
                                this.state.List.filter((item) => item.name.toLocaleLowerCase().indexOf(this.state.search.toLocaleLowerCase()) == 0).map((item, index) => {
                                    return (
                                        <div style={{ width: "auto", float: "left", marginTop: "2%", marginRight: "3%" }} key={index} >
                                            <img src={require(`${item.image}`)} style={{ borderRadius: 5 }} width="150px" height="170px" />
                                            <div style={{ marginTop: "2%" }}>
                                                <div style={{ fontSize: 12, fontWeight: "bold" }}>
                                                    <span>${item.price}</span>
                                                    {
                                                        item.userid == this.state.user.id ?
                                                            <button style={{ float: "right", color: "cadetblue" }} onClick={() => this.Edit(item, index)}>Edit</button> :
                                                            <span />
                                                    }
                                                </div>
                                                <div style={{ fontSize: 12 }}>
                                                    {item.name}
                                                    {
                                                        item.userid == this.state.user.id ?
                                                            <button style={{ float: "right", color: "red" }} onClick={() => this.Delete(index)}>Delete</button> :
                                                            <span />
                                                    }
                                                </div>
                                                {
                                                    parseInt(item.qty) > 0 ? <div style={{ fontSize: 15, color: "grey", textAlign: "center" }}>Qty- {item.qty}</div>
                                                        : <div style={{ fontSize: 15, color: "red", textAlign: "center" }}>Out Of Stock</div>
                                                }
                                                {
                                                    item.qty > 0 ?
                                                        <div style={{ textAlign: "center" }}><button style={{ color: "blue", fontSize: 14 }} onClick={() => this.Buy(item)}>Move To Cart</button></div>
                                                        : null
                                                }
                                            </div>

                                        </div>
                                    )
                                })
                            }

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}



export default Market;