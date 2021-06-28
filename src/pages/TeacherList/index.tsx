import React, { useState, FormEvent, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from  '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import api from '../../services/api';
import styles from './style';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
    const [filterVisibility, setFilterVisibility] = useState(true);

    function toggleFilterVisibility() {
        setFilterVisibility(!filterVisibility);
    }

    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    const [favorites, setFavorites] = useState<number[]>([]);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                });
                setFavorites(favoritedTeachersIds);
            }
        });
    }
    
    async function handleFilterSubmition() {
        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        })
        setTeachers(response.data);
        toggleFilterVisibility();
        loadFavorites();
    }

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    );

    return(
        <View style={styles.container} >
            <PageHeader
                title="Proffys disponíveis"
                headerFilter={(
                <BorderlessButton onPress={toggleFilterVisibility}>
                    <Feather name="filter" size={20} color="#FFF"/>
                </BorderlessButton>
                )}
            >
                {filterVisibility && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label} >Matéria</Text>
                        <TextInput 
                            style={styles.input}
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholder="Qual a matéria?"
                            placeholderTextColor="#C1BCCC"
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock} >
                                <Text style={styles.label} >Dia da semana</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                    placeholder="Qual o dia?"
                                    placeholderTextColor="#C1BCCC"
                                />
                            </View>

                            <View style={styles.inputBlock} >
                                <Text style={styles.label} >Horário</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholder="Qual o horário?"
                                    placeholderTextColor="#C1BCCC"
                                />
                            </View>
                        </View>
                        <RectButton
                            style={styles.submitButton}
                            onPress={handleFilterSubmition}
                        >
                            <Text style={styles.submitButtonText} >Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;