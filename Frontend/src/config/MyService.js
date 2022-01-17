import axios from 'axios'
import { MAIN_URL } from './Url'
let token = localStorage.getItem('_token');

export function login(data) {
    return axios.post(`${MAIN_URL}login`, data);
}
export function socialLogin(data) {
    return axios.post(`${MAIN_URL}socialLogin`, data);
}
export function ForgotPassword1(data) {
    return axios.post(`${MAIN_URL}forgotPassword`, data);
}
export function NewPassword(data) {
    return axios.post(`${MAIN_URL}newpassword`, data);
}
export function updateuserdata(data) {
    return axios.post(`${MAIN_URL}updateuserdata`, data);
}
export function newaddress(data) {
    return axios.post(`${MAIN_URL}newaddress`, data);
}
export function updateaddress(data) {
    return axios.post(`${MAIN_URL}updateaddress`, data);
}
export function checkpassword(data) {
    return axios.post(`${MAIN_URL}checkpassword`, data);
}
export function fetchaddress(data) {
    return axios.get(`${MAIN_URL}fetchaddress/` + data);
}
export function deleteaddress(data) {
    return axios.get(`${MAIN_URL}deleteaddress/` + data);
}
export function updatePassword(data) {
    return axios.post(`${MAIN_URL}updatepassword`, data);
}
export function uploadimage(data, user) {
    return axios.post(`${MAIN_URL}uploadimage/` + user, data);
}
export function fetchprofileimage(user) {
    return axios.get(`${MAIN_URL}fetchimage/` + user);
}
export function fetchuser(data) {
    return axios.get(`${MAIN_URL}fetchuserdetails/` + data, { headers: { "Authorization": `Bearer ${token}` } });
}
export function FetchPopular() {
    return axios.get(`${MAIN_URL}fetchpopular`);
}
export function FetchAll() {
    return axios.get(`${MAIN_URL}fetchall`);
}
export function FetchSingleProduct(data) {
    return axios.get(`${MAIN_URL}fetchsingle/` + data);
}
export function Filter(cat, col) {
    return axios.get(`${MAIN_URL}filter/` + cat + "&&" + col);
}
export function giverating(data) {
    return axios.post(`${MAIN_URL}giverating`, data);
}
export function additemtocart(user, id) {
    return axios.post(`${MAIN_URL}addtocart/` + user + "&&" + id);
}
export function fetchcart(user) {
    return axios.get(`${MAIN_URL}fetchcart/` + user);
}
export function editquantity(data) {
    return axios.post(`${MAIN_URL}editquantity`, data);
}
export function deleteitem(id) {
    return axios.get(`${MAIN_URL}deleteitem/` + id);
}
export function cartcount(user) {
    return axios.get(`${MAIN_URL}cartcount/` + user);
}
export function cartwithoutlogin(id) {
    return axios.post(`${MAIN_URL}cartwithoutlogin/` + id);
}
export function placeorder(selectedadd, subtotal, GST, finaltotal) {
    return axios.post(`${MAIN_URL}placeorder/` + subtotal + '&&' + GST + '&&' + finaltotal, selectedadd);
}
export function fetchorder(email) {
    return axios.get(`${MAIN_URL}fetchorder/` + email);
}
export function getInvoice(id) {
    return axios.get(`${MAIN_URL}getInvoice/` + id);
}