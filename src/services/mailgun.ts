"use server";
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const { MAILGUN_API_KEY } = process.env;

export const sendEmail = async (email: string) => {
  console.log("Sending email to:..", email);
    const mailgun = new Mailgun(formData);
  const mg = mailgun.client({username: 'api', key: MAILGUN_API_KEY || 'key-yourkeyhere'});

  mg.messages.create('sandbox-123.mailgun.org', {
  	from: "Mailgun User <mailgun@sandbox6ef4dc9e2e2a464d8c4fe96487b7f188.mailgun.org>",
  	to: [email],
  	subject: "Hello",
  	text: "Testing some Mailgun awesomeness!",
  	html: "<h1>Testing some Mailgun awesomeness!</h1>"
  })
  .then(msg => console.log(msg)) // logs response data
  .catch(err => console.log(err)); // logs any error
};

  