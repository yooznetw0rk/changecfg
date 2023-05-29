const inputElem = document.querySelector('input');
const btnElem = document.querySelector('button');

// DB
let addreses = [
    { isp: 'IRC - MBT 1', ip: 'cdn1.hostpro.tech' },
    { isp: 'IRC - MBT 2', ip: 'cdn2.hostpro.tech' },
    { isp: 'IRC - MBT 3', ip: 'cdn3.hostpro.tech' }
]

let blackList = [
    new RegExp(/\w+\.nazsuk.ga/g),
    new RegExp(/\w+\.hostpro.tech/g),
    new RegExp(/\w+\.p-rayan.cloud/g)
]

let whiteList = [
    'mentally-retarded.tk',
    'yoozmobile.tech'
]
// DB

// comp
const makeid = (length) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// comp

// cfg logic
let userConfig;

const getConfigObj = () => {
    const regex = new RegExp(/vmess:\/\/\S*/g);
    let userConfigLink;
    try {
        userConfigLink = regex.exec(inputElem.value)[0];
        userConfig = JSON.parse(atob(userConfigLink.slice(8)));
        initConfig();
    } catch (err) {
    }
}

const checkGRPCConfig = () => {
    
    let isSNIBlack = false;
    if (userConfig.sni) {
        for (let regex of blackList) {
            isSNIBlack = regex.test(userConfig.sni);
            if (isSNIBlack) break
        }
        isSNIBlack ? alert('کانفیگ شما دچار مشکل شده. لطفا سریعا به پشتیبانی مراجعه کنید') : fixConfig();
    } else fixConfig()
}

const checkWSConfig = () => {
    if (userConfig.sni) {
        let isSNIBlack = false;
        for (let regex of blackList) {
            isSNIBlack = regex.test(userConfig.sni);
            if (isSNIBlack) break
        }

        if (isSNIBlack) {
             alert('کانفیگ شما دچار مشکل شده. لطفا سریعا به پشتیبانی مراجعه کنید') 
        } else {
            userConfig = {...userConfig, port: '', host: ''}
            userConfig.port = 8443
            userConfig.host = ''
            userConfig.net = 'grpc'
            fixConfig();
        }
    } else fixConfig()
}

let fixedConfigsTxt = ''
let fixedConfigs = []

const fixConfig = () => {
    fixedConfigs = [];
    addreses.forEach(adds => {
        let tempObj = { ...userConfig, sni: ''};
        tempObj.add = adds.ip
        tempObj.ps = `YoozNetwork [${adds.isp}]`
        tempObj.path = ''
        tempObj.sni = `${makeid(8)}.${whiteList[random(0, whiteList.length - 1)]}`
        fixedConfigs.push(tempObj)
        tempObj = ''
    });

    fixedConfigsTxt = ''
    fixedConfigs.forEach(cfg => {
        fixedConfigsTxt += `vmess://${btoa(JSON.stringify(cfg))}\n\n`
    })
    
    window.navigator.clipboard.writeText(fixedConfigsTxt)
    .then(alert("کانفیگ با موفقیت بروزرسانی و کپی شد."))
}

const initConfig = () => {
    userConfig.net === 'grpc' ? checkGRPCConfig()
        : userConfig.net === 'ws' ? checkWSConfig()
            : '';
}
// cfg logic

// DOM
const renderBtn = (msg, color, link) => {
    const container = document.querySelector('#button-area');
    container.insertAdjacentElement('beforeend', `
        <button class="btn-primary bg-${color}-400">${msg}</button>
    `)
}
// DOM

btnElem.addEventListener('click', getConfigObj);
