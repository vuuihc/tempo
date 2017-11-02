var Crawler = require('crawler');

var c = new Crawler({
    maxConnections: 10,
    callback: null,
    jar: true
});
var loginReq = {
    uri: 'https://prod.niuap.com/feeleriii/auth/emailLogin',
    method: "POST",
    json: {
        email:"3echuanmei@feeler",
        password:"3echuanmei@feeler"
    },
    jQuery: false,
    callback: function(error, res){
        if(error){
            console.error(error);
        }else{
            console.log(res.request);
            // console.log(res.headers);
            // console.log(res.cookies);
        }
    }
}
function geneQueue(){
    var url='https://prod.niuap.com/feeleriii/user/getRealtimeDetailByHour?unitId=2100086&date=2017-09-';
    var queue = [];
    for(var i=1;i<3;i++){
        queue.push({
            uri: url+(i<10?'0'+i:i),
            jQuery: false,
            callback: function(error, res, done) {
                console.log(res.body);
            }
        })
    }
    return queue;
}

var queue =  geneQueue();

c.queue(loginReq);
c.queue(queue);


