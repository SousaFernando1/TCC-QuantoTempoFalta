import React, {useState, useEffect, useRef} from 'react';
import { vw, vh } from 'react-native-expo-viewport-units';
import { StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Local from '@react-native-community/geolocation'




export default function Map( props ){
    const markerRef = useRef(null)
    const GOOGLE_MAPS_APIKEY = 'AIzaSyAgJYCESl72KvjaLR6cFzQVssP357Is5-M';
    const [InitialLatitude, setLatitude] = useState(0);
    const [InitialLongitude, setLongitude] = useState(0);
    const [duracao, setDuracao] = useState(1)
    const [modal, setModal] = useState(false)
    const [rota, setRota] = useState(false);
    const [handleInit, setHandleInit] = useState(false);
    const [parada, setParada] = useState({
        body: {
            paradas:[]
        }
    });
    const [transporte, setTransporte] = useState({
        body: {
            transporte: []
        }
    });

    const [originTransporte, setOriginTransporte] = useState({
        body: {
            transporte: []
        }
    });


useEffect(()=> {
    async function resMarkers(){
        setParada(await props.route.params.parada)
        setRota(await props.route.params.rota)
    }

    resMarkers();
}, [])

    
if (markerRef && markerRef.current && markerRef.current.showCallout) {
    markerRef.current.showCallout();
    

}

useEffect(() => {
    const interval = setInterval(() => {
        async function sendServer(){
            let transporteResponse = await fetch('http://10.0.2.2:3031/transportePerto?rota='+rota+'&longitude='+props.route.params.parada.body.paradas[0].longitude+'&latitude='+props.route.params.parada.body.paradas[0].latitude, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            setTransporte(await transporteResponse.json())

        }
 
        
        if(rota != false && props.route.params.parada.body.paradas[0].latitude != undefined && props.route.params.parada.body.paradas[0].longitude != undefined){
            sendServer();
        }    

    }, 2000);
    return () => clearInterval(interval);
  }, [rota, InitialLatitude, InitialLongitude]);

  useEffect(() => {
    transporte.body.transporte.map(({latitude, longitude}) => {
        if(markerRef.current){
            var newCoordinate = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
            };
            markerRef.current.animateMarkerToCoordinate(newCoordinate,1000);//  number of duration between points
          }
          if(duracao < 0.5){
            setModal(true)
          }
          
    })

  }, [transporte])

  useEffect(()=> {
    transporte.body.transporte.map(()=>{
        if(!handleInit) {
            setOriginTransporte(transporte)
            setHandleInit(true)
        }
    })
}, [transporte])
  


  function teste() {
    console.log("ASDAS")
  }

    return(
        
        <View style={css.container}>
        <Modal
         animationType="fade"
         transparent={true}
         visible={modal}
         style={{opacity: 0.5}}
        >
          <View style={css.containerModal}>
            <View style={css.contentModal}>
              <View style={css.headerModal}>
                <Text style={css.modalTitulo}>Seu transporte chegou!</Text>
              </View>
              <View style={css.hrModal}/>
              <View style={css.footerModal}>
                <TouchableOpacity
                  style={css.closeModal}
                  onPress={() => props.navigation.navigate('Search')}
                >
                    <Text>Voltar para o menu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </Modal>
            <MapView 
            style={css.mapStyle}
            initialRegion={{
                latitude: -28.448922,
                longitude: -48.806404,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            >
                {parada.body.paradas.map(({latitude, longitude}) => {
                    return <Marker
                    style={css.marker}
                    key={latitude+longitude}
                    coordinate={{ latitude : parseFloat(latitude), longitude : parseFloat(longitude) }}
                    image= {require('../assets/img/paradaMarker.png')}
                    >                       
                    </Marker>  
                })}

                {originTransporte.body.transporte.map(({latitude, longitude}) => {
                    return  <Marker.Animated
                    style={css.marker}
                        key={latitude+longitude}
                        coordinate={{ latitude : parseFloat(latitude) , longitude : parseFloat(longitude) }}
                        image= {require('../assets/img/busMarker.png')}
                        ref={markerRef}                        >              
                             <Callout tooltip
                            >
                                <View >
                                    <View style={css.bubble}>
                                        <Text style={css.name}> Tempo restante até</Text>
                                        <Text style={css.name}> o ponto mais próximo</Text>
                                        <Text style={css.name}> de você <Text style={css.duracao}>{parseInt(duracao)}</Text> min</Text>
                                    </View>
                                    <View style={css.arrowBorder}/>
                                    <View style={css.arrow}/>
                                </View> 
                            </Callout>
                        </Marker.Animated>  
                })}


                {transporte.body.transporte.map(({latitude, longitude}) => {
                    return  <MapViewDirections
                    key={latitude+longitude}
                    origin={{latitude: parseFloat(latitude), longitude: parseFloat(longitude)}}
                    destination={{latitude: parseFloat(parada.body.paradas[0].latitude), longitude: parseFloat(parada.body.paradas[0].longitude)}}
                    apikey={GOOGLE_MAPS_APIKEY}
                    onReady= { result => {
                        setDuracao(result.duration)
                    }}
                    strokeWidth={0}
                />
                })}

            </MapView>
        </View>
    )
}

const css = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: '#2AC28B',
        width: vw(100),
    },
    titlePage:{
        marginLeft: vw(4),
        fontFamily: 'Roboto-Medium',
        fontWeight: 'bold',
        fontSize: vh(4),
        color: '#FFF',
    },
    bubble: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FFCE21',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 1.5,
        width: 150,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#FFCE21',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#FFCE21',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5
    },
    image: {
        width: 30,
        height: 30
    },
    description: {
        marginLeft: vw(4),
        fontFamily: 'Roboto-Medium',
        fontStyle: 'italic',
        fontSize: vh(2.5),
        color: '#FFF',
    },
    mapStyle: {
        width: vw(100),
        height: vh(50),
        flex: 1,
    },
    name: {
        fontSize: 14,
        marginBottom: 2,
        color: '#000000'
    },
    duracao: {
        fontSize: 16,
        marginBottom: 2,
        color: '#000000',
        fontFamily: 'Roboto-MediumItalic',
        textDecorationLine: 'underline'

    },
    click: {
        fontSize: 10,
        marginBottom: 2.5,
        color: '#fff'        
    },
    marker: {
        width: vw(10),
        height: vh(10)
    },
    containerModal: {
        height: vh(100),
        width: vw(100),
        backgroundColor: 'rgba(100,100,100, 0.7)',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },  
      contentModal: {   
        margin: vw(10),
        backgroundColor: "white",  
        borderRadius: 4,    
        padding: vw(5),
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {  
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalTitulo: {
        color: '#676767',
        fontWeight: 'bold',
        fontSize: vw(5),
        marginBottom: vh(2)
      },
      textoModal: {
        fontSize: vw(3.8), 
        color: '#676767',
        textAlign: 'center'
      },   
      bodyModal: {
        paddingHorizontal: vw(8),
        marginTop: vh(3),
        marginBottom: vh(3),
        alignItems: 'center'
      },
      hrModal: {
        borderColor: '#EBEBEB',
        borderWidth: 1,
        width: vw(65)
      },
      textoCloseModal: {
        color: '#61E8A7'
      },
      closeModal: {
        marginTop:vh(2),
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 25,
        backgroundColor: "#FFCE21",
        elevation: 10
      },
})
