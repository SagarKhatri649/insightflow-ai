// import getDbConnection from "./db";
// export async function handleCheckOutSessionCompleted({
//   session,
//   stripe,
// }:{
//   session: StreamPipeOptions.Checkout.Session;
//   stripe:Stripe,

// }){

//   const  customerId = session.customer as string;
//   const customer  = await stripe.customer.retrieve(customerId);
//   const price_id = session.line_items?.data[0].price?.id;
  
//   const sql = await getDbConnection();

//   if("email" in customer && price_id) {
//     await createOrUpdateUser(sql,customer, customerId);

//     //upadate user subcription
//      await updateUserSubcription(sql,price_id, customer.email as string);

//      // insert the payment

//       await insertPayment(sql,session, customer.email as string);

//   }
// }





 
// async function createOrUpdateUser(
//   sql: any,
//   customer: StripeCustomer,
//   customerId: string
// ) {
  
//   try{
//   const sql = await getDbConnection();
//   const user = await sql`SELECT * FROM users email= ${customer.email}`;

//   if(user.length === 0){
//     await sql`INSERT INTO user (email,full_name,customer_id) VALUES (${customer.email}, ${customer.name}, ${customerId})`;
//   }
// } catch (err){
//   console.error("Error in inserting user",err);
// }
// }


// async function updateUserSubcription(
//   sql: any,
//   priceId: string,
//   email:string
// ) {
  
//   try{
   
//     await sql`UPDATE INTO user SET price_id = ${priceId}, status = 'active' where email = ${email}`;

// } catch (err){
//   console.error("Error in inserting user",err);
// }
// }


// async function insinsertPaymentert(
//   sql: any,
//   session: Stripe.Checkout.Session,
//   priceId: string,
//   customerEmail: string
// ) {
  
//   try{
   
//     await sql`INSERT INTO payments (amount,status,stripe_payment_id,price_id,user_email) VALUES (${session.amount_total}, ${session.status}, ${session.id}, ${priceId}, ${customerEmail});`

// } catch (err){
//   console.error("Error in inserting user",err);
// }
// }