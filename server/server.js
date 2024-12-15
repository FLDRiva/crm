const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const port = 5000;
const session = require("express-session");
const SECRET_KEY = 'eyJhbGciOiJI'

// Настройка CORS
const corsOptions = {
  origin: [
    'http://localhost:8081', 
    'http://192.168.21.69:8081', 
    'http://192.168.21.8:8080', 
    'http://localhost:5000',
    'http://localhost:8080',
  ], 
  methods: 'GET,POST,PUT,DELETE,OPTIONS', 
  allowedHeaders: 'Content-Type,Authorization', 
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

// Настройка сессий
app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: 
  {
    path: '/',
    secure: false, 
    httpOnly: true, 
    maxAge: 3600000 
  }
}));

// Аутентификация по сессии
const authenticate = (req, res, next) => {
  console.log('Сессия:', req.session);
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }
  req.userId = req.session.userId;
  next();
};

const pool = new Pool({
  user: "crmtest",
  host: "postgresql-svops12.db-msk0.amvera.tech",
  database: "crmtestbd",
  password: "Ilikelp23)",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  } 
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Маршрут для теста
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

//Регистрация пользователя
app.post('/reg', async (req, res) => {
  const { name, email, password, age, bio} = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Заполни все поля' });
  }
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Некорректный email, повторите попытку' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'Пароль должен быть не менее 4 символов' });
    }
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email уже зарегистрирован, войдите в систему' });
    }
    const hashedPassword = password;
    const userResult = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );
    const userID = userResult.rows[0].id;
    const defaultAge = age || null; 
    const defaultBio = bio || ''; 
    await pool.query(
      'INSERT INTO profiles (user_id, name, age, bio) VALUES ($1, $2, $3, $4)',
      [userID, name || '', defaultAge, defaultBio]
    );
    res.status(201).json({
      message: 'Регистрация успешна!',
      redirectURL: '/login' 
    });
  } catch (err) {
    console.error('Ошибка регистрации', err);
    res.status(500).json({ error: 'Server error' });
  }
});
//Авторизация пользователя
app.post('/login', async (req, res) => {
  console.log('Сессия после входа:', req.session);
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: 'Не верный email или пароль' });
    }
    const user = result.rows[0];
    // Проверяем пароль
    if (user.password !== password) {
      return res.status(401).json({ message: 'Не верный email или пароль' });
    }
    req.session.userId = user.id;
    console.log('Установлена сессия:', req.session);
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Ошибка сохранения сессии:', err);
          reject(new Error('Ошибка сохранения сессии'));
        } else {
          console.log('Сессия сохранена:', req.session);
          resolve();
        }
      });
    });
    res.status(200).json({ message: 'Добро пожаловать!' });
  } catch (err) {
    console.error('Ошибка при установке сессии:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

//Профиль пользователя
app.get('/profile', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM public.profiles WHERE user_id = $1", [req.userId],
    );
    if (result.rows.length === 0) {
      console.log('Профиль не найден для userId:', req.userId);
      return res.status(404).json({ message: 'Профиль не найден' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
// Выход из профиля
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Ошибка уничтожения сессии:', err);
      return res.status(500).json({ message: 'Ошибка выхода из системы' });
    }
    console.log('Пользователь вышел из системы');
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Выход успешен' });
  });
});


// Получить задачи пользователя
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.tasks WHERE user_id = $1',
      [req.userId]
    );
    res.json(result.rows);
    console.log('Результат запроса:', result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавить задачу
app.post('/tasks1', authenticate, async (req, res) => {
  const { title, description, due_date } = req.body;
  const creatorId = req.userId;
  if (!title || !description || !due_date) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO public.tasks (user_id, assignee_id, title, description, due_date, creator_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, due_date, creator_id',
      [creatorId, null, title, description, due_date, creatorId]
    );
    const newTask = result.rows[0]; 
    res.status(201).json(newTask); 
  } catch (err) {
    console.error('Ошибка при добавлении задачи:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.put('/tasks/:id/assign', authenticate, async (req, res) => {
  const taskId = req.params.id;
  const { assigneeId } = req.body; 
  const creatorId = req.userId; 

  // Задача существует
  const taskResult = await pool.query('SELECT * FROM public.tasks WHERE id = $1', [taskId]);
  const task = taskResult.rows[0];

  if (!task) {
    return res.status(404).json({ message: 'Задача не найдена' });
  }

  if (task.creator_id !== creatorId) {
    return res.status(403).json({ message: 'Только создатель задачи может назначать других пользователей' });
  }

  // Обновим назначенного пользователя
  try {
    const updateResult = await pool.query(
      'UPDATE public.tasks SET assignee_id = $1 WHERE id = $2 RETURNING id, assignee_id',
      [assigneeId, taskId]
    );
    const updatedTask = updateResult.rows[0];
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Ошибка при назначении задачи:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


app.delete('/tasks/:id', authenticate, async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    } 
    const result = await pool.query(
      'SELECT * FROM public.tasks WHERE id = $1',
      [taskId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete this task' });
    }
    await pool.query('DELETE FROM public.tasks WHERE id = $1', [taskId]);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
