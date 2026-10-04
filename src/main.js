
import express from 'express'
import { authenticationController, noteController, userController } from './modules/index.js';
import { globalErrorHandling } from './middleware/index.js';
import { PORT } from './config.js';
import { bootstrapDB } from './DB/connection.db.js';


const app = express()
const port = PORT;

app.use(express.json());

bootstrapDB(app, port)

app.get('/', (req, res) => res.send('Welcome To Our Note API '))

app.use('/auth', authenticationController)
app.use('/note', noteController)
app.use('/user', userController)





// Routing Error
app.all('/*dummy', (req, res) => {
    res.status(404).json({ message: 'Not Found Routes' })
})

// Error MiddleWare
app.use(globalErrorHandling)


