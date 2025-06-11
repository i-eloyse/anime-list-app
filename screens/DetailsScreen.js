import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  Button,
  Text,
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CharacterItem = ({ character, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={styles.characterCard}>
      <Card.Title
        title={character.name}
        titleStyle={styles.characterName}
        left={() => (
          <Avatar.Image
            size={40}
            source={{ uri: character.images.jpg.image_url }}
          />
        )}
      />
    </Card>
  </TouchableOpacity>
);

const DetailsScreen = ({ route }) => {
  const { mal_id } = route.params;
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const animeResponse = await axios.get(
          `https://api.jikan.moe/v4/anime/${mal_id}`
        );
        setAnime(animeResponse.data.data);

        const charsResponse = await axios.get(
          `https://api.jikan.moe/v4/anime/${mal_id}/characters`
        );
        setCharacters(charsResponse.data.data);
        setFilteredCharacters(charsResponse.data.data);

        // Verifica se anime já está nos favoritos
        const existingFavorites = (await AsyncStorage.getItem('favorites')) || '[]';
        const favorites = JSON.parse(existingFavorites);
        const favorited = favorites.some((item) => item.mal_id === mal_id);
        setIsFavorited(favorited);

      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [mal_id]);

  useEffect(() => {
    if (!searchText) {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter(({ character }) =>
        character.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  }, [searchText, characters]);

  const toggleFavorite = async () => {
    try {
      const existingFavorites = (await AsyncStorage.getItem('favorites')) || '[]';
      let favorites = JSON.parse(existingFavorites);

      if (isFavorited) {
        // Remove dos favoritos
        favorites = favorites.filter((item) => item.mal_id !== anime.mal_id);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorited(false);
        alert('Anime removido dos favoritos.');
      } else {
        // Adiciona aos favoritos
        favorites.push(anime);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorited(true);
        alert('Anime adicionado aos favoritos!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !anime) {
    return <Paragraph style={{ padding: 20, color: '#999' }}>Carregando...</Paragraph>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <Card style={styles.animeCard}>

          <View style={styles.imageTitleContainer}>
            <Image
              source={{ uri: anime.images.jpg.image_url }}
              style={styles.animeImageSmall}
              resizeMode="cover"
            />
            <View style={styles.titleSynopsisContainer}>
              <Title style={styles.title}>{anime.title}</Title>
              <Paragraph style={styles.synopsis}>
                {anime.synopsis || 'Sem sinopse disponível.'}
              </Paragraph>
            </View>
          </View>

          <Card.Content style={styles.cardContent}>
            <Paragraph style={styles.paragraph}>
              Ano: {anime.year || 'Desconhecido'}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Gênero(s): {anime.genres.map((g) => g.name).join(', ')}
            </Paragraph>
          </Card.Content>

          <View style={styles.favoriteButtonWrapper}>
            <Button
              mode="contained"
              buttonColor="#7C3AED"
              textColor="#FFF"
              onPress={toggleFavorite}
              style={styles.favoriteButton}
              icon={() => (
                <MaterialCommunityIcons
                  name={isFavorited ? 'heart' : 'heart-outline'}
                  size={20}
                  color="#FFF"
                />
              )}
            >
              {isFavorited ? 'Favorito' : 'Favoritar'}
            </Button>
          </View>

        </Card>

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Personagens</Title>

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar personagens..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />

          <Card style={styles.charactersContainer}>
            {filteredCharacters.length === 0 ? (
              <Text style={styles.noResults}>Nenhum personagem encontrado.</Text>
            ) : (
              <ScrollView
                style={styles.scrollCharacters}
                nestedScrollEnabled={true}
              >
                {filteredCharacters.map(({ character }) => (
                  <CharacterItem
                    key={character.mal_id.toString()}
                    character={character}
                    onPress={() =>
                      navigation.navigate('PersonagemDetalhes', {
                        personagemId: character.mal_id,
                      })
                    }
                  />
                ))}
                <View style={{ height: 24 }} />
              </ScrollView>
            )}
          </Card>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  animeCard: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#1c1c1e',
  },
  imageTitleContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  animeImageSmall: {
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  titleSynopsisContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  synopsis: {
    color: '#ccc',
    lineHeight: 20,
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  paragraph: {
    marginBottom: 6,
    color: '#ddd',
    lineHeight: 20,
  },
  favoriteButtonWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    alignItems: 'center',
  },
  favoriteButton: {
    borderRadius: 30,
    width: 160,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  searchInput: {
    height: 44,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#222',
    marginBottom: 10,
    color: '#fff',
  },
  charactersContainer: {
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#1c1c1e',
    elevation: 3,
    paddingBottom: 10,
  },
  characterCard: {
    marginVertical: 6,
    marginHorizontal: 8,
    backgroundColor: '#2a2a2e',
    borderRadius: 10,
    elevation: 1,
  },
  characterName: {
    color: '#fff',
  },
  scrollCharacters: {
    maxHeight: 350,
    paddingHorizontal: 6,
  },
  noResults: {
    padding: 10,
    color: '#888',
    textAlign: 'center',
  },
});

export default DetailsScreen;
