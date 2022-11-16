import React, { useState, useEffect } from 'react';
import { vw, vh } from 'react-native-expo-viewport-units';
import {  Text, View, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import SelectList from 'react-native-dropdown-select-list'
import Local from '@react-native-community/geolocation'


export default function LoginMotorista(props)
{

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');   
    const [respostaLogin, setRespostaLogin] = useState({
        message: "",
        id: 0
    }) 
    
    useEffect(() => {
        if(respostaLogin != ""){
            if(respostaLogin.message == "Falha"){
                Alert.alert(
                    "Erro",
                    "Credenciais erradas",
                    [
                      { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                  );
            } else if (respostaLogin.message == "Login efetuado") {
                props.navigation.navigate('PerfilMotorista', {
                    id: respostaLogin.id
                })
            }

            console.log(respostaLogin.message)
        }
    }, [respostaLogin])

    async function sendServer(){
        let response = await fetch('http://10.0.2.2:3031/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                login: login,
                senha: senha
              })
        })

        setRespostaLogin(await response.json())


        // if(await response.json().message == "Login efetuado"){
        //     console.log("Logado")
        //     console.log(response.json().message)
        // } else {
        //     console.log("Erro")
        //     console.log(response.json().message)

        // }

                    // if(response.data.message === 'Falha!')
                    // {
                    //     alert('Este usuário não existe')
        
                    // } else {
                    //     console.log(response.data.body.users)    
                    //     let usernameNew = response.data.body.users;
                    //     sessionStorage.setItem('myData', JSON.stringify(usernameNew))
                    //      history.push('/perfil')
                    // }

    }
        return(
        <View style={css.content}>
                <View style={css.textsBox}>
                    <View style={css.headerBox}>
                        <Text style={css.textPage}>Faça seu login para selecionar sua rota! </Text>
                    </View>
                </View>
                <View style= {css.inputBox}>
                    <TextInput style={css.input} onChangeText={(value) => setLogin(value)} placeholder={"Digite seu login"}/>
                </View>
                <View style= {css.inputBox}>
                    <TextInput secureTextEntry={true} style={css.input} onChangeText={(value) => setSenha(value)} placeholder={"Digite sua senha"}/>
                </View>
    
                <TouchableOpacity  onPress={() => sendServer()} style={css.button}>
                    <Text style={css.textButton}>Entrar</Text>
                </TouchableOpacity>
            </View>
            
        );
    
    
    
    }
    
    
    
    const css = StyleSheet.create({
    
    
    
        recic: {
            width: 350,
            height: 350,
            position: 'absolute',
            left: vw(-40),
            top: vh(-10),
        },
    
        content: {
            width: vw(100),
            height: vh(100),
            flex: 1,
            justifyContent: 'space-between',
            position: 'relative',
            backgroundColor: "#FCFDC6"
    
        },
    
        headerBox: {
            marginTop: vh(23),
        },
        textsBox: {
            marginLeft: vw(10),
        },
        
        titlePage:{
            fontFamily: 'Roboto-BoldItalic',
            fontSize: vh(4),
            color: '#FFCE21',
        },
    
        textPage: {
            color: '#322153',
            fontSize: vh(3),
            fontFamily: 'Roboto-Medium',
        },
        inputBox: {
            alignSelf: "center",
            width: vw(80),
            marginTop: vh(2),
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            borderColor:"black",
            borderWidth:2,

        },
        input: {
            fontSize: vw(6)
        },
    
        button: {
            position: 'relative',
            backgroundColor: '#FFCE21',
            marginLeft: vw(10),
            width: vw(80),
            height: vh(7),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            color: '#FFFFFF',   
            flexDirection: 'row',
            marginBottom: vh(30),
            marginTop: vh(10)
        },
    
        buttonDisabled: {
            position: 'relative',
            backgroundColor: 'crimson',
            marginLeft: vw(10),
            width: vw(80),
            height: vh(7),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            color: '#FFFFFF',   
            flexDirection: 'row',
            marginBottom: vh(30),
        },
        textButton: {
            fontFamily: 'Roboto-Medium',
            color: '#FFFFFF',
        }
    
    })
    