const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const stripe = require('stripe')('your_stripe_secret_key');
const handlebars = require('express-handlebars');
const path = require('path');
const port = process.env.PORT || 3000;
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/charge', (req, res) => {
    stripe.customers
    .create({
      email: req.body.stripeEmail,
    })
    .then((customer) => {
      return stripe.invoiceItems.create({
      customer: customer.id,
      amount: 2500,
      currency: 'usd',
      description: 'New Web development e-book',
    })
    .then(charge => res.render('success'))
    .catch((err) => {
        throw err;
    });
  })
})

app.listen(port, () => {
    console.log(`connected successfully on port: ${port}`);
});