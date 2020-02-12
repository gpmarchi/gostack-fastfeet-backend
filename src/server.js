import server from './app';

const port = process.env.EXPRESS_PORT;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
