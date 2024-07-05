import React, {useEffect, useState} from 'react';
import {Alert, Button, Checkbox, Flex, Input, Popover, Select, Slider} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRepeat} from '@fortawesome/free-solid-svg-icons';
import './passGenerator.css';

const PassGenerator = () => {
    const plainOptions = ['符号', '数字'];
    const defaultCheckedList = ['符号', '数字'];
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [passNumber, setPassNumber] = useState(16);
    const [generatedPasswd, setGeneratedPasswd] = useState('');
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [noAPI, setNoAPI] = useState(false)
    const {TextArea} = Input;
    const CheckboxGroup = Checkbox.Group;
    const [passwordMode, setPasswordMode] = useState('random-password');


    useEffect(() => {
        // 在组件加载时生成随机密码
        generatePassword();
    }, []);

    useEffect(() => {
        console.log('now selected:', checkedList);
        console.log('now PassNumber:', passNumber);
    }, [checkedList, passNumber]);

    // 生成随机密码的函数
    const generatePassword = () => {
        const symbols = "!@#$%^&*()_+{}|[]\\:;\"'<>,.?/~";
        const numbers = '0123456789';
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        if (checkedList.includes('符号')) {
            chars += symbols;
        }
        if (checkedList.includes('数字')) {
            chars += numbers;
        }

        let password = '';
        const availableChars = chars.length;
        for (let i = 0; i < passNumber; i++) {
            const randomIndex = Math.floor(Math.random() * availableChars);
            password += chars.charAt(randomIndex);
        }

        setGeneratedPasswd(password);
    };

    //生成PIN密码
    const generatePin = () => {
        let pin = '';
        for (let i = 0; i < passNumber; i++) {
            pin += Math.floor(Math.random() * 10); // 生成 0 到 9 之间的随机数字
        }
        setGeneratedPasswd(pin);
    };

    const NumonChange = (list) => {
        setCheckedList(list);
        // 在复选框变化时重新生成密码
        generatePassword();
    };


    useEffect(() => {
        if (passwordMode === 'random-password') {
            generatePassword();
        } else {
            generatePin();
        }
    }, [passNumber, checkedList, passwordMode]);

    // const handlePassNumberChange = (value) => {
    //     setPassNumber(value);
    //     // 在密码长度变化时重新生成密码
    //     // generatePassword();
    // };
    // useEffect(() => {
    //     generatePassword();
    // }, [passNumber, checkedList]);



    // const handlePassNumberChange = (value, isPin) => {
    //     setPassNumber(value);
    //     if (!isPin) {
    //         generatePassword();
    //     } else {
    //         generatePin();
    //     }
    // };
    //
    // const selectType = (value) => {
    //     if (value === 'random-password') {
    //         handlePassNumberChange(passNumber, false);
    //     } else if (value === 'PIN') {
    //         handlePassNumberChange(passNumber, true);
    //     }
    // };
    const handlePassNumberChange = (value) => {
        setPassNumber(value);
        if (passwordMode === 'random-password') {
            generatePassword();
        } else {
            generatePin();
        }
    };

    const selectType = (value) => {
        setPasswordMode(value);
        if (value === 'random-password') {
            generatePassword();
        } else {
            generatePin();
        }
    };




    const numberPass = () => {
        return (
            <div className='popover'>
                <label>长度：</label>
                {/*<Slider defaultValue={16} min={8} max={50} tooltip={{open: true}} onChange={handlePassNumberChange}/>*/}
                <Slider defaultValue={16} min={8} max={50} tooltip={{open: true}} onChange={(value) => handlePassNumberChange(value, false)}/>
                <CheckboxGroup options={plainOptions} value={checkedList} onChange={NumonChange}/>
            </div>
        );
    };

    // const selectType = (value) => {
    //     if (value === 'random-password') {
    //         generatePassword();
    //     } else if (value === 'PIN') {
    //         generatePin();
    //     }
    // };




    const clickCopy = () => {
        // 检查浏览器是否支持 Clipboard API
        if (navigator.clipboard) {
            // 将生成的密码复制到剪贴板
            navigator.clipboard.writeText(generatedPasswd)
                .then(() => {
                    console.log('密码成功复制:', generatedPasswd);
                    setShowSuccess(true)
                    setTimeout(()=>setShowSuccess(false),2000)

                })
                .catch((error) => {
                    console.error('复制密码错误:', error);
                    setShowError(true)
                    setTimeout(()=>setShowError(false),2000)
                });
        } else {
            // 浏览器不支持 Clipboard API，可以提供备选方案
            console.warn('浏览器不支持复制API');
            setNoAPI(true)
            setTimeout(()=>setNoAPI(false),2000)
        }
    };

    return (
        <div className="pg-bg">
            <div className="alert-container">
                {showSuccess && (
                    <div className="alert-wrapper">
                        <Alert message="密码已复制到剪切板" type="success" className="alert"/>
                    </div>
                )}
                {showError && (
                    <div className="alert-wrapper">
                        <Alert message="密码复制失败,请手动复制" type="error"/>
                    </div>)}
                {noAPI && (
                    <div className="alert-wrapper">
                        <Alert message="浏览器不支持复制API,请手动复制" type="error"/>
                    </div>)}
            </div>
            <div className="password">
                <label>已经生成的密码：</label>
                <TextArea
                    maxLength={100}
                    rootClassName="PasswordBox"
                    // onChange={onChange}
                    value={generatedPasswd}
                    className="PasswordBox"
                    style={{
                        height: '5rem',
                        resize: 'none',
                    }}
                />
                {/*<Button type="text" className="PasswordBox" value={generatedPasswd}></Button>*/}
            </div>
            <div className="generator-box">
                <label>密码类型：</label>
                <Flex gap='middle' align='start' horizontal>
                    <Select
                        defaultValue="random-password"
                        style={{
                            width: '20rem',
                            height: '3rem',
                        }}
                        onChange={selectType}
                        options={[
                            {
                                value: 'random-password',
                                label: '随机密码',
                            },
                            {
                                value: 'PIN',
                                label: 'PIN',
                            }
                        ]}
                    />
                    <Popover placement="bottom" visible="false" content={numberPass}>
                        <Button style={{height: '3rem', width: '3rem', background: '#ffffff', border: 'transparent'}}
                                onClick={generatePassword}>
                            <FontAwesomeIcon icon={faRepeat}/>
                        </Button>
                    </Popover>
                    <Button type="primary" style={{width: '20rem', height: '3rem'}} onClick={clickCopy}>
                        复制安全密码
                    </Button>
                </Flex>
            </div>
        </div>
    );
};

export default PassGenerator;
