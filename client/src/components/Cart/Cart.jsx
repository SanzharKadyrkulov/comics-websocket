import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useEffect } from "react";
import { useProducts } from "../../contexts/ProductContext";
import { Button, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import HeaderLayout from "../../layouts/HeaderLayout";
import axios from "axios";
import { JSON_API_ORDER } from "../../helpers/consts";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableCellImg: {
    width: 50,
  },
});

export default function Cart() {
  const classes = useStyles();
  const params = useParams();
  const { cart, getCart, changeProductCount, history } = useProducts();
  const [orders, setOrders] = useState();
  const time = new Date().toLocaleString();

  useEffect(() => {
    getCart();
  }, []);
  //   useEffect(() => {
  //     if(!localStorage.getItem('token')){
  //       history.push('/')
  //       alert("Login or Signup")
  //     }
  // },[params])

  const handleCountChange = (count, id) => {
    if (count < 1) {
      count = 1;
    }
    changeProductCount(count, id);
  };
  const cartCleaner = () => {
    localStorage.removeItem("cart");
    getCart();
  };
  const addOrderHistory = async (order) => {
    const newOrder = {
      ...order,
      date: time,
    };
    const data = await axios.post(JSON_API_ORDER, newOrder);
  };
  useEffect(() => {
    setOrders(cart);
  }, [cart]);

  return (
    <HeaderLayout>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Count</TableCell>
              <TableCell align="right">SubPrice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.products &&
              cart.products.map((product) => (
                <TableRow>
                  <TableCell>
                    <img
                      className={classes.tableCellImg}
                      src={product.item.image}
                      alt={product.item.title}
                    />
                  </TableCell>
                  <TableCell align="right">{product.item.title}</TableCell>
                  <TableCell align="right">{product.item.price}</TableCell>
                  <TableCell align="right">
                    <input
                      type="number"
                      value={product.count}
                      onChange={(e) =>
                        handleCountChange(e.target.value, product.item.id)
                      }
                    />
                  </TableCell>
                  <TableCell align="right">{product.subPrice}</TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={2}>
                <Typography variant="h5">Total:</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h5">{cart.totalPrice}$</Typography>
              </TableCell>
              <TableCell align="right">
                <Button
                  onClick={() => {
                    addOrderHistory(orders);
                    cartCleaner();
                    history.push("/order");
                  }}
                  className="btn-buy"
                  style={{ backgroundColor: "#e96a1b", color: "#fef7f0" }}
                >
                  Buy
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </HeaderLayout>
  );
}
