console.log('Hello, IT-TOP! :)');


let a = 5;
const buzz = 3;

// Типы данных в JS примитывные 
// const integer = 1;
let str = 'str';
// const bool = true;
// const nullar = null;
// const und = undefined;

// const bigInt = 1234567890123456789012345678901234567890n;
// const symb = 'as#sdsd';

// console.log(2 == '2');
// console.log(2 === '2');

//Nan, undefined, null, false, '', 0;

const falseNum = 0;
const trueNum = 1;




// Ссылочные типы данных
// const obj = {};

// const obj = {
//     'foo': false
// }

// str = 'sddsdssdsdd';
// let qwerty = str;
// str = '123';

// console.log(str, qwerty, 'log');

// const obj1 = {value : '123'};
// const obj2 = {... obj1};
// obj1.value = '456';


// const wb = {
//     pants: [''],
//     shoes: [''],
//     tshirt: [''],
// };

// const user = {
//     name: 'John',
//     age: 30,
// };


// массивы
let array = [1, 2, 3, 4];
const filteredArray = array.filter((el, i) => el !==2);
const mappedArray = array.map((el, i) => el *= 2)
const contactedArray = array.concat(mappedArray);
const sortedArray = array.sort((a, b) => a - b);
const reductedArray = array.reduce((acc, next) => acc += next, 0);


const newArr = array.push(543333);
const newArr2 = array.pop();
const newArr3 = array.shift();
const newArr4 = array.unshift();

const newArr5 = array.slice();
const newArr6 = array.splice();



// console.log(findIvan(users), 'findIvan?');

// console.log(newArr, newArr2, newArr3, newArr4, newArr5, newArr6);

// console.log(reductedArray, 'reducted');
// console.log(sortedArray, 'sorted');
// console.log(contactedArray, 'contacted');
// console.log(mappedArray, 'mapped');
// console.log(array, filteredArray, 'filtered');




// function 
function sumResult(a, b){
    return a + b;
};

const sumResultExpression = function(a, b){
    return a + b;
};

const sumResultExpession = (a, b) => a + b;


// array.forEach((el, index) => console.log(el,));

const users =[
    {name: 'John', age: 30, sex: 'male'},
    {name: 'Inav', age: 25, sex: 'male'},
    {name: 'Jack', age: 35, sex: 'male'},
    {name: 'Jilly', age: 18, sex: 'female'},
]


function filterUnder18(arr){
    return arr.filter(user => user.age >= 18);
}

// console.log(filterUnder18(users));


// [1,2,3] // [3]
// [9]
// arr1 + arr2
function findArray(arr1, arr2){
    const newArr = arr1.concat(arr2);
    return newArr.reduce((acc, next) => acc + next, 0);
};

// console.log(findArray([1, 2, 3], [3]), 'summ arr1 + arr2'); 



function findIvan(arr){
    return arr.find(user => user.name ==='Inav');

}
// console.log(findIvan(users), 'findIvan?');

function addUser(obj){
    return users.push(obj);
}

// console.log(addUser({name: 'Aza', age: 19}), 'addUser');
// console.log(users, 'Add new user');


function modifyUser(arr){
    users.map(user => user.age += 1);
    const girl = users.find(user => user.sex === 'female');
    return girl;
}

// console.log(modifyUser(users), 'girl - updateage');

//closure

function counter(){
    let num = 0;
    return function(){
        num += 1;
        return num;
    }
}
const res = counter();

res();
res();
res();

console.log(res(), 'counter');


// promise

