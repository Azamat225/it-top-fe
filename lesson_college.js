//[{name: 'aaddqva', type: 'foo', age: 'asasdfads'}]
//[{name: 'aadsqva', type: 'foo', age: 'affgdsads'}]
//[{name: 'aasdgqva', type:'bar', age: 'asaqeqds'}]

function sortArrayAsObj(arr, type) {
    const result = {};
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const key = item[type];
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
    }
    return result;
}

const a = [
    { name: 'aasdadqva', type: 'foo', age: 'asadasdsads' },
    { name: 'aqreeeqqva', type: 'foo', age: 'asadwqeeqs' },
    { name: 'aqva', type: 'bar', age: 'sadfsadn' }
];

// console.log(sortArrayAsObj(a, 'type'));


// {
// foo:[{name: 'aasdadqva', type: 'foo', age: 'asadasdsads'}, {name: 'aqreeeqqva', type:'foo', age: 'asadwqeeqs'}],
// bar: [{name 'aqva'}, type: 'bar', age;'sadfsadn' ...] 
// }

