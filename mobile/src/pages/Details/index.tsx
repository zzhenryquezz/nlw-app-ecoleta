import React, {useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MainComposer from 'expo-mail-composer';


import api from '../../services/api';
import styles from './styles';

interface Params {
  point_id: number;
}

interface Point {
  image: string;
  image_url: string;
  name: string
  email: string
  whatsapp: string
  city: string
  uf: string,
  items: {
    title: string;
  }[]
}

const Details = () => {
    const [data, setData] = useState<Point>({} as Point);
    const navigation = useNavigation();
    
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(() => {
      api.get(`/points/${routeParams.point_id}`)
        .then(response => setData(response.data));
    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleComposeMail() {
      MainComposer.composeAsync({
        subject: 'Interesse na coleta de residuos',
        recipients: [data.email]
      });
    }
    
    function handleWhatsapp() {
      Linking.openURL(`whatsapp://send?phone=${data.whatsapp}&text=interesse em coletas de residuos`);
    }

    if (!data.name) {
      return null;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name='arrow-left' size={20} color='#34cb79' />
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: data.image_url }} />
                
                <Text style={styles.pointName}>{data.name}</Text>
                <Text style={styles.pointItems}>
                  {data.items.map(item => item.title).join(', ')}
                </Text>
                
                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>
                      {data.city}, {data.uf}
                    </Text>
                </View>
            </View>
            
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name='whatsapp' size={20} color='#fff' />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name='mail' size={20} color='#fff' />
                    <Text style={styles.buttonText}>Email</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}

export default Details;