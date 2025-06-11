<h1 align="center">📱 AnimeApp</h1>

<p align="center">
  <strong>O melhor app de animes do mundo!</strong><br/>
  Explore animes populares, descubra novos favoritos e mantenha sua lista atualizada.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react--native-2025-blue?logo=react" alt="React Native Badge" />
  <img src="https://img.shields.io/badge/api-Jikan-green" alt="Jikan API Badge" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="License Badge" />
</p>

---

## ✨ Funcionalidades

- 🔍 **Busca inteligente** com sugestões automáticas
- 🎞️ **Carrossel** com os destaques mensais
- 📅 **Lista de animes em destaque da semana**
- ❤️ **Favoritar animes** com persistência local (AsyncStorage)
- 🔄 **Atualização automática** da tela de favoritos
- ❌ **Limpar busca** com apenas um toque
- 📱 **Interface mobile-first**, leve e fluida

---

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Axios](https://axios-http.com/)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage)
- [Jikan API](https://jikan.moe/)
- [react-native-reanimated-carousel](https://github.com/dohooo/react-native-reanimated-carousel)
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/i-eloyse/anime-list-app.git
cd anime-list-app
2. Instale as dependências
bash
Copiar
Editar
npm install
# ou
yarn install
3. Instale os pods (apenas iOS)
bash
Copiar
Editar
npx pod-install
4. Execute o app
bash
Copiar
Editar
npx expo start

📂 Estrutura de Pastas
bash
Copiar
Editar
/screens
  ├── HomeScreen.js
  ├── FavoritesScreen.js
  ├── DetailsScreen.js
  └── PersonagemDetalhesScreen.js

/components
/assets
/utils

App.js
app.json
🔑 API
Este app utiliza a Jikan API, uma interface pública para dados do MyAnimeList.

📖 Saiba mais: https://docs.api.jikan.moe

✅ Futuras Melhorias
 Suporte a modo escuro/claro

 Filtros por temporada e gênero

 Melhorar paginação e scroll infinito

 Notificações push sobre novos episódios

 Tradução de nomes e descrições para PT-BR

🧑‍💻 Contribuindo
Contribuições são super bem-vindas! Para colaborar:

Faça um fork deste repositório

Crie uma nova branch:

bash
Copiar
Editar
git checkout -b feature/minha-feature
Commit suas alterações:

bash
Copiar
Editar
git commit -am 'feat: adiciona nova feature'
Push para o repositório:

bash
Copiar
Editar
git push origin feature/minha-feature
Abra um Pull Request no GitHub 🚀

📃 Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.

🙋‍♀️ Autora
Desenvolvido com 💜 por @i-eloyse
Confira meu trabalho: anime-list-app
