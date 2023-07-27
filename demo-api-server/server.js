require('dotenv').config();
const express = require('express');
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
   console.log(`server listening on ${port}`);
});
