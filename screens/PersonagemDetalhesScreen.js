import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const PersonagemDetalhesScreen = ({ route }) => {
  const { personagemId } = route.params;
  const [personagem, setPersonagem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const response = await axios.get(
          `https://api.jikan.moe/v4/characters/${personagemId}`
        );
        setPersonagem(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do personagem:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarDetalhes();
  }, [personagemId]);

  if (loading || !personagem) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Carregando personagem...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: personagem.images.jpg.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <Card.Content style={styles.content}>
            <Title style={styles.name}>{personagem.name}</Title>
            {personagem.name_kanji ? (
              <Text style={styles.kanji}>({personagem.name_kanji})</Text>
            ) : null}

            {personagem.nicknames.length > 0 && (
              <>
                <Paragraph style={styles.sectionTitle}>Apelidos</Paragraph>
                <Paragraph style={styles.info}>
                  {personagem.nicknames.join(', ')}
                </Paragraph>
              </>
            )}

            <Paragraph style={styles.sectionTitle}>Descrição</Paragraph>
            <Paragraph style={styles.about}>
              {personagem.about?.replace(/\n{2,}/g, '\n\n') ||
                'Sem descrição disponível.'}
            </Paragraph>
          </Card.Content>
        </Card>
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
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#1c1c1e',
    elevation: 4,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 22,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#7C3AED',
    backgroundColor: '#333',
  },
  content: {
    paddingHorizontal: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  kanji: {
    fontSize: 18,
    textAlign: 'center',
    color: '#9CA3AF',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 4,
  },
  info: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 26,
  },
  about: {
    fontSize: 16,
    color: '#E5E7EB',
    lineHeight: 26,
    textAlign: 'justify',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 12,
    color: '#9CA3AF',
    fontSize: 16,
  },
});

export default PersonagemDetalhesScreen;
