export const strings = {
  appName: "МУЗ-КВИЗ",
  version: "v0.1",
  live: "В эфире",
  homeTitleA: "Угадай",
  homeTitleB: "трек",
  homeTitleC: "за 10 сек.",
  homeSubtitle: "Викторина для вечеринок. Создай комнату, кинь код друзьям и слушай первые ноты.",
  nickname: "Имя",
  roomCode: "Код комнаты",
  createRoom: "Создать комнату",
  joinRoom: "Войти по коду",
  startGame: "Начать игру",
  nextRound: "Следующий раунд",
  backHome: "На главную",
  lobby: "Лобби",
  players: "Игроки",
  settings: "Настройки",
  connection: {
    connecting: "Подключаемся",
    connected: "Онлайн",
    disconnected: "Нет соединения",
    reconnecting: "Переподключение"
  },
  errors: {
    nicknameRequired: "Введите имя",
    codeRequired: "Введите код комнаты",
    roomNotFound: "Комната не найдена",
    gameAlreadyStarted: "Игра уже началась",
    generic: "Что-то пошло не так"
  },
  questionMode: {
    guess_song: "Угадать песню",
    guess_artist: "Угадать исполнителя",
    mixed: "Смешанный режим"
  },
  questionType: {
    guess_song: "Что это за песня?",
    guess_artist: "Кто исполнитель?"
  },
  provider: {
    spotify: "Spotify",
    deezer: "Deezer",
    lastfm: "Last.fm"
  },
  providerWarning: {
    lastfm: "Last.fm даёт богатый каталог, но превью подбираются дольше"
  },
  providerError: {
    lastfm_api_key: "Last.fm не настроен на сервере"
  },
  sourceType: {
    random: "Случайно",
    spotify_playlist: "Spotify плейлист",
    artist: "Артист",
    genre: "Жанр",
    deezer_playlist: "Deezer плейлист",
    deezer_chart: "Deezer чарт",
    lastfm_tag: "Тег",
    lastfm_geo: "Страна",
    lastfm_chart: "Чарт"
  },
  sourceValue: {
    spotify_playlist: "URL или ID Spotify плейлиста",
    artist: "URL или ID артиста",
    genre: "Жанр",
    random: "",
    deezer_playlist: "URL или ID Deezer плейлиста",
    deezer_chart: "ID жанра Deezer (опционально, 0 = global)",
    lastfm_tag: "Тег (rock, russian, pop)",
    lastfm_geo: "Страна на английском (russia, united states)",
    lastfm_chart: ""
  },
  sourcePlaceholder: {
    spotify_playlist: "https://open.spotify.com/playlist/...",
    artist: "Spotify/Deezer artist URL или ID",
    genre: "",
    random: "",
    deezer_playlist: "https://www.deezer.com/playlist/123 или 123",
    deezer_chart: "0",
    lastfm_tag: "russian, rock",
    lastfm_geo: "russia",
    lastfm_chart: ""
  },
  filters: {
    preset: "Пресет",
    language: "Язык",
    decades: "Десятилетия",
    genres: "Жанры",
    moods: "Настроение",
    region: "Регион",
    popularity: "Популярность",
    difficulty: "Сложность",
    explicitness: "Контент"
  },
  round: "Раунд",
  answerSubmitted: "Ответ принят",
  waitingHost: "Ждём старта от хоста",
  waitingNext: "Следующий раунд скоро начнётся",
  correctAnswer: "Правильный ответ",
  yourScore: "Твои очки",
  leaderboard: "Таблица лидеров",
  winner: "Победитель",
  final: "Финал",
  hostOnly: "Только хост может менять настройки и запускать игру",
  noSession: "Введите имя, чтобы подключиться к комнате"
} as const;

export const labelFallback = (value: string) => value.replaceAll("_", " ");
