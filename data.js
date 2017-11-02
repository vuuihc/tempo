const fs = require('fs');
const moment = require('moment');

let time;
let realX;


let errp1;
let errp2;
let errp3;


const alpha = 0.75;
const beta = 0.7;
const h = 1;
function computeX() {
    const contents = fs.readFileSync('./920.json','utf8');
    const jsonObj = JSON.parse(contents);
    realX = jsonObj['data'][0]['dots'].map(item=>item.value);
    time = jsonObj['data'][0]['dots'].map(item=>item.timestamp);
    const arrS = [];
    const arrT = [];
    const newX = [];

    arrS[0] = alpha*realX[0];
    arrT[0] = beta*(arrS[0]);
    newX[0] = realX[0];
    let errorPercent = 0;
    for(let i=1; i<realX.length; i++){
        arrS[i] = alpha * realX[i] + (1-alpha)*(arrS[i-1]+arrT[i-1]);
        arrT[i] = beta*(arrS[i] - arrS[i-1]) + (1-beta)*arrT[i-1];
        newX[i] = Math.round(arrS[i] + arrT[i]);
        errorPercent += Math.abs((newX[i] - realX[i])/realX[i])
    }
    errp1 = errorPercent/(realX.length)
    console.log(`横向平均误差率为 ${errp1}`);
    return newX;
}


function gene2Arr(j){
    var timeArr = [];
    for(var i=20-j;i<20;i++){
        var day = i<10?'0'+i:i;
        var contents = fs.readFileSync('./data/9'+day+'.json','utf8');
        var jsonObj = JSON.parse(contents);
        jsonObj['data'][0]['dots'].forEach((item,index)=>{
            if(!timeArr[index]) timeArr[index] = [];
            timeArr[index].push(item.value);
        });
    }
    
    const result = [];
    let errorPercent = 0;    
    for(var i=0; i<timeArr.length; i++){
        var arrX = timeArr[i];
        const arrS = [];
        const arrT = [];
        const newX = [];
    
        arrS[0] = alpha*arrX[0];
        arrT[0] = beta*(arrS[0]);
        newX[0] = arrX[0];
        for(let i=1; i<arrX.length; i++){
            arrS[i] = alpha * arrX[i] + (1-alpha)*(arrS[i-1]+arrT[i-1]);
            arrT[i] = beta*(arrS[i] - arrS[i-1]) + (1-beta)*arrT[i-1];
            newX[i] = Math.round(arrS[i] + arrT[i]);
        }
        result.push(newX.pop());
        errorPercent += Math.abs((result[result.length-1] - realX[i])/realX[i]);
    }
    console.log(`纵向平均误差率${errorPercent/timeArr.length}`);
    return {
        errp: errorPercent/timeArr.length,
        result
    };
}


const dayArr = computeX();
let historyArr;
let historyErrArr = [];
function getHistoryArr(){
    let minerrp = 1;
    let min = 0;
    for(var i=2;i<20;i++){
        let r = gene2Arr(i);
        if(r.errp<minerrp){
            minerrp = r.errp;
            historyArr = r.result;
            min = i;
        }
        historyErrArr.push(r.errp);
    }
    errp2 = minerrp;
    console.log(`历史天数 为${min}时误差率最小${minerrp}`);    
}
getHistoryArr();


function combine(gama) {
    let errorPercent = 0;
    let arr = [];
    for(var i=0;i<realX.length;i++){
        let combX = gama* dayArr[i] + (1-gama)*historyArr[i];
        arr.push(combX);
        errorPercent += Math.abs((combX-realX[i])/realX[i]);
    }
    return {
        arr,
        errp:errorPercent/realX.length
    };
}
var gamaErrArr  = [];
function getMin() {
    let min = 1,mingama=0;
    for (var i = 0; i < 100; i++) {
        let errp = combine(i/100).errp;
        gamaErrArr.push(errp);
        if(errp<min){
            min=errp;
            mingama = i/100;
        }
    }
    errp3 = min;
    console.log(`gama 为${mingama}时结合后平均误差率${min}`);
}
getMin();
let combX = combine(0.677).arr;

var gamaOption = {
    title: {
        text: '不同r误差率变化图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:[]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Array.from({length:100},(item,index)=>(index+1)/100)
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'误差率',
            type:'line',
            data: gamaErrArr
        }
    ]
};

var errOption =  {
    title: {
        text: '误差率变化图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:[]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Array.from({length:19},(item,index)=>index+1)
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'误差率',
            type:'line',
            data: historyErrArr
        }
    ]
};

var option = {
    title: {
        text: '客流趋势图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:[]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: time.map(item=>moment(item).format('HH:mm'))
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'实际客流',
            type:'line',
            data: realX
        },
        {
            name:'同比预测客流',
            type:'line',
            data: historyArr
        },
        // {
        //     name:'环比预测客流',
        //     type:'line',
        //     data: dayArr
        // },
        // {
        //     name:'综合预测客流',
        //     type:'line',
        //     data: combX
        // }
    ]
};
console.log(`3误差率相对于1下降了${(errp1-errp3)/(errp1)}`);
console.log(`3误差率相对于2下降了${(errp2-errp3)/(errp2)}`);

module.exports = gamaOption;