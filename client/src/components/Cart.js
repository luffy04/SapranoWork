import React, { Component } from 'react';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import "./Cart.css";
import Modal from '@material-ui/core/Modal';

// "JHA10MNX20PYSCHO"

class Cart extends Component {
    constructor() {
        super();
        this.state = {
            Cart: [],
            user: {
                id: "JHA10MNX20PYSCHO",
                name: "Luffy",
            },
            modalShow: false,
            index: -1
        }
    }

    componentDidMount = () => {
        axios.get("http://192.168.0.106:5000/getCart")
            .then(res => {
                console.log(res);
                this.setState({ Cart: res.data });
                console.log(this.state.Cart[0].price)
            }).catch(err => {
                console.log(err);
            })
    }

    submit = () => {
        console.log(new Date(new Date().setHours(12, 0, 0, 0)).toISOString().slice(0, 19));
        var data = {
            firstName: this.state.firstName.trim(),
            lastName: this.state.lastName.trim(),
            email: this.state.email.trim(),
            message: this.state.message.trim(),
            date: new Date(new Date().setHours(12, 0, 0, 0)).toISOString().slice(0, 19).replace('T', ' '),
        }
        axios.post("http://192.168.0.106:5000/send", { data })
        .then(res => {
            NotificationManager.success("Success");
        }).catch(err => {
            NotificationManager.error("Error");
            console.log(err)
        })
    }

    Checkout = (index) => {
        this.setState({ modalShow: true, index: index })
    }

    Buy = () => {
        var id = this.state.Cart[this.state.index]._id;
        axios.post("http://192.168.0.106:5000/buy", { id })
        .then(res => {
            var Cart = this.state.Cart;
            Cart.splice(this.state.index, 1);
            this.setState({ Cart, modalShow: false, index: -1 })
            NotificationManager.success("On the Way!!")
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <div className="cart_main">
                {
                    this.state.Cart.map((item, key) => {
                        console.log(item.image)
                        return (
                            <div className="cart_main_inside" key={key}>
                                <div style={{ width: "40%", float: "left" }}>
                                    <img src={require(`${item.image}`)} />
                                </div>
                                <div style={{ width: "59%", float: "left" }}>
                                    <div style={{ float: "right" }}>
                                        <div style={{ fontSize: 15, marginTop: 7 }}>Product Name:<span style={{ color: "grey" }}> {item.name}</span></div>
                                        <div style={{ fontSize: 15, marginTop: 7 }}>Price:<span style={{ color: "grey" }}> {item.price}</span></div>
                                        <div style={{ fontSize: 15, marginTop: 7 }}>Quantity:<span style={{ color: "grey" }}> {item.qty}</span></div>
                                        <div style={{ fontSize: 15, marginTop: 7 }}>Total Price:<span style={{ color: "grey" }}> ${item.price * item.qty}</span></div>
                                        <button className="buy" onClick={() => this.Checkout(key)}>Proceed to Checkout</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    this.state.Cart.length==0 &&
                    <div style={{textAlign:"center",color:"red",fontSize:18}}>Your Cart Is Empty!!</div>
                }
                <Modal
                    open={this.state.modalShow}
                    onClose={() => this.setState({ modalShow: false })}
                >
                    <div className="modal_container">
                        {
                            this.state.index != -1 &&
                            <div className="modal_container_inside">
                                <div style={{ width: "40%", float: "left" }}>
                                    <img src={require(`${this.state.Cart[this.state.index].image}`)} />
                                </div>
                                <div style={{ width: "59%", float: "left" }}>
                                    <div style={{ float: "right" }}>
                                        <div style={{ fontSize: 15, marginTop: 7 }}>Product Name:<span style={{ color: "grey" }}> {this.state.Cart[this.state.index].name}</span></div>
                                        <div style={{ fontSize: 15, marginTop: 7 }}>Seller Name:<span style={{ color: "grey" }}> {this.state.Cart[this.state.index].username}</span></div>
                                        <div style={{ fontSize: 15, marginTop: 7 }}>Price:<span style={{ color: "grey" }}> {this.state.Cart[this.state.index].price}</span></div>
                                        <div style={{ fontSize: 15, marginTop: 7 }}>Quantity:<span style={{ color: "grey" }}> {this.state.Cart[this.state.index].qty}</span></div>
                                        <div style={{ fontSize: 15, marginTop: 7 }}>Total Price:<span style={{ color: "grey" }}> ${this.state.Cart[this.state.index].price * this.state.Cart[this.state.index].qty}</span></div>
                                        <button className="buy" onClick={() => this.Buy()}>Buy</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </Modal>
                <NotificationContainer />
            </div>
        );
    }
}



export default Cart;