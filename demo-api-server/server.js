require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const usersData = require('./user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api.
app.post('/user/user-info', (req, res, next) => {
   const { data } = req.body;

   if (!data) {
      return res.status(400).json({
         error: 'Bad request',
         message: 'Data field not found',
      });
   }

   const findUsers = usersData.filter((obj) => data.includes(obj.userId));

   console.log('findUsers =>', findUsers);

   if (findUsers) {
      return res.status(200).json({
         success: true,
         error: false,
         users: findUsers,
      });
   }

   return res.status(404).json({
      success: false,
      error: true,
      message: 'User not found',
   });
});

app.listen(port, () => {
   console.log(`server listening on ${port}`);
});
