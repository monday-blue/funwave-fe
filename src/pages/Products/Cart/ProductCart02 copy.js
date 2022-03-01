import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';

import { useAuth } from '../../../context/auth';
import './Cart.scss';
import greenTitle from '../../../data/images/greenTitle.svg';
import { API_URL } from '../../../utils/config';

function ProductCart02() {
  // 會員資料傳入useContext
  const { auth, setAuth } = useAuth();
  console.log('auth', auth);

  // 將localStorage的資料存為狀態orderCart
  const [orderCart, setOrderCart] = useState([]);

  // 整理重複的orderCart為orderCartDisplay
  const [orderCartDisplay, setOrderCartDisplay] = useState([]);

  // 表單元素 (要存進order-list、order_details資料表)
  const [order, setOrder] = useState({
    member_id: 0,
    amount: 0,
    payment: 'a',
    payment_status: 'a',
    delivery: 'a',
    receiver: 'a',
    receiver_phone: '0',
    address: 'a',
    convenient_store: 'a',
    status: '訂單處理中',
    order_time: '2021-12-13 14:33:56',
    order_details: [],
  });

  // 表單元素 (要存進order_details資料表)
  const [orderDetails, setOrderDetails] = useState([]);

  // 表單元素 (可同步會員資料)
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberAddress, setMemberAddress] = useState('');

  const [validated, setValidated] = useState(false);

  // 模擬componentDidMount
  // 提取LocalStorage的資料，和ProductCart01.js相同之步驟
  function getCartFromLocalStorage() {
    const orderCart = JSON.parse(localStorage.getItem('productCart') || '[]');
    console.log('orderCart', orderCart);
    setOrderCart(orderCart);
  }
  useEffect(() => {
    getCartFromLocalStorage();
  }, []);

  // 模擬componentDidUpdate
  // 整理orderCart中product_no相同的品項，和ProductCart01.js相同之步驟
  useEffect(() => {
    let newOrderCartDisplay = [];

    for (let i = 0; i < orderCart.length; i++) {
      const index = newOrderCartDisplay.findIndex(
        (value) => value.product_no === orderCart[i].product_no
      );
      if (index !== -1) {
        newOrderCartDisplay[index].count += orderCart[i].count;
      } else {
        const newItem = { ...orderCart[i] };
        newOrderCartDisplay = [...newOrderCartDisplay, newItem];
      }
    }

    console.log('newOrderCartDisplay', newOrderCartDisplay);
    setOrderCartDisplay(newOrderCartDisplay);
  }, [orderCart]);

  useEffect(() => {
    setOrderDetails(orderCartDisplay);
    console.log('orderDetails', orderDetails);
  }, [orderCartDisplay]);

  // 計算總價用的函式，和ProductCart01.js相同之步驟
  const sum = (items) => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += items[i].count * items[i].price;
    }
    return total;
  };

  console.log(sum(orderCartDisplay));

  // 模擬componentDidMount
  useEffect(() => {
    // member_id，從useContext帶入
    // amount，從localstorage帶入單價、數量，然後再計算
    setOrder({
      ...order,
      member_id: auth.id,
      amount: sum(orderCartDisplay), // 順序bug!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      order_details: orderDetails,
    });

    // memberName、memberEmail、memberPhone、memberAddress，從useContext帶入
    setMemberName(auth.name);
    setMemberEmail(auth.email);
    setMemberPhone(auth.phone);
    setMemberAddress(auth.address);
  }, []);

  // 表單中的onchange事件 (限order物件內的欄位)
  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
    console.log('order', order);
  };

  // react-bootstrap原本的
  // const handleSubmit = (e) => {
  //   const form = e.currentTarget;
  //   if (form.checkValidity() === false) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }

  //   setValidated(true);
  // };

  async function handleSubmit(e) {
    // 送出資料前的驗證
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    // 這裡有問題！！！
    e.preventDefault(); // 我自己加的

    // 送出資料存進資料庫
    // order.details = [...]
    try {
      let response = await axios.post(`${API_URL}/products/order_list`, order);
      console.log(response.data);
    } catch (e) {
      console.error('error', e.response.data);
    }
  }

  return (
    <>
      <div className="container">
        {/* 購物車三步驟 */}
        <header className="m-5 py-2 px-5">
          <div className="text-secondary fw-bold h1 text-center mb-5">
            <img
              src={greenTitle}
              className="greenTitle me-3"
              alt="greenTitle"
              height="24px"
              weight="64px"
            />
            衝浪商品購物車
          </div>
          <div className="d-flex justify-content-evenly">
            <div className="d-flex align-items-center shadow py-2 cartStepsSigns borderRadius">
              <div className="fs-1 w-25 text-center">01</div>
              <div className="w-75">
                確認清單 & 付款及配送方式
                <br />
                Cart & Check out
              </div>
            </div>
            <div className="d-flex justify-content-evenly align-items-center shadow py-2 cartStepsSigns cartStepsSignsOrange borderRadius">
              <div className="fs-1 w-25 text-center">02</div>
              <div className="w-75">
                填寫訂購資料
                <br />
                Shipping & Billing Info
              </div>
            </div>
            <div className="d-flex justify-content-evenly align-items-center shadow py-2 cartStepsSigns borderRadius">
              <div className="fs-1 w-25 text-center">03</div>
              <div className="w-75">
                購物完成！
                <br />
                Order completed
              </div>
            </div>
          </div>
        </header>
        <article>
          <div className="row d-flex justify-content-center">
            <div className="col-8 m-0 p-0 shadow borderRadius">
              <div className="p-4 border-bottom text-center">
                <h1>訂購資訊{order.amount}</h1>
              </div>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                method="post"
              >
                {/* 訂購人資訊 */}
                <div className="px-5 py-4">
                  <div className="d-flex justify-content-between">
                    <h3>訂購人資訊</h3>
                    <div className="form-check">
                      <input
                        className="form-check-input mt-2"
                        type="checkbox"
                        value=""
                        id="check"
                      />
                      <label
                        className="form-check-label mt-2 fs-6"
                        htmlFor="check"
                      >
                        同步更新我的會員資料
                      </label>
                    </div>
                  </div>
                  {/* 訂購人姓名 */}
                  <Form.Group
                    controlId="validationCustomUsername"
                    className="mb-3"
                  >
                    <Form.Label>姓名</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="請輸入姓名"
                        aria-describedby="inputMemberName"
                        name="memberName"
                        value={memberName}
                        required
                        onChange={(e) => {
                          setMemberName(e.target.value);
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        請填寫訂購人姓名
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  {/* 訂購人信箱 */}
                  <Form.Group
                    controlId="validationCustomUsername"
                    className="mb-3"
                  >
                    <Form.Label>E-mail (帳號)</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="email"
                        placeholder="請輸入E-mail"
                        aria-describedby="inputEmail"
                        name="memberEmail"
                        value={memberEmail}
                        required
                        onChange={(e) => {
                          setMemberEmail(e.target.value);
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        請填入正確格式的訂購人E-mail
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  {/* 訂購人手機號碼 */}
                  <Form.Group
                    controlId="validationCustomUsername"
                    className="mb-3"
                  >
                    {/* 要驗證號碼跟長度！！！！！！！ */}
                    <Form.Label>手機號碼</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="請輸入手機號碼"
                        aria-describedby="inputPhone"
                        name="memberPhone"
                        value={memberPhone}
                        required
                        onChange={(e) => {
                          setMemberPhone(e.target.value);
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        請填寫訂購人手機號碼
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  {/* 訂購人地址 */}
                  <div className="row mb-3">
                    <div className="col-4">
                      <Form.Label>縣市</Form.Label>
                      <Form.Select aria-label="select">
                        <option>請選擇縣市</option>
                        <option value="1">台北市</option>
                        <option value="2">新北市</option>
                        <option value="3">桃園市</option>
                        <option value="4">台中市</option>
                        <option value="5">台南市</option>
                        <option value="6">高雄市</option>
                        <option value="7">基隆市</option>
                        <option value="8">新竹市</option>
                        <option value="9">新竹縣</option>
                        <option value="10">彰化縣</option>
                        <option value="11">苗栗縣</option>
                        <option value="12">南投縣</option>
                        <option value="13">雲林縣</option>
                        <option value="14">嘉義市</option>
                        <option value="15">嘉義縣</option>
                        <option value="16">屏東縣</option>
                        <option value="17">台東縣</option>
                        <option value="18">花蓮縣</option>
                        <option value="19">宜蘭縣</option>
                      </Form.Select>
                    </div>
                    <div className="col-8">
                      <Form.Group controlId="validationCustom03">
                        <Form.Label>詳細地址</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="請輸入地址"
                          name="memberAddress"
                          value={memberAddress}
                          required
                          onChange={(e) => {
                            setMemberAddress(e.target.value);
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          請填寫訂購人詳細地址
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
                </div>
                {/* 收件人資訊 */}
                <div className="px-5 py-4 border-top">
                  <div className="d-flex justify-content-between">
                    <h3>收件人資訊</h3>
                    <div className="form-check">
                      <input
                        className="form-check-input mt-2"
                        type="checkbox"
                        value=""
                        id="check"
                      />
                      <label
                        className="form-check-label mt-2 fs-6"
                        htmlFor="check"
                      >
                        同訂購人資訊
                      </label>
                    </div>
                  </div>
                  {/* 收件人姓名 */}
                  <Form.Group
                    controlId="validationCustomUsername"
                    className="mb-3"
                  >
                    <Form.Label>姓名</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="請輸入姓名"
                        aria-describedby="inputReceiver"
                        name="receiver"
                        value={order.receiver}
                        required
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        請填寫收件人姓名
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  {/* 收件人手機號碼 */}
                  <Form.Group
                    controlId="validationCustomUsername"
                    className="mb-3"
                  >
                    {/* 要驗證號碼跟長度！！！！！！！ */}
                    <Form.Label>手機號碼</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="請輸入手機號碼"
                        aria-describedby="inputReceiverPhone"
                        name="receiver_phone"
                        value={order.receiver_phone}
                        required
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        請填寫收件人手機號碼
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </div>
                {/* 配送資訊 */}
                <div className="px-5 py-4 border-top">
                  <div className="d-flex justify-content-between">
                    <h3>配送資訊</h3>
                    <div className="form-check">
                      <input
                        className="form-check-input mt-2"
                        type="checkbox"
                        value=""
                        id="check"
                      />
                      <label
                        className="form-check-label mt-2 fs-6"
                        htmlFor="check"
                      >
                        同訂購人地址
                      </label>
                    </div>
                  </div>
                  {/* 地址 */}
                  <div className="row mb-3">
                    <div className="col-4">
                      <Form.Label>縣市</Form.Label>
                      <Form.Select aria-label="Default select example">
                        <option>請選擇縣市</option>
                        <option value="1">台北市</option>
                        <option value="2">新北市</option>
                        <option value="3">桃園市</option>
                        <option value="4">台中市</option>
                        <option value="5">台南市</option>
                        <option value="6">高雄市</option>
                        <option value="7">基隆市</option>
                        <option value="8">新竹市</option>
                        <option value="9">新竹縣</option>
                        <option value="10">彰化縣</option>
                        <option value="11">苗栗縣</option>
                        <option value="12">南投縣</option>
                        <option value="13">雲林縣</option>
                        <option value="14">嘉義市</option>
                        <option value="15">嘉義縣</option>
                        <option value="16">屏東縣</option>
                        <option value="17">台東縣</option>
                        <option value="18">花蓮縣</option>
                        <option value="19">宜蘭縣</option>
                      </Form.Select>
                    </div>
                    <div className="col-8">
                      <Form.Group controlId="validationCustom03">
                        <Form.Label>詳細地址</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="請輸入地址"
                          name="address"
                          value={order.address}
                          required
                          onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          請填寫詳細地址
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
                  {/* 收件超商門市 */}
                  <div className="row mb-3">
                    <div className="col-4">
                      <Form.Label>縣市</Form.Label>
                      <Form.Select aria-label="Default select example">
                        <option>請選擇縣市</option>
                        <option value="1">台北市</option>
                        <option value="2">新北市</option>
                        <option value="3">桃園市</option>
                        <option value="4">台中市</option>
                        <option value="5">台南市</option>
                        <option value="6">高雄市</option>
                        <option value="7">基隆市</option>
                        <option value="8">新竹市</option>
                        <option value="9">新竹縣</option>
                        <option value="10">彰化縣</option>
                        <option value="11">苗栗縣</option>
                        <option value="12">南投縣</option>
                        <option value="13">雲林縣</option>
                        <option value="14">嘉義市</option>
                        <option value="15">嘉義縣</option>
                        <option value="16">屏東縣</option>
                        <option value="17">台東縣</option>
                        <option value="18">花蓮縣</option>
                        <option value="19">宜蘭縣</option>
                      </Form.Select>
                    </div>
                    <div className="col-8">
                      <Form.Label>超商門市</Form.Label>
                      <Form.Select aria-label="Default select example">
                        <option>請選擇門市</option>
                        <option
                          value="1"
                          name="convenient_store"
                          onChange={handleChange}
                        >
                          台北門市
                        </option>
                        <option
                          value="2"
                          name="convenient_store"
                          onChange={handleChange}
                        >
                          新北門市
                        </option>
                        <option
                          value="3"
                          name="convenient_store"
                          onChange={handleChange}
                        >
                          桃園門市
                        </option>
                        <option
                          value="4"
                          name="convenient_store"
                          onChange={handleChange}
                        >
                          台中門市
                        </option>
                        <option
                          value="5"
                          name="convenient_store"
                          onChange={handleChange}
                        >
                          台南門市
                        </option>
                      </Form.Select>
                    </div>
                  </div>
                </div>
                {/* 發票資訊，目前無作用！ */}
                <div className="px-5 py-4 border-top border-bottom">
                  <h3>發票資訊</h3>
                  <div className="d-flex">
                    <div className="form-check me-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="radio1"
                        // checked
                        // onChange={}
                      />
                      <label className="form-check-label" htmlFor="radio1">
                        捐贈發票
                      </label>
                    </div>
                    <div className="form-check me-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="radio2"
                        // checked
                      />
                      <label className="form-check-label" htmlFor="radio2">
                        紙本發票
                      </label>
                    </div>
                    <div className="form-check me-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="radio3"
                      />
                      <label className="form-check-label" htmlFor="radio3">
                        電子發票（手機載具）
                      </label>
                    </div>
                    <div className="form-check me-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="radio4"
                        // checked
                      />
                      <label className="form-check-label" htmlFor="radio4">
                        公司用發票（三聯式）
                      </label>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4">
                  {/* 同意接受服務條款及隱私權政策 */}
                  <Form.Group className="mb-3">
                    <Form.Check
                      required
                      label="我同意接受服務條款及隱私權政策。"
                      feedback="請勾選同意接受服務條款及隱私權政策。"
                      feedbackType="invalid"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-evenly mt-4">
                    <button className="btn btn-secondary text-white">
                      上一步
                    </button>
                    <Button type="submit">完成訂購！</Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

export default ProductCart02;