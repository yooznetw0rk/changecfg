const inputElem = document.querySelector('#input');
const btnElem = document.querySelector('#getCfg');

let addreses = [
    { isp: 'Irancell', ip: 'irc.yooznetwork.cloud' },
    { isp: 'Hamrah', ip: 'mci.yooznetwork.cloud' },
    { isp: 'ADSL', ip: 'adsl.yooznetwork.cloud' }
]

// Random String generator
let makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

let fixedCfg = [];
btnElem.addEventListener('click', () => {
    let userCfg = inputElem.value;
    let hostSeprator = (host)=> {
        let hostArr = host.split('.');
        hostArr[0] = makeid(8);
        return hostArr.join('.');
    }
    try {
        let cfgObj = JSON.parse(atob(userCfg.trim().substring(8)));
        addreses.forEach(adds => {
            let tempObj = { ...cfgObj };
            tempObj.ps = `${'Persian Rayan'} [${adds.isp}]`;
            tempObj.add = adds.ip;
            tempObj.host = hostSeprator(tempObj.host);
            tempObj.sni = '';
            fixedCfg.push(tempObj);
            tempObj = '';
        });
        console.log(fixedCfg);
        let fixedCfgText = '';
        fixedCfg.forEach(cfg => {
            fixedCfgText += `vmess://${btoa(JSON.stringify(cfg))}\n\n`;
        });
        navigator.clipboard.writeText(fixedCfgText).then(() => {
            alert("کانفیگ ها با موفقیت در کلیپ بورد ذخیره شدند.")
        })

        fixedCfg = [];
        fixedCfgText = '';
    } catch (error) {
        console.log(error);
        alert("عملیات موفق نبود، به نظر میرسد لینکی که وارد کرده اید ناقص یا اشتباه است.")
    }
});
