const express = require('express');
const authRouter = require('./routers/auth');
const cookieParser = require('cookie-parser');
const docRouter = require('./routers/docFun');
const appRouter = require('./routers/appointmentFun');
const cors = require('cors');
const uploadRouter = require('./routers/upload');
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({limit:'50mb',extended:true}))
// Routers

app.use('/auth',authRouter)
app.use("/docfun",docRouter)
app.use("/appFun",appRouter)
app.use("/upload",uploadRouter)


let port = '8080'


app.use((req,res)=>{
    res.json({
        message : "Page not found"
    })
})

app.listen(process.env.PORT||port,()=>{
    console.log(`Server running on port ${port}`);
})