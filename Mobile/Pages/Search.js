import React, { useState, useEffect } from 'react';
import { vw, vh } from 'react-native-expo-viewport-units';
import {  Text, View, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import SelectList from 'react-native-dropdown-select-list'
import Local from '@react-native-community/geolocation'


export default function Search(props)
{

    const [InitialLatitude, setLatitude] = useState(0);
    const [InitialLongitude, setLongitude] = useState(0);

    useEffect(() => {
            
        if(parada)
    {
            goToMap();
    }
    
    })

    useEffect(()=>{
        
        Local.getCurrentPosition((pos)=>{
            setLatitude(pos.coords.latitude.toFixed(6))
            setLongitude(pos.coords.longitude.toFixed(6))
        }, 
        (erro) => {
            alert('Erro: ' + erro.message)
        }
        , {
            enableHighAccuracy: true, timeout: 10000
        });
    });

    useEffect(()=> {
        async function sendServer(){
            let response = await fetch('http://192.168.0.105:3031/rotas', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            setRotas(await response.json())
        }
    
       
        
        sendServer();
    }, [])

    console.log(InitialLatitude, InitialLongitude)

    const [rotas=[], setRotas] = useState({
        body: {
            rotas:[]
        }
    })
    const [parada, setParada] = useState(false)
    const [busca, setBusca] = useState(0);
    
    function goToMap() {
        props.navigation.navigate('Map', {
            rota: busca,
            parada: parada
        
        })
    }
       
    async function sendForm(){


        let paradasResponse = await fetch('http://192.168.0.105:3031/paradaPerto?rota='+busca+'&longitude='+InitialLongitude+'&latitude='+InitialLatitude, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    })
    
    setParada(await paradasResponse.json())

    
    }


    let buttonEnable;

    if(busca != 0){
        buttonEnable = true
    } else {
        buttonEnable = false
    }
    
    
    
        return(
        <View style={css.content}>
                <View style={css.textsBox}>
                    <View style={css.headerBox}>
                        <Text style={css.textPage}>Escolha uma rota de transporte</Text>
                        <Text style={css.textPage}>e descubra </Text>
                        <Text style={css.titlePage}>QuantoTempoFalta? </Text>
                    </View>
                    <View >
                        <Text style={css.textPage}>Para ele chegar até o ponto</Text>        
                        <Text style={css.textPage}>de ônibus</Text>        
                    </View>
                </View>
    
                <View style= {css.pickerBox}>
                    <Picker 
                        selectedValue={busca}
                        onValueChange={(itemValue, itemIndex) =>
                            setBusca(itemValue)
                        }                    
                        
                        >
                        <Picker.Item label="Escolha a rota desejada" value="0"  />
                        {rotas.body.rotas.map(({rota, codigo})=> 
                            {
                                return <Picker.Item value={codigo} label={rota} key={codigo} />
                            })
                            }
                    </Picker>
    
                </View>
                
    
                <TouchableOpacity disabled={(!buttonEnable) ? true : false} onPress={() => sendForm()} style={(!buttonEnable) ? css.buttonDisabled : css.button}>
                <Image
                    style={(!buttonEnable) ? css.buttonExtensionDisabled : css.buttonExtension}
                    source={require('../assets/img/buttonExtension.png')}
                />
                    <Text style={css.textButton}>{(!buttonEnable) ? "Escolha acima      ": "Entrar"} </Text>
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
        pickerBox: {
            alignSelf: "center",
            width: vw(80),
            marginTop: vh(1),
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            borderColor:"black",
            borderWidth:1,
        },
    
        pickerItem: {
            borderColor: "#E5E5E5",
            borderWidth: 10,      
            borderRadius: 4 
        },
    
        button: {
            position: 'relative',
            backgroundColor: '#2AC28B',
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
    
        buttonExtension: {
            position: 'absolute',
            width: vw(12),
            height: vh(10),
            left: 0,
        },
            buttonExtensionDisabled: {
            display:'none',
        },
        textButton: {
            fontFamily: 'Roboto-Medium',
            color: '#FFFFFF',
        }
    
    })
    