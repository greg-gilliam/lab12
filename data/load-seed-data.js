const client = require('../lib/client');
// import our seed data:
const toDoList = require('./toDoList.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
    

    await Promise.all(
      toDoList.map(toDo => {
        return client.query(`
                    INSERT INTO to_do_list (to_do, completed, user_id)
                    VALUES ($1, $2, $3);
                `,
        [toDo.to_do, toDo.completed, toDo.user_id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
