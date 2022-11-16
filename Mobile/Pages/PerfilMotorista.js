import React, { useState, useEffect } from 'react';
import { vw, vh } from 'react-native-expo-viewport-units';
import {  Text, View, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import SelectList from 'react-native-dropdown-select-list'
import Local from '@react-native-community/geolocation'


export default function PerfilMotorista(props)
{

    const [InitialLatitude, setLatitude] = useState(0);
    const [InitialLongitude, setLongitude] = useState(0);
    const [selecionou, setSelecionou] = useState(false);
    const [botao, setBotao] = useState(true)
    const [rota, setRota] = useState(0);
    const [idMotorista, setIdMotorista] = useState(props.route.params.id);
    const [rotas=[], setRotas] = useState({
        body: {
            rotas:[]
        }
    })
       

useEffect(() => {
    const interval = setInterval(() => {
        Local.getCurrentPosition((pos)=>{
            setLatitude(pos.coords.latitude.toFixed(6))
            setLongitude(pos.coords.longitude.toFixed(6))
            
            console.log(pos.coords.latitude.toFixed(6), pos.coords.longitude.toFixed(6))
            
            async function sendGeolocation() {
                let response = await fetch('http://10.0.2.2:3031/atualizaMotorista', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: idMotorista,
                        latitude: pos.coords.latitude.toFixed(6),
                        longitude: pos.coords.longitude.toFixed(6)
                      })
                })    
            }

            if(selecionou && rota != 0 && pos.coords.latitude != 0 && pos.coords.longitude != 0){
                sendGeolocation();
                console.log("chama SendGeolocation")
            }    
        }, 
        (erro) => {
            alert('Erro: ' + erro.message)
        }
        , {
            enableHighAccuracy: true, timeout: 10000
        });
 
      

    }, 2000);
    return () => clearInterval(interval);
  }, [rota, Local, selecionou]);

      useEffect(()=> {
        async function sendServer(){
            let response = await fetch('http://10.0.2.2:3031/rotas', {
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

    // useEffect(()=>{
        
        // Local.getCurrentPosition((pos)=>{
        //     setLatitude(pos.coords.latitude.toFixed(6))
        //     setLongitude(pos.coords.longitude.toFixed(6))
        // }, 
        // (erro) => {
        //     alert('Erro: ' + erro.message)
        // }
        // , {
        //     enableHighAccuracy: true, timeout: 10000
        // });
    // });

    console.log(InitialLatitude, InitialLongitude)




    let buttonEnable;

    if(rota != 0){
        buttonEnable = true
    } else {
        buttonEnable = false
    }
    
    
    
        return(
        <View style={css.content}>
                <View style={css.textsBox}>
                    <View style={css.headerBox}>
                        <Text style={css.textPage}>Selecione a rota que </Text>
                        <Text style={css.textPage}>você irá fazer </Text>
                    </View>
                </View>
                <View style= {css.pickerBox}>
                    <Picker 
                        selectedValue={rota}
                        onValueChange={(itemValue, itemIndex) =>
                            setRota(itemValue)
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
                
                {
                (!selecionou)
                    ?
                <TouchableOpacity disabled={(!buttonEnable) ? true : false} onPress={() => setSelecionou(true)} style={(!buttonEnable) ? css.buttonDisabled : css.button}>
                    <Text style={css.textButton}>{(!buttonEnable) ? "Escolha acima      ": "Entrar"} </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => setSelecionou(false)} style={css.buttonDisabled}>
                    <Text style={css.textButton}>Rota em atividade </Text>
                </TouchableOpacity>
    
                }
    

                
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
    