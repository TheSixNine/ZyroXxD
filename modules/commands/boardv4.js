module['exports']['config'] = {
    name: 'board4',
    version: '1.0.1',
    hasPermssion: 0,
    credits: 'MR CHAND',
    description: '',
    commandCategory: 'general',
    usages: 'text [text]',
    cooldowns: 5,
    dependencies: {
        "\x63\x61\x6E\x76\x61\x73": '',
        "\x61\x78\x69\x6F\x73": '',
        "\x66\x73\x2D\x65\x78\x74\x72\x61": ''
    }
};
module['exports']['wrapText'] = (ctx, text, maxWidth) => {
    return new Promise((resolve) => {
        if (ctx['measureText'](text)['width'] < maxWidth) {
            return resolve([text])
        };
        if (ctx['measureText']('W')['width'] > maxWidth) {
            return resolve(null)
        };
        const words = text['split'](' ');
        const lines = [];
        let line = '';
        while (words['length'] > 0) {
            let split = false;
            while (ctx['measureText'](words[0])['width'] >= maxWidth) {
                const temp = words[0];
                words[0] = temp['slice'](0, -1);
                if (split) {
                    words[1] = `${''}${temp['slice'](-1)}${''}${words[1]}${''}`
                } else {
                    split = true;
                    words['splice'](1, 0, temp['slice'](-1))
                }
            };
            if (ctx['measureText'](`${''}${line}${''}${words[0]}${''}`)['width'] < maxWidth) {
                line += `${''}${words['shift']()}${' '}`
            } else {
                lines['push'](line['trim']());
                line = ''
            };
            if (words['length'] === 0) {
                lines['push'](line['trim']())
            }
        };
        return resolve(lines)
    })
};
module['exports']['run'] = async function({
    api,
    event,
    args
}) {
    let {
        senderID,
        threadID,
        messageID
    } = event;
    const {
        loadImage,
        createCanvas
    } = require('canvas');
    const fs = global['nodemodule']['fs-extra'];
    const axios = global['nodemodule']['axios'];
    let pathImg = __dirname + '/cache/markngu.png';
    var text = args['join'](' ');
    if (!text) {
        return api['sendMessage']('Enter the content of the comment on the board', threadID, messageID)
    };
    let getPorn = (await axios['get'](`${'https://i.imgur.com/rFVdXJm.jpg'}`, {
        responseType: 'arraybuffer'
    }))['data'];
    fs['writeFileSync'](pathImg, Buffer['from'](getPorn, 'utf-8'));
    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage['width'], baseImage['height']);
    let ctx = canvas['getContext']('2d');
    ctx['drawImage'](baseImage, 0, 0, canvas['width'], canvas['height']);
    ctx['font'] = '400 45px Arial';
    ctx['fillStyle'] = '#000000';
    ctx['textAlign'] = 'start';
    let fontSize = 400;
    while (ctx['measureText'](text)['width'] > 1900) {
        fontSize--;
        ctx['font'] = `${'400 '}${fontSize}${'px Arial, sans-serif'}`
    };
    const lines = await this['wrapText'](ctx, text,400);
    ctx['fillText'](lines['join']('\n'), 90, 150);
    ctx['beginPath']();
    const imageBuffer = canvas['toBuffer']();
    fs['writeFileSync'](pathImg, imageBuffer);
    return api['sendMessage']({
        attachment: fs['createReadStream'](pathImg)
    }, threadID, () => {
        return fs['unlinkSync'](pathImg)
    }, messageID)
}