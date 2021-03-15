export default class TransformDataservice {
    getData = (res, setTitles, setErrorMessage, setData, setShowError, form) => {

        setTitles(res.meta.fields);
        form.current.reset();

        const dataArr = res.data.map((item, i) => {
            let arr = [];
            for (let key in item) {
                const curentValue = item[key].trim().toLowerCase();
                switch (key.toLowerCase()) {
                    case 'full name':
                    case 'phone':
                    case 'email':
                        if (curentValue !== '') {
                            arr = [...arr, { value: item[key].trim(), valid: true }]
                        } else {
                            setErrorMessage(`${key} is required`);
                            setShowError(true);

                        }

                        if (key.toLowerCase() !== 'full name') {
                            const searchArray = [...res.data.slice(0, i), ...res.data.slice(i + 1)];

                            let dublicateIndex = searchArray.map(it => it[key].trim().toLowerCase().slice(-10)).indexOf(curentValue.slice(-10));

                            if (key.toLowerCase() === 'email') {
                                dublicateIndex = searchArray.map(it => it[key].trim().toLowerCase()).indexOf(curentValue);
                            }

                            if (dublicateIndex !== -1) {
                                dublicateIndex >= i ? dublicateIndex += 2 : dublicateIndex += 1;
                                arr[arr.length - 1] = { value: item[key].trim(), valid: false, dublicateIndex }
                            }

                            if (key.toLowerCase() === 'phone') {
                                if (curentValue.match(/^\+?1?\d{10}$/)) {
                                    let value = curentValue;
                                    if (value[0] !== '+') {
                                        value = `+${value}`;
                                    }
                                    if (value[1] !== '1') {
                                        value = `+1${value.substring(1)}`;
                                    }
                                    arr = [...arr.slice(0, arr.length - 1), { ...arr.pop(), value }]
                                } else {
                                    arr = [...arr.slice(0, arr.length - 1), { ...arr.pop(), valid: false }]
                                }
                            }

                            if (key.toLowerCase() === 'email') {
                                if (!curentValue.match(/.+@.+\..+/i)) {
                                    arr = [...arr.slice(0, arr.length - 1), { ...arr.pop(), value: curentValue, valid: false }]
                                }
                            }
                        }
                        break;
                    case 'age':
                        if ((+curentValue < 21 && +curentValue <= 0) || isNaN(+curentValue)) {
                            arr = [...arr, { value: item[key].trim(), valid: false }]
                        } else {
                            arr = [...arr, { value: +item[key].trim(), valid: true }]
                        }
                        break;
                    case 'experience':
                        if ((+curentValue > 21 && +curentValue < 0) || isNaN(+curentValue)) {
                            arr = [...arr, { value: item[key].trim(), valid: false }]
                        } else {
                            arr = [...arr, { value: item[key].trim(), valid: true }]
                        }
                        break;
                    case 'yearly income':
                        if (+curentValue > 1000000 || isNaN(+curentValue)) {
                            let value = isNaN(+curentValue) ? item[key].trim() : (+item[key].trim()).toFixed(2);
                            arr = [...arr, { value, valid: false }]
                        } else {
                            arr = [...arr, { value: (+item[key].trim()).toFixed(2), valid: true }]
                        }
                        break;
                    case 'has children':
                        if (curentValue === 'true' || curentValue === 'false' || curentValue === '') {
                            const value = curentValue === '' ? 'false' : curentValue === 'true' ? 'true' : 'false';
                            arr = [...arr, { value, valid: true }]
                        } else {
                            arr = [...arr, { value: item[key].trim(), valid: false }]
                        }
                        break;
                    case 'license states':
                        let value = curentValue.split('|').map(item => item.trim().slice(0, 2).toUpperCase()).join(', ');
                        arr = [...arr, { value, valid: true }];
                        break;
                    case 'expiration date':
                        if ((curentValue.match(/^\d{2}([-])\d{2}\1\d{4}$/) || curentValue.match(/^\d{4}([-])\d{2}\1\d{2}$/)) && new Date(curentValue) > new Date()) {
                            arr = [...arr, { value: item[key].trim(), valid: true }]
                        } else {
                            arr = [...arr, { value: item[key].trim(), valid: false }]
                        }
                        break;
                    case 'license number':
                        if (curentValue.length > 6) {
                            arr = [...arr, { value: item[key].trim(), valid: false }]
                        } else {
                            arr = [...arr, { value: item[key].trim(), valid: true }]
                        }
                        break;
                    default:
                        setErrorMessage(`Title ${key} is not corect`);
                        setShowError(true);

                }
            }
            return arr;
        });

        setData(dataArr)
    }

    readStaticFile = async () => {
        const response = await fetch('users.csv');

        return await response.text();
    }
}