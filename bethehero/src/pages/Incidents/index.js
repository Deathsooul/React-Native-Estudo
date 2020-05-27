import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';
import styles from './styles';

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setloading] = useState(false);

    const navigation = useNavigation();


    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident });
    }

    async function loadincidents() {
        if (loading) {
            return;
        }
        if (total > 0 && incidents.length === total) {
            return;
        }
        setloading(true);

        const response = await api.get('incidents', {
            params: { page }
        });


        setIncidents([...incidents, response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setloading(false);
    }


    useEffect(() => {
        loadincidents();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
                </Text>
            </View>


            <Text style={styles.title}> Bem vindo !</Text>
            <Text style={styles.description}> Escolha um dos casos abaixo e salve uma vida</Text>

            <FlatList
                style={styles.incidents}
                data={incidents}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadincidents}
                onEndReachedThreshold={0.2}
                renderItem={({ item: incident }) => (
                    <View style={styles.incident}>
                        <Text style={styles.incidentPropoerty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentPropoerty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentPropoerty}>VALOR:</Text>
                        <Text style={styles.incidentValue}>{
                            Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(incident.value)}</Text>

                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => navigateToDetail(incident)}>
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#E02041" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}


