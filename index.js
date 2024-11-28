const express = require('express');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/account', accountRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
