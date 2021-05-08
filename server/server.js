import express from "express";
import Route from './route';

const app = express();

app.use(express.json());
app.use('/v1', Route);

// app.get("/users/:userId", async function (req, res) {
//     console.log('KKKKKKKKKKKKKK');
//     console.log(req.headers, '?????????????????????????')
//     const params = {
//       TableName: 'users',
//       Key: {
//         email: 'ejykken@gmail.com',
//       },
//     };

//     try {
//       const { Item } = await dynamoDbClient.get(params).promise();
//       console.log(Item, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
//       if (Item) {
//         const { userId, name } = Item;
//         res.json({ userId, name });
//       } else {
//         res
//           .status(404)
//           .json({ error: 'Could not find user with provided "userId"' });
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Could not retreive user" });
//     }
//   });
app.use((req, res, next) => {
    return res.status(404).json({
      error: "Not Found",
    });
  });

export default app;
