require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const usersData = require('./user');
const fs = require('fs');
const path = require('path');

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

app.post('/user/update-user-price', (req, res, next) => {
   const { type, userId, amountInUsd } = req.body;

   let updateUserPrice;
   if (type === 'lotteryDrawResultPrice') {
      updateUserPrice = usersData.map((el) =>
         el?.userId === userId
            ? { ...el, amountInUsd: el?.amountInUsd + +amountInUsd }
            : el,
      );
   }
   if (type === 'buyLotteryTickets') {
      updateUserPrice = usersData.map((el) =>
         el?.userId === userId
            ? { ...el, amountInUsd: el?.amountInUsd - +amountInUsd }
            : el,
      );
   }

   fs.writeFile(
      path.join(__dirname, 'user.json'),
      JSON.stringify(updateUserPrice),
      function (err, data) {
         if (err) {
            console.log(err);
         }
         console.log(data);
      },
   );

   return res.status(200).json({
      success: true,
      error: false,
      message: 'User updated',
   });
});

app.listen(port, () => {
   console.log(`server listening on ${port}`);
});
