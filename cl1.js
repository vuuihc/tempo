var request = require('request-promise');
var fs = require('fs');

var r1 = request({
    uri: 'https://prod.niuap.com/feeleriii/auth/emailLogin',
    method: 'POST',
    jar: true,
    json: {
        email:"3echuanmei@feeler",
        password:"3echuanmei@feeler"
    },
});
r1.then(function(res){
    for(var i=1;i<31;i++){
        getJson(i);
    }
})

async function getJson(i){
    var day = (i<10?'0'+i:i);
    let res = await request({
        uri: 'https://prod.niuap.com/feeleriii/user/getRealtimeDetailByHour?unitId=2100086&date=2017-09-'+day,
        jar: true,
    });
    var fd = fs.openSync('./data/9'+day+'.json','w');
    fs.writeSync(fd, res);
    console.log(day+'done')
}
