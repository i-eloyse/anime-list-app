import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import axios from 'axios';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topWeek, setTopWeek] = useState([]);
  const [topMonth, setTopMonth] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchTopAnimes();
    loadFavorites();
  }, []);

  const fetchTopAnimes = async () => {
    try {
      const weekRes = await axios.get('https://api.jikan.moe/v4/top/anime?filter=airing&limit=10');
      setTopWeek(weekRes.data.data);
      const monthRes = await axios.get('https://api.jikan.moe/v4/top/anime?limit=10');
      setTopMonth(monthRes.data.data.slice(0, 5));
    } catch (err) {
      console.error('Erro ao carregar animes:', err);
    }
  };

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      setFavorites(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    }
  };

  const toggleFavorite = async (anime) => {
    try {
      const isFav = favorites.some((fav) => fav.mal_id === anime.mal_id);
      const updated = isFav
        ? favorites.filter((fav) => fav.mal_id !== anime.mal_id)
        : [...favorites, anime];

      setFavorites(updated);
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao salvar favorito:', err);
    }
  };

  const isFavorite = (animeId) => favorites.some((fav) => fav.mal_id === animeId);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) return setSearchResults([]);
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`);
        setSearchResults(res.data.data);
      } catch (err) {
        console.error('Erro ao buscar sugestões:', err);
      }
    };

    const delayDebounceFn = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const renderAnimeCard = (anime) => (
    <Card
      key={`anime-${anime.mal_id}`}
      style={styles.fullCard}
      onPress={() => navigation.navigate('Details', { mal_id: anime.mal_id })}
    >
      <View style={styles.cardContainer}>
        <Image source={{ uri: anime.images.jpg.image_url }} style={styles.poster} />
        <View style={styles.details}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {anime.status === 'Currently Airing' ? 'Airing' : 'Finished Airing'}
            </Text>
          </View>
          <Text style={styles.episodes}>{anime.episodes ?? 'N/A'} episodes</Text>
          <Text style={styles.animeTitle} numberOfLines={2}>
            {anime.title}
          </Text>
          <View style={styles.stats}>
            <Text style={styles.score}>⭐ {anime.score ?? 'N/A'}</Text>
            <Text style={styles.rank}>#{anime.rank ?? '--'} Ranking</Text>
          </View>
          <View style={styles.tags}>
            {anime.genres?.slice(0, 2).map((genre) => (
              <Text key={genre.mal_id} style={styles.tag}>
                {genre.name}
              </Text>
            ))}
            {anime.genres?.length > 2 && (
              <Text style={styles.tag}>+{anime.genres.length - 2}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(anime)}
          style={styles.favoriteButton}
        >
          <Icon
            name={isFavorite(anime.mal_id) ? 'heart' : 'heart-outline'}
            size={24}
            color="#a855f7"
          />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar anime..."
          placeholderTextColor="#ccc"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <Icon name="close" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      {!query && (
        <View style={styles.carouselContainer}>
          <Carousel
            width={width * 0.9}
            height={200}
            autoPlay
            data={topMonth}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => setCarouselIndex(index)}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Details', { mal_id: item.mal_id })}
              >
                <Card style={styles.carouselCard}>
                  <Image
                    source={{ uri: item.images.jpg.large_image_url || item.images.jpg.image_url }}
                    style={styles.carouselImage}
                    resizeMode="cover"
                  />
                  <View style={styles.carouselOverlay}>
                    <Text style={styles.carouselTitle} numberOfLines={2}>{item.title}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            )}
          />
          <View style={styles.dotsContainer}>
            {topMonth.map((_, idx) => (
              <View
                key={`dot-${idx}`}
                style={[styles.dot, idx === carouselIndex && styles.activeDot]}
              />
            ))}
          </View>
        </View>
      )}

      {!query && <Text style={styles.sectionTitle}>Top da Semana</Text>}

      <FlatList
        data={query ? searchResults : topWeek}
        keyExtractor={(item, index) => `${query ? 'search' : 'top'}-${item.mal_id}-${index}`}
        renderItem={({ item }) => renderAnimeCard(item)}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5f5f5',
    marginBottom: 12,
  },
  carouselContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  carouselCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1f1f1f',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  carouselImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
  },
  carouselTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  fullCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    padding: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  poster: {
    width: 110,
    height: 160,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: '#2f3542',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  badgeText: {
    color: '#a4b0be',
    fontSize: 12,
  },
  episodes: {
    color: '#dcdde1',
    fontSize: 13,
    marginBottom: 4,
  },
  animeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  score: {
    color: '#f1c40f',
    fontSize: 14,
  },
  rank: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#2f3542',
    color: '#f1f2f6',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  favoriteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;
