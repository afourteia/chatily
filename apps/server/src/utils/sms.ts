export const sendSMS = async (phone: string, message: string) => {
  return new Promise((resolve, _reject) => {
    console.log(`Sending SMS to ${phone}: ${message}`);
    setTimeout(() => {
      console.log('SMS sent');
      resolve(true);
    }, 1000);
  });
};
