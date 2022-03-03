import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';

import './Cart.scss';
import CartHeader from '../Components/Cart/CartHeader02.js';
import CartMemberInfo from '../Components/Cart/CartMemberInfo.js';
import { useAuth } from '../../../context/auth'; // 從useContext拿會員資料
import { API_URL } from '../../../utils/config';

function ProductCart02() {
  // 會員資料傳入useContext
  const { auth, setAuth } = useAuth();
  console.log('auth', auth);

  // 將localStorage的資料(productCartDisplay)存為狀態orderCart
  const [orderCart, setOrderCart] = useState([]);

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
    order_details: [
      { product_no: 12345, count: 30 },
      { product_no: 123456, count: 300 },
    ],
  });

  // 子貨號、單價要存進order_details資料表
  const [orderDetails, setOrderDetails] = useState([]);

  // 表單元素 (可同步會員資料)
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberAddress, setMemberAddress] = useState('');

  const [validated, setValidated] = useState(false);

  // 縣市
  const counties = [
    '請選擇縣市',
    '台北市',
    '新北市',
    '桃園市',
    '台中市',
    '台南市',
    '高雄市',
    '基隆市',
    '新竹市',
    '新竹縣',
    '彰化縣',
    '苗栗縣',
    '南投縣',
    '雲林縣',
    '嘉義市',
    '嘉義縣',
    '屏東縣',
    '台東縣',
    '花蓮縣',
    '宜蘭縣',
  ];

  // 會員資料帶入訂購人資訊
  useEffect(() => {
    // member_id，從useContext帶入
    // setOrder({
    //   ...order,
    //   member_id: auth.member_id,
    // });
    // memberName、memberEmail、memberPhone、memberAddress，從useContext帶入
    // setMemberName(auth.member_name);
    // setMemberEmail(auth.member_email);
    // setMemberPhone(auth.member_phone);
    // setMemberAddress(auth.member_address);
  }, []);

  // react-bootstrap原本的
  const handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
  };

  console.log('memberName', memberName);
  console.log('memberEmail', memberEmail);
  console.log('memberPhone', memberPhone);
  console.log('memberAddress', memberAddress);

  return (
    <>
      {auth === null ? (
        <h1>請登入</h1>
      ) : (
        <div className="container">
          {/* 購物車三步驟進度條 */}
          <CartHeader />
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
                  <CartMemberInfo
                    order={order}
                    setOrder={setOrder}
                    memberName={memberName}
                    setMemberName={setMemberName}
                    memberEmail={memberEmail}
                    setMemberEmail={setMemberEmail}
                    memberPhone={memberPhone}
                    setMemberPhone={setMemberPhone}
                    memberAddress={memberAddress}
                    setMemberAddress={setMemberAddress}
                  />
                  {/* 收件人資訊 */}

                  {/* 配送資訊 */}

                  {/* 發票資訊，目前無作用！ */}

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
      )}
    </>
  );
}

export default ProductCart02;
