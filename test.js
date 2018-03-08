// const stripe = require('stripe')('sk_test_ZYOq3ukyy4vckadi7twhdL9f');
const mysql = require('./src/config/mysql.js');


// mysql.getRepositoriesByIds({
//   ids: ['Alice0000001'],
// })
// .then((value) => {
//   console.log(value);
// });

// stripe.invoices.retrieveUpcoming('cus_C4jZnuoBo5VHnY')
// .then((value) => {
//   console.log(value);
// })
// .catch((err) => console.log(err));

// stripe.subscriptions.list({
//   customer: 'cus_C0dGvAfQIxfCoR',
// })
// .then((value) => {
//   console.log(value);
//   // const subId = value.data[0].id;
//   // stripe.subscriptions.update(subId)
// });

// stripe.subscriptions.retrieve('sub_C16CdgpoSTp1J1')
// .then(value => console.log(value));

// Cancel sub at period end
// stripe.subscriptions.del('sub_C154l6PhdyIK42', {
//   at_period_end: true,
// })
// .then((value) => {
//   console.log(value);
// })
// .catch((err) => {
//   console.log(err);
// });

// Re-activate sub
// stripe.subscriptions.retrieve('sub_C166ZhRHNZjZLE')
// .then((subscription) => {
//   return subscription.items.data[0].id;
// })
// .then((item_id) => {
//   return stripe.subscriptions.update('sub_C166ZhRHNZjZLE', {
//     items: [{
//       id: item_id,
//       plan: 'basic-monthly',
//     }],
//   });
// })
// .then((value) => {
//   console.log(value);
// });

// Create new sub
// stripe.subscriptions.create({
//   customer: 'cus_C0dGvAfQIxfCoR',
//   items: [
//     { plan: 'basic-monthly' },
//   ],
// })
// .then((value) => {
//   console.log(value);
// });

// stripe.customers.retrieve('cus_C0dGvAfQIxfCoR')
// .then((value) => {
//   console.log(value.subscriptions);
// });
