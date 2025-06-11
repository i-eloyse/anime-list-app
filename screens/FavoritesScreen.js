import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const FavoriteItem = ({ item, removeFavorite, navigateToDetails }) => {
  return (
    <Card style={styles.card} elevation={3}>
      <View style={styles.cardRow}>
        <Card.Cover
          source={{ uri: item.images.jpg.image_url }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <Card.Content style={styles.cardContent}>
          <Title numberOfLines={2} style={styles.title}>{item.title}</Title>
          <Paragraph style={styles.year}>{item.year || 'Ano desconhecido'}</Paragraph>
        </Card.Content>
      </View>
      <Card.Actions style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => removeFavorite(item.mal_id)}
          style={styles.button}
          labelStyle={{ color: '#7C3AED', fontWeight: 'bold' }}
          contentStyle={{ height: 40 }}
        >
          Remover
        </Button>
        <Button
          mode="contained"
          onPress={() => navigateToDetails(item.mal_id)}
          style={styles.button}
          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
          contentStyle={{ height: 40 }}
        >
          Ver Detalhes
        </Button>
      </Card.Actions>
    </Card>
  );
};

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadFavorites();
    }, [])
  );

  const removeFavorite = async (mal_id) => {
    try {
      const updatedFavorites = favorites.filter((anime) => anime.mal_id !== mal_id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      Alert.alert('Removido', 'Anime removido dos favoritos!');
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToDetails = (mal_id) => {
    navigation.navigate('Details', { mal_id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item.mal_id.toString() + '_' + index}
        renderItem={({ item }) => (
          <FavoriteItem
            item={item}
            removeFavorite={removeFavorite}
            navigateToDetails={navigateToDetails}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Paragraph style={styles.emptyText}>Nenhum anime favoritado ainda.</Paragraph>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  year: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
});

export default FavoritesScreen;
