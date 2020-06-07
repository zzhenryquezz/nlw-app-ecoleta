import React, { useState, useEffect } from  'react';
import {
    View,
    ImageBackground,
    Image,
    StyleSheet,
    Text
} from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import RNPickerSelect, { Item } from 'react-native-picker-select';
import axios from 'axios';

import styles from './styles';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
    const navigation = useNavigation();
    
    const [ufs, setUfs] = useState<Item[]>([]);
    const [cities, setCities] = useState<Item[]>([]);

    const [selectedUf, setSelectedUf] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');

    useEffect(() => {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
          .then(response => {
              const ufInitials = response.data.map(uf => ({
                key: uf.sigla,
                label: uf.sigla,
                value: uf.sigla
              }));
              setUfs(ufInitials);
      })
  }, []);
  
  useEffect(() => {
    if (selectedUf === '') {
        return;
      }
      axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
          .then(response => {
              const citiesNames = response.data.map(city => ({
                key: city.nome,
                label: city.nome,
                value: city.nome
              }));
              setCities(citiesNames);
      })
  }, [selectedUf]);

    function handleNavigationToPoints(){
      navigation.navigate('Points', {
        uf: selectedUf,
        city: selectedCity,
      });
    }
    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marktplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
            </View>

            <View style={styles.footer}>
              <RNPickerSelect
                  useNativeAndroidPickerStyle={false}
                  value={selectedUf}
                  onValueChange={value => setSelectedUf(value)}
                  style={{ inputAndroid: styles.input }}
                  items={ufs}
                  textInputProps={{
                    placeholder: 'Selecione a UF'
                  }}
              />
              <RNPickerSelect
                  useNativeAndroidPickerStyle={false}
                  onValueChange={value => setSelectedCity(value)}
                  style={{ inputAndroid: styles.input }}
                  items={cities}
                  textInputProps={{
                    placeholder: 'Selecione a Cidade'
                  }}
              />
                <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                    <View style={styles.buttonIcon}>
                        <Icon name='arrow-right' color='#fff' size={24} />
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};


export default Home;