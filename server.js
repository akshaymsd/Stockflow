const express = require('express');
const app = express();


app.use(express.json());
app.use(express.static('public'));
app.use('/products',require('./routes/products'));
app.use('/customers',require('./routes/customers'));
app.use('/suppliers',require('./routes/suppliers'));
app.use('/purchases', require('./routes/purchases'));
app.use('/sales', require('./routes/sales'));
app.use('/reports', require('./routes/reports'));
app.use('/auth', require('./routes/auth'));


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});